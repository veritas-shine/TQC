import _ from 'lodash'
import BN from '../crypto/bn'
import BufferUtil from '../util/buffer'
import BufferReader from '../encoding/bufferreader'
import BufferWriter from '../encoding/bufferwriter'
import Hash from '../crypto/hash'
import $ from '../util/preconditions'

const GENESIS_BITS = 0x1d00ffff

/**
 * Instantiate a BlockHeader from a Buffer, JSON object, or Object with
 * the properties of the BlockHeader
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {BlockHeader} - An instance of block header
 * @constructor
 */
export default class BlockHeader {
  constructor(arg) {
    if (BufferUtil.isBuffer(arg)) {
      this._initByBufferReader(BufferReader(arg));
    } else if (_.isObject(arg)) {
      this._initByObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for BlockHeader');
    }

    const idProperty = {
      configurable: false,
      enumerable: true,
      /**
       * @returns {string} - The big endian hash buffer of the header
       */
      get: this._getID,
      set: _.noop
    };
    Object.defineProperty(this, 'id', idProperty);
    Object.defineProperty(this, 'hash', idProperty);
  }

  _initByBufferReader(br) {
    const info = BlockHeader._readInfoFromBuffer(br)
    this._initByObject(info)
  }

  _initByObject(info) {
    this.version = info.version;
    this.prevHash = info.prevHash;
    this.merkleRoot = info.merkleRoot;
    this.time = info.time;
    this.timestamp = info.time;
    this.qbits = info.qbits;
    this.nonce = info.nonce;
    if (info.hash) {
      $.checkState(this.hash === info.hash, 'Argument object hash property does not match block hash.')
    }
  }

  /**
   * @param {Object} - A JSON string
   * @returns {Object} - An object representing block header data
   * @private
   */
  static fromObject(data) {
    $.checkArgument(data, 'data is required');
    let prevHash = data.prevHash;
    let merkleRoot = data.merkleRoot;
    if (_.isString(data.prevHash)) {
      prevHash = BufferUtil.reverse(Buffer.from(data.prevHash, 'hex'));
    }
    if (_.isString(data.merkleRoot)) {
      merkleRoot = BufferUtil.reverse(Buffer.from(data.merkleRoot, 'hex'));
    }
    const obj = {
      hash: data.hash,
      version: data.version,
      prevHash,
      merkleRoot,
      time: data.time,
      timestamp: data.time,
      qbits: data.qbits,
      nonce: data.nonce
    }
    return new BlockHeader(obj)
  }

  /**
   * @param {Binary} - Raw block binary data or buffer
   * @returns {BlockHeader} - An instance of block header
   */
  static fromRawBlock(data) {
    if (!BufferUtil.isBuffer(data)) {
      data = Buffer.from(data, 'binary');
    }
    const br = BufferReader(data);
    br.pos = this.Constants.START_OF_HEADER;
    return BlockHeader.fromBufferReader(br)
  }

  /**
   * @param {Buffer} - A buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */
  static fromBuffer(buf) {
    return BlockHeader.fromBufferReader(BufferReader(buf))
  }

  /**
   * @param {string} - A hex encoded buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */
  static fromString(str) {
    const buf = Buffer.from(str, 'hex');
    return BlockHeader.fromBuffer(buf);
  }

  /**
   * @param {BufferReader} - A BufferReader of the block header
   * @returns {Object} - An object representing block header data
   * @private
   */
  static _readInfoFromBuffer(br) {
    const info = {}
    info.version = br.readInt32LE();
    info.prevHash = br.read(32);
    info.merkleRoot = br.read(32);
    info.time = br.readUInt32LE();
    info.qbits = br.readUInt32LE();
    info.nonce = br.readUInt32LE();
    return info
  }
  static fromBufferReader(br) {
    return new BlockHeader(this._readInfoFromBuffer(br))
  }

  _getID() {
    if (!this._id) {
      this._id = BufferReader(this._getHash()).readReverse().toString('hex');
    }
    return this._id;
  }
  /**
   * @returns {Object} - A plain object of the BlockHeader
   */
  toObject() {
    return {
      hash: this.hash,
      version: this.version,
      prevHash: BufferUtil.reverse(this.prevHash).toString('hex'),
      merkleRoot: BufferUtil.reverse(this.merkleRoot).toString('hex'),
      time: this.time,
      qbits: this.qbits,
      nonce: this.nonce
    };
  }

  toJSON = this.toObject
  /**
   * @returns {Buffer} - A Buffer of the BlockHeader
   */
  toBuffer() {
    return this.toBufferWriter().concat();
  }

  /**
   * @returns {string} - A hex encoded string of the BlockHeader
   */
  toString() {
    return this.toBuffer().toString('hex');
  }

  /**
   * @param {BufferWriter} - An existing instance BufferWriter
   * @returns {BufferWriter} - An instance of BufferWriter representation of the BlockHeader
   */
  toBufferWriter(bw) {
    if (!bw) {
      bw = new BufferWriter();
    }
    bw.writeInt32LE(this.version);
    bw.write(this.prevHash);
    bw.write(this.merkleRoot);
    bw.writeUInt32LE(this.time);
    bw.writeUInt32LE(this.qbits);
    bw.writeUInt32LE(this.nonce);
    return bw;
  }

  /**
   * Returns the target difficulty for this block
   * @param {Number} bits
   * @returns {BN} An instance of BN with the decoded difficulty bits
   */
  getTargetDifficulty(bits) {
    bits = bits || this.qbits;

    let target = new BN(bits & 0xffffff);
    let mov = 8 * ((bits >>> 24) - 3);
    while (mov-- > 0) {
      target = target.mul(new BN(2));
    }
    return target;
  }

  /**
   * @link https://en.pqcoin.it/wiki/Difficulty
   * @return {Number}
   */
  getDifficulty() {
    const difficulty1TargetBN = this.getTargetDifficulty(GENESIS_BITS).mul(new BN(Math.pow(10, 8)));
    const currentTargetBN = this.getTargetDifficulty();

    let difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
    const decimalPos = difficultyString.length - 8;
    difficultyString = `${difficultyString.slice(0, decimalPos)}.${difficultyString.slice(decimalPos)}`;

    return parseFloat(difficultyString);
  }

  /**
   * @returns {Buffer} - The little endian hash buffer of the header
   */
  _getHash() {
    const buf = this.toBuffer();
    return Hash.sha256sha256(buf);
  }

  /**
   * @returns {Boolean} - If timestamp is not too far in the future
   */
  validTimestamp() {
    const currentTime = Math.round(new Date().getTime() / 1000);
    if (this.time > currentTime + BlockHeader.Constants.MAX_TIME_OFFSET) {
      return false;
    }
    return true;
  }

  /**
   * @returns {Boolean} - If the proof-of-work hash satisfies the target difficulty
   */
  validProofOfWork() {
    const pow = new BN(this.id, 'hex');
    const target = this.getTargetDifficulty();

    if (pow.cmp(target) > 0) {
      return false;
    }
    return true;
  }

  /**
   * @returns {string} - A string formatted for the console
   */
  inspect() {
    return `<BlockHeader ${this.id}>`;
  }

  static Constants = {
    START_OF_HEADER: 8, // Start buffer position in raw block data
    MAX_TIME_OFFSET: 2 * 60 * 60, // The max a timestamp can be in the future
    LARGEST_HASH: new BN('10000000000000000000000000000000000000000000000000000000000000000', 'hex')
  };
}
