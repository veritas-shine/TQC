import _ from 'lodash'
import URL from 'url'
import Address from './address'
import Unit from './unit'

/**
 * pqccore URI
 *
 * Instantiate an URI from a pqcoin URI String or an Object. An URI instance
 * can be created with a pqcoin uri string or an object. All instances of
 * URI are valid, the static method isValid allows checking before instantiation.
 *
 * All standard parameters can be found as members of the class, the address
 * is represented using an {Address} instance and the amount is represented in
 * glv. Any other non-standard parameters can be found under the extra member.
 *
 * @example
 * ```javascript
 *
 * var uri = new URI('pqcoin:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu?amount=1.2');
 * console.log(uri.address, uri.amount);
 * ```
 *
 * @param {string|Object} data - A pqcoin URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @throws {TypeError} Invalid pqcoin address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 * @returns {URI} A new valid and frozen instance of URI
 * @constructor
 */
var URI = function (data, knownParams) {
  if (!(this instanceof URI)) {
    return new URI(data, knownParams);
  }

  this.extras = {};
  this.knownParams = knownParams || [];
  this.address = this.network = this.amount = this.message = null;

  if (typeof (data) === 'string') {
    const params = URI.parse(data);
    if (params.amount) {
      params.amount = this._parseAmount(params.amount);
    }
    this._fromObject(params);
  } else if (typeof (data) === 'object') {
    this._fromObject(data);
  } else {
    throw new TypeError('Unrecognized data format.');
  }
};

/**
 * Instantiate a URI from a String
 *
 * @param {string} str - JSON string or object of the URI
 * @returns {URI} A new instance of a URI
 */
URI.fromString = function fromString(str) {
  if (typeof (str) !== 'string') {
    throw new TypeError('Expected a string');
  }
  return new URI(str);
};

/**
 * Instantiate a URI from an Object
 *
 * @param {Object} data - object of the URI
 * @returns {URI} A new instance of a URI
 */
URI.fromObject = function fromObject(json) {
  return new URI(json);
};

/**
 * Check if an pqcoin URI string is valid
 *
 * @example
 * ```javascript
 *
 * var valid = URI.isValid('pqcoin:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu');
 * // true
 * ```
 *
 * @param {string|Object} data - A pqcoin URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @returns {boolean} Result of uri validation
 */
URI.isValid = function (arg, knownParams) {
  try {
    new URI(arg, knownParams);
  } catch (err) {
    return false;
  }
  return true;
};

/**
 * Convert a pqcoin URI string into a simple object.
 *
 * @param {string} uri - A pqcoin URI string
 * @throws {TypeError} Invalid pqcoin URI
 * @returns {Object} An object with the parsed params
 */
URI.parse = function (uri) {
  const info = URL.parse(uri, true);

  if (info.protocol !== 'pqcoin:') {
    throw new TypeError('Invalid pqcoin URI');
  }

  // workaround to host insensitiveness
  const group = /[^:]*:\/?\/?([^?]*)/.exec(uri);
  info.query.address = group && group[1] || undefined;

  return info.query;
};

URI.Members = ['address', 'amount', 'message', 'label', 'r'];

/**
 * Internal function to load the URI instance with an object.
 *
 * @param {Object} obj - Object with the information
 * @throws {TypeError} Invalid pqcoin address
 * @throws {TypeError} Invalid amount
 * @throws {Error} Unknown required argument
 */
URI.prototype._fromObject = function (obj) {
  /* jshint maxcomplexity: 10 */

  if (!Address.isValid(obj.address)) {
    throw new TypeError('Invalid pqcoin address');
  }

  this.address = new Address(obj.address);
  this.network = this.address.network;
  this.amount = obj.amount;

  for (const key in obj) {
    if (key === 'address' || key === 'amount') {
      continue;
    }

    if (/^req-/.exec(key) && this.knownParams.indexOf(key) === -1) {
      throw Error(`Unknown required argument ${key}`);
    }

    const destination = URI.Members.indexOf(key) > -1 ? this : this.extras;
    destination[key] = obj[key];
  }
};

/**
 * Internal function to transform a PQC string amount into glv
 *
 * @param {string} amount - Amount PQC string
 * @throws {TypeError} Invalid amount
 * @returns {Object} Amount represented in glv
 */
URI.prototype._parseAmount = function (amount) {
  amount = Number(amount);
  if (isNaN(amount)) {
    throw new TypeError('Invalid amount');
  }
  return Unit.fromPQC(amount).toGlv();
};

URI.prototype.toObject = URI.prototype.toJSON = function toObject() {
  const json = {};
  for (let i = 0; i < URI.Members.length; i++) {
    const m = URI.Members[i];
    if (this.hasOwnProperty(m) && typeof (this[m]) !== 'undefined') {
      json[m] = this[m].toString();
    }
  }
  _.extend(json, this.extras);
  return json;
};

/**
 * Will return a the string representation of the URI
 *
 * @returns {string} pqcoin URI string
 */
URI.prototype.toString = function () {
  const query = {};
  if (this.amount) {
    query.amount = Unit.fromGlv(this.amount).toPQC();
  }
  if (this.message) {
    query.message = this.message;
  }
  if (this.label) {
    query.label = this.label;
  }
  if (this.r) {
    query.r = this.r;
  }
  _.extend(query, this.extras);

  return URL.format({
    protocol: 'pqcoin:',
    host: this.address,
    query
  });
};

/**
 * Will return a string formatted for the console
 *
 * @returns {string} pqcoin URI
 */
URI.prototype.inspect = function () {
  return `<URI: ${this.toString()}>`;
};

module.exports = URI;
