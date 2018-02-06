import _ from 'lodash'
import JSUtil from './util/js'
import Hash from './crypto/hash'

import Network from './networks'
import $ from './util/preconditions'
import Address from './address'
import BufferUtil from './util/buffer'
import PrivateKey from './privatekey'

/**
 * Instantiate a PublicKey from a {@link PrivateKey}, `string`, or `Buffer`.
 *
 * buffer structure:
 *   ----------------------------------------------------------
 *   | header | signBufferLength | signBuffer | encryptBuffer |
 *   ----------------------------------------------------------
 * There are two internal properties, `network` and `compressed`, that deal with importing
 * a PublicKey from a PrivateKey in WIF format. More details described on {@link PrivateKey}
 *
 * @example
 * ```javascript
 * // instantiate from a private key
 * var key = PublicKey(privateKey, true)
 *
 * // export to as a DER hex encoded string
 * var exported = key.toString()
 *
 * // import the public key
 * var imported = PublicKey.fromString(exported)
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Object} extra - additional options
 * @param {Network=} extra.network - Which network should the address for this public key be for
 * @param {String=} extra.compressed - If the public key is compressed
 * @returns {PublicKey} A new valid instance of an PublicKey
 * @constructor
 */
export default class PublicKey {
  constructor(data, extra) {
    $.checkArgument(data, 'First argument is required, please include public key data.')

    if (data instanceof PublicKey) {
      // Return copy, but as it's an immutable object, return same argument
      return data
    }
    extra = extra || {}

    const info = PublicKey._classifyArgs(data, extra)
    JSUtil.defineImmutable(this, {
      signKey: info.signKey,
      buffer: info.buffer,
      compressed: info.compressed,
      network: info.network || Network.defaultNetwork
    })

    return this
  }


  /**
   * Internal function to differentiate between arguments passed to the constructor
   * @param {*} data
   * @param {Object} extra
   */
  static _classifyArgs(data, extra) {
    /* jshint maxcomplexity: 10 */
    let info = {
      compressed: _.isUndefined(extra.compressed) || extra.compressed
    }

    // detect type of data
    if (data.buffer) {
      info.buffer = data.buffer
      info.signKey = data.signKey
      info.network = data.network
    } else if (typeof (data) === 'string') {
      info = PublicKey._transformDER(Buffer.from(data, 'hex'))
    } else if (BufferUtil.isBuffer(data)) {
      info = PublicKey._transformDER(data)
    } else if (PublicKey._isPrivateKey(data)) {
      info = PublicKey._transformPrivateKey(data)
    } else {
      throw new TypeError('First argument is an unrecognized data format.')
    }
    if (!info.network) {
      info.network = _.isUndefined(extra.network) ? undefined : Network.get(extra.network)
    }
    return info
  }

  /**
   * Internal function to detect if an object is a {@link PrivateKey}
   *
   * @param {*} param - object to test
   * @returns {boolean}
   * @private
   */
  static _isPrivateKey(param) {
    return param instanceof PrivateKey
  }

  /**
   * Internal function to transform a private key into a public key point
   *
   * @param {PrivateKey} privkey - An instance of PrivateKey
   * @returns {Object} An object with keys: point and compressed
   * @private
   */
  static _transformPrivateKey(privkey) {
    $.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey')

    const publicKey = privkey.keypair.public
    const signKey = privkey.signKeypair.public
    const info = {}
    info.buffer = publicKey
    info.signKey = signKey
    info.compressed = privkey.compressed
    info.network = privkey.network
    return info
  }

  /**
   * Internal function to transform DER into a public key point
   *
   * @param {Buffer} buf - An hex encoded buffer
   * @param {bool=} strict - if set to false, will loosen some conditions
   * @returns {Object} An object with keys: point and compressed
   * @private
   */
  static _transformDER(buf) {
    $.checkArgument(BufferUtil.isBuffer(buf), 'Must be a hex buffer of DER encoded public key')

    // const header = buf[0]
    const signBufferLength = buf[1]
    const signBuffer = buf.slice(2, 2 + signBufferLength)
    const encryptBuffer = buf.slice(2 + signBufferLength, buf.length)
    // TODO
    return {
      buffer: encryptBuffer,
      signKey: signBuffer
    }
  }

  /**
   * Instantiate a PublicKey from a PrivateKey
   *
   * @param {PrivateKey} privkey - An instance of PrivateKey
   * @returns {PublicKey} A new valid instance of PublicKey
   */
  static fromPrivateKey(privkey) {
    $.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey')
    const info = PublicKey._transformPrivateKey(privkey)
    return new PublicKey(info)
  }

  /**
   * Instantiate a PublicKey from a Buffer
   * @param {Buffer} buf - A DER hex buffer
   * @param {bool=} strict - if set to false, will loosen some conditions
   * @returns {PublicKey} A new valid instance of PublicKey
   */
  static fromBuffer(buf, strict) {
    $.checkArgument(BufferUtil.isBuffer(buf), 'Must be a hex buffer of DER encoded public key')
    if (buf[0] !== 0x04) {
      throw new TypeError('Invalid buffer')
    }
    const info = PublicKey._transformDER(buf, strict)
    return new PublicKey(info)
  }

  static fromDER = PublicKey.fromBuffer

  /**
   * Instantiate a PublicKey from a DER hex encoded string
   *
   * @param {string} str - A DER hex string
   * @param {String=} encoding - The type of string encoding
   * @returns {PublicKey} A new valid instance of PublicKey
   */
  static fromString(str, encoding) {
    const buf = Buffer.from(str, encoding || 'hex')
    const info = PublicKey._transformDER(buf)
    return new PublicKey(info)
  }

  /**
   * Check if there would be any errors when initializing a PublicKey
   *
   * @param {string} data - The encoded data in various formats
   * @returns {null|Error} An error if exists
   */
  static getValidationError(data) {
    let error
    try {
      /* jshint nonew: false */
      new PublicKey(data)
    } catch (e) {
      error = e
    }
    return error
  }

  /**
   * Check if the parameters are valid
   *
   * @param {string} data - The encoded data in various formats
   * @returns {Boolean} If the public key would be valid
   */
  static isValid(data) {
    return !PublicKey.getValidationError(data)
  }

  /**
   * @returns {Object} A plain object of the PublicKey
   */
  toJSON() {
    return {
      buffer: this.buffer,
      signKey: this.signKey,
      compressed: this.compressed
    }
  }

  toObject = this.toJSON

  /**
   * Will output the PublicKey to a DER Buffer
   *
   * @returns {Buffer} A DER hex encoded buffer
   */
  toBuffer = this.toDER

  toDER() {
    const signKeyLength = this.signKey.length
    const prefix = Buffer.from([0x04, signKeyLength])
    return Buffer.concat([prefix, this.signKey, this.buffer])
  }

  /**
   * Will return a sha256 + ripemd160 hash of the serialized public key
   * @see https://github.com/bitcoin/bitcoin/blob/master/src/pubkey.h#L141
   * @returns {Buffer}
   */
  _getID() {
    return Hash.sha256ripemd160(this.toBuffer())
  }

  /**
   * Will return an address for the public key
   *
   * @param {String|Network=} network - Which network should the address be for
   * @returns {Address} An address generated from the public key
   */
  toAddress(network) {
    return Address.fromPublicKey(this, network || this.network)
  }

  /**
   * Will output the PublicKey to a DER encoded hex string
   *
   * @returns {string} A DER hex encoded string
   */
  toString() {
    return this.toDER().toString('hex')
  }

  /**
   * Will return a string formatted for the console
   *
   * @returns {string} Public key
   */
  inspect() {
    return `<PublicKey: ${this.toString()}${this.compressed ? '' : ', uncompressed'}>`
  }
}
