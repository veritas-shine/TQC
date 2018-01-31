import _ from 'lodash'
import Address from './address'
import JSUtil from './util/js'
import Networks from './networks'
import PublicKey from './publickey'
import Base58Check from './encoding/base58check'
import $ from './util/preconditions'
import nacl from 'tweetnacl'

/**
 * Instantiate a PrivateKey from a Buffer.
 *
 * @example
 * ```javascript
 * // generate a new random key
 * var key = PrivateKey()
 *
 * // get the associated address
 * var address = key.toAddress()
 *
 * // encode into wallet export format
 * var exported = key.toWIF()
 *
 * // instantiate from the exported (and saved) private key
 * var imported = PrivateKey.fromWIF(exported)
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {PrivateKey} A new valid instance of an PrivateKey
 * @constructor
 */

/**
 * Instantiate a PrivateKey from Buffer.
 *
 * @example
 * ```javascript
 * // generate a new random key
 * var key = PrivateKey()
 *
 * // get the associated address
 * var address = key.toAddress()
 *
 * // encode into wallet export format
 * var exported = key.toWIF()
 *
 * // instantiate from the exported (and saved) private key
 * var imported = PrivateKey.fromWIF(exported)
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Network|string=} network - a {@link Network} object, or a string with the network name
 * @returns {PrivateKey} A new valid instance of an PrivateKey
 * @constructor
 */
export default class PrivateKey {
  constructor(data, network) {
    if (!(this instanceof PrivateKey)) {
      return new PrivateKey(data, network)
    }
    if (data instanceof PrivateKey) {
      return data
    }

    var info = this._classifyArguments(data, network)

    // validation
    if (typeof(info.network) === 'undefined') {
      throw new TypeError('Must specify the network ("livenet" or "testnet")')
    }

    JSUtil.defineImmutable(this, {
      bn: info.bn,
      compressed: info.compressed,
      network: info.network
    })

    Object.defineProperty(this, 'publicKey', {
      configurable: false,
      enumerable: true,
      get: this.toPublicKey.bind(this)
    })
  }


  /**
   * Internal helper to instantiate PrivateKey internal `info` object from
   * different kinds of arguments passed to the constructor.
   *
   * @param {*} data
   * @param {Network|string=} network - a {@link Network} object, or a string with the network name
   * @return {Object}
   */
  _classifyArguments(data, network) {
    /* jshint maxcomplexity: 10 */
    var info = {
      compressed: false,
      network: network ? Networks.get(network) : Networks.defaultNetwork
    }

    // detect type of data
    if (_.isUndefined(data) || _.isNull(data)){
      info.bn = PrivateKey._getRandomBuffer()
    } else if (data instanceof Buffer || data instanceof Uint8Array) {
      info = PrivateKey._transformBuffer(data, network)
    } else if (data.bn && data.network){
      info = PrivateKey._transformObject(data)
    } else if (!network && Networks.get(data)) {
      info.bn = PrivateKey._getRandomBuffer()
      info.network = Networks.get(data)
    } else if (typeof(data) === 'string'){
      if (JSUtil.isHexa(data)) {
        info.bn = new Buffer(data, 'hex')
      } else {
        // from WIF string
        info = PrivateKey._transformWIF(data, network)
      }
    } else {
      throw new TypeError('First argument is an unrecognized data type.')
    }
    return info
  }

  /**
   * Internal function to get a random Buffer
   *
   * @returns {Uint8Array} A new randomly generated Buffer
   * @private
   */
  static _getRandomBuffer() {
    const buf = nacl.randomBytes(64)
    return buf
  }

  /**
   * Internal function to transform a Buffer into a private key
   *
   * @param {Buffer} buf
   * @param {Network|string=} network - a {@link Network} object, or a string with the network name
   * @returns {Object} An object with keys: bn, network and compressed
   * @private
   */
  static _transformBuffer(buf, network) {

    var info = {network}

    if (!network) {
      info.network = Networks.get(buf[0], 'privatekey')
    }
    if (!info.network) {
      throw new Error('Invalid network')
    }

    if (network && info.network !== Networks.get(network)) {
      throw new TypeError('Private key network mismatch')
    }

    info.compressed = false
    info.bn = buf

    return info
  }
  /**
   * Internal function to transform a WIF string into a private key
   *
   * @param {string} str - An WIF string
   * @returns {Object} An object with keys: bn, network and compressed
   * @private
   */
  static _transformWIF (str, network) {
    return PrivateKey._transformBuffer(Base58Check.decode(str), network);
  };

  /**
   * Instantiate a PrivateKey from a Buffer with the DER or WIF representation
   *
   * @param {Buffer} arg
   * @param {Network} network
   * @return {PrivateKey}
   */
  static fromBuffer(arg, network) {
    return new PrivateKey(arg, network)
  }

  /**
   * Internal function to transform a JSON string on plain object into a private key
   * return this.
   *
   * @param {string} json - A JSON string or plain object
   * @returns {Object} An object with keys: bn, network and compressed
   * @private
   */
  static _transformObject (json) {
    var bn = Buffer.from(json.bn, 'hex')
    var network = Networks.get(json.network)
    return {
      bn: bn,
      network: network,
      compressed: json.compressed
    }
  }

  /**
   * Instantiate a PrivateKey from a string
   *
   * @param {string} str - The WIF encoded private key string
   * @returns {PrivateKey} A new valid instance of PrivateKey
   */
  static fromString (str) {
    $.checkArgument(_.isString(str), 'First argument is expected to be a string.')
    return new PrivateKey(str)
  }

  static fromWIF = PrivateKey.fromString

  /**
   * Instantiate a PrivateKey from a plain JavaScript object
   *
   * @param {Object} obj - The output from privateKey.toObject()
   */
  static fromObject (obj) {
    $.checkArgument(_.isObject(obj), 'First argument is expected to be an object.')
    return new PrivateKey(obj)
  }

  /**
   * Instantiate a PrivateKey from random bytes
   *
   * @param {string=} network - Either "livenet" or "testnet"
   * @returns {PrivateKey} A new valid instance of PrivateKey
   */
  static fromRandom (network) {
    var bn = PrivateKey._getRandomBuffer()
    network = network || Networks.defaultNetwork
    return new PrivateKey(bn, network)
  }

  /**
   * Check if there would be any errors when initializing a PrivateKey
   *
   * @param {string} data - The encoded data in various formats
   * @param {string=} network - Either "livenet" or "testnet"
   * @returns {null|Error} An error if exists
   */

  static getValidationError(data, network) {
    var error
    try {
      /* jshint nonew: false */
      new PrivateKey(data, network)
    } catch (e) {
      error = e
    }
    return error
  }

  /**
   * Check if the parameters are valid
   *
   * @param {string} data - The encoded data in various formats
   * @param {string=} network - Either "livenet" or "testnet"
   * @returns {Boolean} If the private key is would be valid
   */
  static isValid(data, network){
    if (!data) {
      return false
    }
    return !PrivateKey.getValidationError(data, network)
  }

  /**
   * Will output the PrivateKey encoded as hex string
   *
   * @returns {string}
   */
  toString() {
    return this.toBuffer().toString('hex')
  }

  /**
   * Will output the PrivateKey to a WIF string
   *
   * @returns {string} A WIF representation of the private key
   */
  toWIF() {
    let network = this.network
    let compressed = this.compressed

    let buf
    if (compressed) {
      buf = Buffer.concat([new Buffer([network.privatekey]), this.bn, new Buffer([0x01])])
    } else {
      buf = Buffer.concat([new Buffer([network.privatekey]), this.bn])
    }
    console.log(291, network.privatekey)
    return Base58Check.encode(buf)
  }

  /**
   * Will return the private key as a buffer
   *
   * @returns {Buffer} A buffer of the private key
   */
  toBuffer() {
    return new Buffer(this.bn)
  }

  /**
   * Will return the corresponding public key
   *
   * @returns {PublicKey} A public key generated from the private key
   */
  toPublicKey() {
    if (!this._pubkey) {
      this._pubkey = PublicKey.fromPrivateKey(this)
    }
    return this._pubkey
  }

  /**
   * Will return an address for the private key
   * @param {Network=} network - optional parameter specifying
   * the desired network for the address
   *
   * @returns {Address} An address generated from the private key
   */
  toAddress(network) {
    return this.toPublicKey().toAddress(network)
  }

  /**
   * @returns {Object} A plain object representation
   */
  toObject() {
    return {
      bn: this.bn.toString('hex'),
      compressed: this.compressed,
      network: this.network.toString()
    }
  }

  toJSON = this.toObject
  /**
   * Will return a string formatted for the console
   *
   * @returns {string} Private key
   */
  inspect() {
    var uncompressed = !this.compressed ? ', uncompressed' : ''
    return '<PrivateKey: ' + this.toString() + ', network: ' + this.network + uncompressed + '>'
  }

}
