import _ from 'lodash'
import $ from './util/preconditions'
import Base58Check from './encoding/base58check'
import Networks from './networks'
import Hash from './crypto/hash'
import JSUtil from './util/js'
import PublicKey from './publickey'

/**
 * Instantiate an address from an address String or Buffer, a public key or script hash Buffer,
 * or an instance of {@link PublicKey} or {@link Script}.
 *
 * This is an immutable class, and if the first parameter provided to this constructor is an
 * `Address` instance, the same argument will be returned.
 *
 * An address has two key properties: `network` and `type`. The type is either
 * `Address.PayToPublicKeyHash` (value is the `'pubkeyhash'` string)
 * or `Address.PayToScriptHash` (the string `'scripthash'`). The network is an instance of {@link Network}.
 * You can quickly check whether an address is of a given kind by using the methods
 * `isPayToPublicKeyHash` and `isPayToScriptHash`
 *
 * @example
 * ```javascript
 * // validate that an input field is valid
 * var error = Address.getValidationError(input, 'testnet');
 * if (!error) {
 *   var address = Address(input, 'testnet');
 * } else {
 *   // invalid network or checksum (typo?)
 *   var message = error.messsage;
 * }
 *
 * // get an address from a public key
 * var address = Address(publicKey, 'testnet').toString();
 * ```
 *
 * @param {*} data - The encoded data in various formats
 * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 * @constructor
 */
export default class Address {

  constructor(data, network, type) {

    if (_.isArray(data) && _.isNumber(network)) {
      return Address.createMultisig(data, network, type);
    }

    if (data instanceof Address) {
      // Immutable instance
      return data;
    }

    $.checkArgument(data, 'First argument is required, please include address data.', 'guide/address.html');

    if (network && !Networks.get(network)) {
      throw new TypeError('Second argument must be "livenet" or "testnet".');
    }

    if (type && (type !== Address.PayToPublicKeyHash && type !== Address.PayToScriptHash)) {
      throw new TypeError('Third argument must be "pubkeyhash" or "scripthash".');
    }

    var info = this._classifyArguments(data, network, type);

    // set defaults if not set
    info.network = info.network || Networks.get(network) || Networks.defaultNetwork;
    info.type = info.type || type || Address.PayToPublicKeyHash;

    JSUtil.defineImmutable(this, {
      hashBuffer: info.hashBuffer,
      network: info.network,
      type: info.type
    });
  }


  /**
   * Internal function used to split different kinds of arguments of the constructor
   * @param {*} data - The encoded data in various formats
   * @param {Network|String|number=} network - The network: 'livenet' or 'testnet'
   * @param {string=} type - The type of address: 'script' or 'pubkey'
   * @returns {Object} An "info" object with "type", "network", and "hashBuffer"
   */
  _classifyArguments(data, network, type) {
    /* jshint maxcomplexity: 10 */
    // transform and validate input data
    if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 20) {
      return Address._transformHash(data);
    } else if ((data instanceof Buffer || data instanceof Uint8Array) && data.length === 21) {
      return Address._transformBuffer(data, network, type);
    } else if (data instanceof PublicKey) {
      return Address._transformPublicKey(data);
    } else if (typeof(data) === 'string') {
      return Address._transformString(data, network, type);
    } else if (_.isObject(data)) {
      return Address._transformObject(data);
    } else {
      throw new TypeError('First argument is an unrecognized data format.');
    }
  };

  /** @static */
  static PayToPublicKeyHash = 'pubkeyhash';
  /** @static */
  static PayToScriptHash = 'scripthash';


  /**
   * @param {Buffer} hash - An instance of a hash Buffer
   * @returns {Object} An object with keys: hashBuffer
   * @private
   */
  static _transformHash(hash) {
    var info = {};
    if (!(hash instanceof Buffer) && !(hash instanceof Uint8Array)) {
      throw new TypeError('Address supplied is not a buffer.');
    }
    if (hash.length !== 20) {
      throw new TypeError('Address hashbuffers must be exactly 20 bytes.');
    }
    info.hashBuffer = hash;
    return info;
  }

  /**
   * Deserializes an address serialized through `Address#toObject()`
   * @param {Object} data
   * @param {string} data.hash - the hash that this address encodes
   * @param {string} data.type - either 'pubkeyhash' or 'scripthash'
   * @param {Network=} data.network - the name of the network associated
   * @return {Address}
   */
  static _transformObject(data) {
    $.checkArgument(data.hash || data.hashBuffer, 'Must provide a `hash` or `hashBuffer` property');
    $.checkArgument(data.type, 'Must provide a `type` property');
    return {
      hashBuffer: data.hash ? new Buffer(data.hash, 'hex') : data.hashBuffer,
      network: Networks.get(data.network) || Networks.defaultNetwork,
      type: data.type
    };
  };


  /**
   * Internal function to discover the network and type based on the first data byte
   *
   * @param {Buffer} buffer - An instance of a hex encoded address Buffer
   * @returns {Object} An object with keys: network and type
   * @private
   */
  static _classifyFromVersion(buffer) {
    var version = {};

    var pubkeyhashNetwork = Networks.get(buffer[0], 'pubkeyhash');
    var scripthashNetwork = Networks.get(buffer[0], 'scripthash');

    if (pubkeyhashNetwork) {
      version.network = pubkeyhashNetwork;
      version.type = Address.PayToPublicKeyHash;
    } else if (scripthashNetwork) {
      version.network = scripthashNetwork;
      version.type = Address.PayToScriptHash;
    }

    return version;
  };

  /**
   * Internal function to transform a pqcoin address buffer
   *
   * @param {Buffer} buffer - An instance of a hex encoded address Buffer
   * @param {string=} network - The network: 'livenet' or 'testnet'
   * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
   * @returns {Object} An object with keys: hashBuffer, network and type
   * @private
   */
  static _transformBuffer(buffer, network, type) {
    /* jshint maxcomplexity: 9 */
    var info = {};
    if (!(buffer instanceof Buffer) && !(buffer instanceof Uint8Array)) {
      throw new TypeError('Address supplied is not a buffer.');
    }
    if (buffer.length !== 1 + 20) {
      throw new TypeError('Address buffers must be exactly 21 bytes.');
    }

    network = Networks.get(network);
    var bufferVersion = Address._classifyFromVersion(buffer);

    if (!bufferVersion.network || (network && network !== bufferVersion.network)) {
      throw new TypeError('Address has mismatched network type.');
    }

    if (!bufferVersion.type || (type && type !== bufferVersion.type)) {
      throw new TypeError('Address has mismatched type.');
    }

    info.hashBuffer = buffer.slice(1);
    info.network = bufferVersion.network;
    info.type = bufferVersion.type;
    return info;
  };
}


/**
 * Internal function to transform a {@link PublicKey}
 *
 * @param {PublicKey} pubkey - An instance of PublicKey
 * @returns {Object} An object with keys: hashBuffer, type
 * @private
 */
Address._transformPublicKey = function(pubkey) {
  var info = {};
  if (!(pubkey instanceof PublicKey)) {
    throw new TypeError('Address must be an instance of PublicKey.');
  }
  info.hashBuffer = Hash.sha256ripemd160(pubkey.toBuffer());
  info.type = Address.PayToPublicKeyHash;
  return info;
};

/**
 * Creates a P2SH address from a set of public keys and a threshold.
 *
 * The addresses will be sorted lexicographically, as that is the trend in pqcoin.
 * To create an address from unsorted public keys, use the {@link Script#buildMultisigOut}
 * interface.
 *
 * @param {Array} publicKeys - a set of public keys to create an address
 * @param {number} threshold - the number of signatures needed to release the funds
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @return {Address}
 */
Address.createMultisig = function(publicKeys, threshold, network) {
  network = network || publicKeys[0].network || Networks.defaultNetwork;
  return Address.payingTo(Script.buildMultisigOut(publicKeys, threshold), network);
};

/**
 * Internal function to transform a pqcoin address string
 *
 * @param {string} data
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type: 'pubkeyhash' or 'scripthash'
 * @returns {Object} An object with keys: hashBuffer, network and type
 * @private
 */
Address._transformString = function(data, network, type) {
  if (typeof(data) !== 'string') {
    throw new TypeError('data parameter supplied is not a string.');
  }
  data = data.trim();
  var addressBuffer = Base58Check.decode(data);
  var info = Address._transformBuffer(addressBuffer, network, type);
  return info;
};

/**
 * Instantiate an address from a PublicKey instance
 *
 * @param {PublicKey} data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.fromPublicKey = function(data, network) {
  var info = Address._transformPublicKey(data);
  network = network || Networks.defaultNetwork;
  return new Address(info.hashBuffer, network, info.type);
};

/**
 * Instantiate an address from a ripemd160 public key hash
 *
 * @param {Buffer} hash - An instance of buffer of the hash
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.fromPublicKeyHash = function(hash, network) {
  var info = Address._transformHash(hash);
  return new Address(info.hashBuffer, network, Address.PayToPublicKeyHash);
};

/**
 * Instantiate an address from a ripemd160 script hash
 *
 * @param {Buffer} hash - An instance of buffer of the hash
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.fromScriptHash = function(hash, network) {
  $.checkArgument(hash, 'hash parameter is required');
  var info = Address._transformHash(hash);
  return new Address(info.hashBuffer, network, Address.PayToScriptHash);
};

/**
 * Builds a p2sh address paying to script. This will hash the script and
 * use that to create the address.
 * If you want to extract an address associated with a script instead,
 * see {{Address#fromScript}}
 *
 * @param {Script} script - An instance of Script
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.payingTo = function(script, network) {
  $.checkArgument(script, 'script is required');
  $.checkArgument(script instanceof Script, 'script must be instance of Script');

  return Address.fromScriptHash(Hash.sha256ripemd160(script.toBuffer()), network);
};

/**
 * Instantiate an address from a buffer of the address
 *
 * @param {Buffer} buffer - An instance of buffer of the address
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.fromBuffer = function(buffer, network, type) {
  var info = Address._transformBuffer(buffer, network, type);
  return new Address(info.hashBuffer, info.network, info.type);
};

/**
 * Instantiate an address from an address string
 *
 * @param {string} str - An string of the pqcoin address
 * @param {String|Network=} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string=} type - The type of address: 'script' or 'pubkey'
 * @returns {Address} A new valid and frozen instance of an Address
 */
Address.fromString = function(str, network, type) {
  var info = Address._transformString(str, network, type);
  return new Address(info.hashBuffer, info.network, info.type);
};

/**
 * Instantiate an address from an Object
 *
 * @param {string} json - An JSON string or Object with keys: hash, network and type
 * @returns {Address} A new valid instance of an Address
 */
Address.fromObject = function fromObject(obj) {
  $.checkState(
    JSUtil.isHexa(obj.hash),
    'Unexpected hash property, "' + obj.hash + '", expected to be hex.'
  );
  var hashBuffer = new Buffer(obj.hash, 'hex');
  return new Address(hashBuffer, obj.network, obj.type);
};

/**
 * Will return a validation error if exists
 *
 * @example
 * ```javascript
 * // a network mismatch error
 * var error = Address.getValidationError('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'testnet');
 * ```
 *
 * @param {string} data - The encoded data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string} type - The type of address: 'script' or 'pubkey'
 * @returns {null|Error} The corresponding error message
 */
Address.getValidationError = function(data, network, type) {
  var error;
  try {
    /* jshint nonew: false */
    new Address(data, network, type);
  } catch (e) {
    error = e;
  }
  return error;
};

/**
 * Will return a boolean if an address is valid
 *
 * @example
 * ```javascript
 * assert(Address.isValid('15vkcKf7gB23wLAnZLmbVuMiiVDc1Nm4a2', 'livenet'));
 * ```
 *
 * @param {string} data - The encoded data
 * @param {String|Network} network - either a Network instance, 'livenet', or 'testnet'
 * @param {string} type - The type of address: 'script' or 'pubkey'
 * @returns {boolean} The corresponding error message
 */
Address.isValid = function(data, network, type) {
  return !Address.getValidationError(data, network, type);
};

/**
 * Returns true if an address is of pay to public key hash type
 * @return boolean
 */
Address.prototype.isPayToPublicKeyHash = function() {
  return this.type === Address.PayToPublicKeyHash;
};

/**
 * Returns true if an address is of pay to script hash type
 * @return boolean
 */
Address.prototype.isPayToScriptHash = function() {
  return this.type === Address.PayToScriptHash;
};

/**
 * Will return a buffer representation of the address
 *
 * @returns {Buffer} pqcoin address buffer
 */
Address.prototype.toBuffer = function() {
  var version = new Buffer([this.network[this.type]]);
  var buf = Buffer.concat([version, this.hashBuffer]);
  return buf;
};

/**
 * @returns {Object} A plain object with the address information
 */
Address.prototype.toObject = Address.prototype.toJSON = function toObject() {
  return {
    hash: this.hashBuffer.toString('hex'),
    type: this.type,
    network: this.network.toString()
  };
};

/**
 * Will return a the string representation of the address
 *
 * @returns {string} pqcoin address
 */
Address.prototype.toString = function() {
  return Base58Check.encode(this.toBuffer());
};

/**
 * Will return a string formatted for the console
 *
 * @returns {string} pqcoin address
 */
Address.prototype.inspect = function() {
  return '<Address: ' + this.toString() + ', type: ' + this.type + ', network: ' + this.network + '>';
};
