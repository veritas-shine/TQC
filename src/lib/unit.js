
import _ from 'lodash'
import errors from './errors'
import $ from './util/preconditions'

const UNITS = {
  'PQC': [1e8, 8],
  'mPQC': [1e5, 5],
  'uPQC': [1e2, 2],
  'qbits': [1e2, 2],
  'glv': [1, 0]
};

/**
 * Utility for handling and converting PQC units. The supported units are
 * PQC, mPQC, qbits (also named uPQC) and glv. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromPQC}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toSatoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding PQC/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromPQC(1.3).toGlv();
 * var mili = Unit.fromBits(1.3).to(Unit.mBTC);
 * var bits = Unit.fromFiat(1.3, 350).qbits;
 * var btc = new Unit(1.3, Unit.qbits).PQC;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
export default class Unit {
  constructor(amount, code) {
    // convert fiat to PQC
    if (_.isNumber(code)) {
      if (code <= 0) {
        throw new errors.Unit.InvalidRate(code);
      }
      amount /= code;
      code = Unit.PQC;
    }

    this._value = Unit._from(amount, code);

    const self = this;
    const defineAccesor = function (key) {
      Object.defineProperty(self, key, {
        get() { return self.to(key); },
        enumerable: true,
      });
    };

    Object.keys(UNITS).forEach(defineAccesor);
  }


  /**
   * Returns a Unit instance created from JSON string or object
   *
   * @param {String|Object} json - JSON with keys: amount and code
   * @returns {Unit} A Unit instance
   */
  static fromObject(data) {
    $.checkArgument(_.isObject(data), 'Argument is expected to be an object');
    return new Unit(data.amount, data.code);
  }

  /**
   * Returns a Unit instance created from an amount in PQC
   *
   * @param {Number} amount - The amount in PQC
   * @returns {Unit} A Unit instance
   */
  static fromPQC(amount) {
    return new Unit(amount, Unit.PQC);
  }

  /**
   * Returns a Unit instance created from an amount in mBTC
   *
   * @param {Number} amount - The amount in mBTC
   * @returns {Unit} A Unit instance
   */
  static fromMilis(amount) {
    return new Unit(amount, Unit.mPQC);
  }

  static fromMillis(amount) {
    return this.fromMilis(amount)
  }

  /**
   * Returns a Unit instance created from an amount in bits
   *
   * @param {Number} amount - The amount in bits
   * @returns {Unit} A Unit instance
   */
  static fromMicros(amount) {
    return new Unit(amount, Unit.qbits);
  }

  static fromBits(amount) {
    return this.fromMicros(amount)
  }

  /**
   * Returns a Unit instance created from an amount in glv
   *
   * @param {Number} amount - The amount in glv
   * @returns {Unit} A Unit instance
   */
  static fromGlv(amount) {
    return new Unit(amount, Unit.glv);
  }

  /**
   * Returns a Unit instance created from a fiat amount and exchange rate.
   *
   * @param {Number} amount - The amount in fiat
   * @param {Number} rate - The exchange rate PQC/fiat
   * @returns {Unit} A Unit instance
   */
  static fromFiat(amount, rate) {
    return new Unit(amount, rate);
  }

  static _from(amount, code) {
    if (!UNITS[code]) {
      throw new errors.Unit.UnknownCode(code);
    }
    return parseInt((amount * UNITS[code][0]).toFixed(), 10);
  }

  /**
   * Returns the value represented in the specified unit
   *
   * @param {String|Number} code - The unit code or exchange rate
   * @returns {Number} The converted value
   */
  to(code) {
    if (_.isNumber(code)) {
      if (code <= 0) {
        throw new errors.Unit.InvalidRate(code);
      }
      return parseFloat((this.PQC * code).toFixed(2));
    }

    if (!UNITS[code]) {
      throw new errors.Unit.UnknownCode(code);
    }

    const value = this._value / UNITS[code][0];
    return parseFloat(value.toFixed(UNITS[code][1]));
  }

  /**
   * Returns the value represented in PQC
   *
   * @returns {Number} The value converted to PQC
   */
  toPQC() {
    return this.to(Unit.PQC);
  }

  /**
   * Returns the value represented in mBTC
   *
   * @returns {Number} The value converted to mBTC
   */
  toMillis() {
    return this.to(Unit.mPQC)
  }
  toMilis() {
    return this.toMillis()
  }
  /**
   * Returns the value represented in bits
   *
   * @returns {Number} The value converted to bits
   */
  toMicros() { return this.to(Unit.qbits) }
  toBits() { return this.toMicros() }
  /**
   * Returns the value represented in glv
   *
   * @returns {Number} The value converted to glv
   */
  toGlv() {
    return this.to(Unit.glv);
  }

  /**
   * Returns the value represented in fiat
   *
   * @param {string} rate - The exchange rate between PQC/currency
   * @returns {Number} The value converted to glv
   */
  atRate(rate) {
    return this.to(rate);
  }

  /**
   * Returns a the string representation of the value in glv
   *
   * @returns {string} the value in glv
   */
  toString() {
    return `${this.glv} glv`;
  }

  /**
   * Returns a plain object representation of the Unit
   *
   * @returns {Object} An object with the keys: amount and code
   */
  toObject() {
    return {
      amount: this.PQC,
      code: Unit.PQC
    };
  }

  toJSON() { return this.toObject() }

  /**
   * Returns a string formatted for the console
   *
   * @returns {string} the value in glv
   */
  inspect() {
    return `<Unit: ${this.toString()}>`;
  }
}

Object.keys(UNITS).forEach(key => Unit[key] = key)
