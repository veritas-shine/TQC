
import _ from 'lodash'
import $ from '../util/preconditions'

import BufferUtil from '../util/buffer';
const JSUtil = require('../util/js');

import PublicKey from '../publickey'

const errors = require('../errors');
import Signature from '../crypto/signature'

/**
 * @desc
 * Wrapper around Signature with fields related to signing a transaction specifically
 *
 * @param {Object|string|TransactionSignature} arg
 * @constructor
 */
export default class TransactionSignature extends Signature {
  constructor(arg) {
    super(arg)
    if (_.isObject(arg)) {
      return this._fromObject(arg);
    }
  }

  _fromObject(arg) {
    this._checkObjectArgs(arg);
    this.publicKey = new PublicKey(arg.publicKey);
    this.prevTxId = BufferUtil.isBuffer(arg.prevTxId) ? arg.prevTxId : Buffer.from(arg.prevTxId, 'hex');
    this.outputIndex = arg.outputIndex;
    this.inputIndex = arg.inputIndex;
    this.signature = (arg.signature instanceof Signature) ? arg.signature :
        BufferUtil.isBuffer(arg.signature) ? Signature.fromBuffer(arg.signature) :
            Signature.fromString(arg.signature);
    this.sigtype = arg.sigtype;
    return this;
  };

  _checkObjectArgs(arg) {
    $.checkArgument(new PublicKey(arg.publicKey), 'publicKey');
    $.checkArgument(!_.isUndefined(arg.inputIndex), 'inputIndex');
    $.checkArgument(!_.isUndefined(arg.outputIndex), 'outputIndex');
    $.checkState(_.isNumber(arg.inputIndex), 'inputIndex must be a number');
    $.checkState(_.isNumber(arg.outputIndex), 'outputIndex must be a number');
    $.checkArgument(arg.signature, 'signature');
    $.checkArgument(arg.prevTxId, 'prevTxId');
    $.checkState(arg.signature instanceof Signature ||
        BufferUtil.isBuffer(arg.signature) ||
        JSUtil.isHexa(arg.signature), 'signature must be a buffer or hexa value');
    $.checkState(BufferUtil.isBuffer(arg.prevTxId) ||
        JSUtil.isHexa(arg.prevTxId), 'prevTxId must be a buffer or hexa value');
    $.checkArgument(arg.sigtype, 'sigtype');
    $.checkState(_.isNumber(arg.sigtype), 'sigtype must be a number');
  };

  /**
   * Serializes a transaction to a plain JS object
   * @return {Object}
   */
  toJSON() {
    return {
      publicKey: this.publicKey.toString(),
      prevTxId: this.prevTxId.toString('hex'),
      outputIndex: this.outputIndex,
      inputIndex: this.inputIndex,
      signature: this.signature.toString(),
      sigtype: this.sigtype
    };
  };

  toObject = this.toJSON
  /**
   * Builds a TransactionSignature from an object
   * @param {Object} object
   * @return {TransactionSignature}
   */
  static fromObject(object) {
    $.checkArgument(object);
    return new TransactionSignature(object)
  }
}
