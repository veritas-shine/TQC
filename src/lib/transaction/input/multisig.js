const _ = require('lodash');
const inherits = require('inherits');
const Transaction = require('../transaction');
const Input = require('./input');
const Output = require('../output');
import $ from '../../util/preconditions'

import Script from '../../script'
import Signature from '../../crypto/signature'
const Sighash = require('../sighash');
import PublicKey from '../../publickey'
import BufferUtil from '../../util/buffer'
import TransactionSignature from '../signature'

/**
 * @constructor
 */
function MultiSigInput(input, pubkeys, threshold, signatures) {
  Input.apply(this, arguments);
  const self = this;
  pubkeys = pubkeys || input.publicKeys;
  threshold = threshold || input.threshold;
  signatures = signatures || input.signatures;
  this.publicKeys = _.sortBy(pubkeys, (publicKey) => { return publicKey.toString('hex'); });
  const outScript = Script.buildMultisigOut(this.publicKeys, threshold)
  $.checkState(outScript.equals(this.output.script), 'Provided public keys don\'t match to the provided output script')
  this.publicKeyIndex = {};
  _.each(this.publicKeys, (publicKey, index) => {
    self.publicKeyIndex[publicKey.toString()] = index;
  });
  this.threshold = threshold;
  // Empty array of signatures
  this.signatures = signatures ? this._deserializeSignatures(signatures) : new Array(this.publicKeys.length);
}
inherits(MultiSigInput, Input);

MultiSigInput.prototype.toObject = function () {
  const obj = Input.prototype.toObject.apply(this, arguments);
  obj.threshold = this.threshold;
  obj.publicKeys = _.map(this.publicKeys, (publicKey) => { return publicKey.toString(); });
  obj.signatures = this._serializeSignatures();
  return obj;
};

MultiSigInput.prototype._deserializeSignatures = function (signatures) {
  return _.map(signatures, (signature) => {
    if (!signature) {
      return undefined;
    }
    return new TransactionSignature(signature);
  });
};

MultiSigInput.prototype._serializeSignatures = function () {
  return _.map(this.signatures, (signature) => {
    if (!signature) {
      return undefined;
    }
    return signature.toObject();
  });
};

MultiSigInput.prototype.getSignatures = function (transaction, privateKey, index, sigtype) {
  $.checkState(this.output instanceof Output);
  sigtype = sigtype || Signature.SIGHASH_ALL;

  const self = this;
  const results = [];
  _.each(this.publicKeys, (publicKey) => {
    if (publicKey.toString() === privateKey.publicKey.toString()) {
      results.push(new TransactionSignature({
        publicKey: privateKey.publicKey,
        prevTxId: self.prevTxId,
        outputIndex: self.outputIndex,
        inputIndex: index,
        signature: Sighash.sign(transaction, privateKey, sigtype, index, self.output.script),
        sigtype
      }));
    }
  });

  return results;
};

MultiSigInput.prototype.addSignature = function (transaction, signature) {
  $.checkState(!this.isFullySigned(), 'All needed signatures have already been added');
  $.checkArgument(
    !_.isUndefined(this.publicKeyIndex[signature.publicKey.toString()]),
    'Signature has no matching public key'
  );
  $.checkState(this.isValidSignature(transaction, signature));
  this.signatures[this.publicKeyIndex[signature.publicKey.toString()]] = signature;
  this._updateScript();
  return this;
};

MultiSigInput.prototype._updateScript = function () {
  this.setScript(Script.buildMultisigIn(
    this.publicKeys,
    this.threshold,
    this._createSignatures()
  ));
  return this;
};

MultiSigInput.prototype._createSignatures = function () {
  return _.map(
    _.filter(this.signatures, (signature) => { return !_.isUndefined(signature); }),
    (signature) => {
      return BufferUtil.concat([
        signature.signature.toDER(),
        BufferUtil.integerAsSingleByteBuffer(signature.sigtype)
      ]);
    }
  );
};

MultiSigInput.prototype.clearSignatures = function () {
  this.signatures = new Array(this.publicKeys.length);
  this._updateScript();
};

MultiSigInput.prototype.isFullySigned = function () {
  return this.countSignatures() === this.threshold;
};

MultiSigInput.prototype.countMissingSignatures = function () {
  return this.threshold - this.countSignatures();
};

MultiSigInput.prototype.countSignatures = function () {
  return _.reduce(this.signatures, (sum, signature) => {
    return sum + (!!signature);
  }, 0);
};

MultiSigInput.prototype.publicKeysWithoutSignature = function () {
  const self = this;
  return _.filter(this.publicKeys, (publicKey) => {
    return !(self.signatures[self.publicKeyIndex[publicKey.toString()]]);
  });
};

MultiSigInput.prototype.isValidSignature = function (transaction, signature) {
  // FIXME: Refactor signature so this is not necessary
  signature.signature.nhashtype = signature.sigtype;
  return Sighash.verify(
    transaction,
    signature.signature,
    signature.publicKey,
    signature.inputIndex,
    this.output.script
  );
};

/**
 *
 * @param {Buffer[]} signatures
 * @param {PublicKey[]} publicKeys
 * @param {Transaction} transaction
 * @param {Integer} inputIndex
 * @param {Input} input
 * @returns {TransactionSignature[]}
 */
MultiSigInput.normalizeSignatures = function (transaction, input, inputIndex, signatures, publicKeys) {
  return publicKeys.map((pubKey) => {
    let signatureMatch = null;
    signatures = signatures.filter((signatureBuffer) => {
      if (signatureMatch) {
        return true;
      }

      const signature = new TransactionSignature({
        signature: Signature.fromTxFormat(signatureBuffer),
        publicKey: pubKey,
        prevTxId: input.prevTxId,
        outputIndex: input.outputIndex,
        inputIndex,
        sigtype: Signature.SIGHASH_ALL
      });

      signature.signature.nhashtype = signature.sigtype;
      const isMatch = Sighash.verify(
        transaction,
        signature.signature,
        signature.publicKey,
        signature.inputIndex,
        input.output.script
      );

      if (isMatch) {
        signatureMatch = signature;
        return false;
      }

      return true;
    });

    return signatureMatch || null;
  });
};

MultiSigInput.OPCODES_SIZE = 1; // 0
MultiSigInput.SIGNATURE_SIZE = 73; // size (1) + DER (<=72)

MultiSigInput.prototype._estimateSize = function () {
  return MultiSigInput.OPCODES_SIZE +
    this.threshold * MultiSigInput.SIGNATURE_SIZE;
};

module.exports = MultiSigInput;
