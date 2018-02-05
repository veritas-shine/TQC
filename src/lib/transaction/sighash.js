import _ from 'lodash'
import xmss from 'xmss'
import BN from '../crypto/bn'
import Hash from '../crypto/hash'
import $ from '../util/preconditions'
import Signature from '../crypto/signature'
import Script from '../script'
import Output from './output'
import BufferReader from '../encoding/bufferreader'
import BufferWriter from '../encoding/bufferwriter'

const SIGHASH_SINGLE_BUG = '0000000000000000000000000000000000000000000000000000000000000001';
const BITS_64_ON = 'ffffffffffffffff';

/**
 * Returns a buffer of length 32 bytes with the hash that needs to be signed
 * for OP_CHECKSIG.
 *
 * @name Signing.sighash
 * @param {Transaction} transaction the transaction to sign
 * @param {number} sighashType the type of the hash
 * @param {number} inputNumber the input index for the signature
 * @param {Script} subscript the script that will be signed
 */
function sighash(transaction, sighashType, inputNumber, subscript) {
  const Transaction = require('./transaction');
  const Input = require('./input');

  let i;
  // Copy transaction
  const txcopy = Transaction.shallowCopy(transaction);

  // Copy script
  subscript = new Script(subscript);
  subscript.removeCodeseparators();

  for (i = 0; i < txcopy.inputs.length; i++) {
    // Blank signatures for other inputs
    txcopy.inputs[i] = new Input(txcopy.inputs[i]).setScript(Script.empty());
  }

  txcopy.inputs[inputNumber] = new Input(txcopy.inputs[inputNumber]).setScript(subscript);

  if ((sighashType & 31) === Signature.SIGHASH_NONE ||
    (sighashType & 31) === Signature.SIGHASH_SINGLE) {
    // clear all sequenceNumbers
    for (i = 0; i < txcopy.inputs.length; i++) {
      if (i !== inputNumber) {
        txcopy.inputs[i].sequenceNumber = 0;
      }
    }
  }

  if ((sighashType & 31) === Signature.SIGHASH_NONE) {
    txcopy.outputs = [];
  } else if ((sighashType & 31) === Signature.SIGHASH_SINGLE) {
    // The SIGHASH_SINGLE bug.
    // https://pqcointalk.org/index.php?topic=260595.0
    if (inputNumber >= txcopy.outputs.length) {
      return new Buffer(SIGHASH_SINGLE_BUG, 'hex');
    }

    txcopy.outputs.length = inputNumber + 1;

    for (i = 0; i < inputNumber; i++) {
      txcopy.outputs[i] = new Output({
        glv: BN.fromBuffer(Buffer.from(BITS_64_ON, 'hex')),
        script: Script.empty()
      });
    }
  }

  if (sighashType & Signature.SIGHASH_ANYONECANPAY) {
    txcopy.inputs = [txcopy.inputs[inputNumber]];
  }

  const buf = new BufferWriter()
    .write(txcopy.toBuffer())
    .writeInt32LE(sighashType)
    .toBuffer();
  let ret = Hash.sha256sha256(buf);
  ret = new BufferReader(ret).readReverse();
  return ret;
}

/**
 * Create a signature
 *
 * @name Signing.sign
 * @param {Transaction} transaction
 * @param {PrivateKey} privateKey
 * @param {number} sighash
 * @param {number} inputIndex
 * @param {Script} subscript
 * @return {Signature}
 */
function sign(transaction, privateKey, sighashType, inputIndex, subscript) {
  const hashbuf = sighash(transaction, sighashType, inputIndex, subscript);
  const sig = xmss.sign(hashbuf, privateKey);
  return sig;
}

/**
 * Verify a signature
 *
 * @name Signing.verify
 * @param {Transaction} transaction
 * @param {Signature} signature
 * @param {PublicKey} publicKey
 * @param {number} inputIndex
 * @param {Script} subscript
 * @return {boolean}
 */
function verify(transaction, signature, publicKey, inputIndex, subscript) {
  $.checkArgument(!_.isUndefined(transaction));
  $.checkArgument(!_.isUndefined(signature) && !_.isUndefined(signature.nhashtype));
  const hashbuf = sighash(transaction, signature.nhashtype, inputIndex, subscript);
  return xmss.verify(signature, hashbuf, publicKey);
}

/**
 * @namespace Signing
 */
module.exports = {
  sighash,
  sign,
  verify
};
