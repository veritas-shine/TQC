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
  constructor(info) {
    this.version = info.version;
    this.prevHash = info.prevHash;
    this.merkleRoot = info.merkleRoot;
    this.time = info.time;
    this.timestamp = info.time;
    this.qbits = info.qbits;
    this.nonce = info.nonce;
  }
  static create(arg) {
    const info = BlockHeader._from(arg);

    if (info.hash) {
      $.checkState(
          arg.hash === info.hash,
          'Argument object hash property does not match block hash.'
      );
    }
  }

  /**
   * @param {*} - A Buffer, JSON string or Object
   * @returns {Object} - An object representing block header data
   * @throws {TypeError} - If the argument was not recognized
   * @private
   */
  static _from(arg) {
    if (BufferUtil.isBuffer(arg)) {
      return BlockHeader._fromBufferReader(BufferReader(arg));
    } else if (_.isObject(arg)) {
      return BlockHeader._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for BlockHeader');
    }
  }


  /**
   * @param {Object} - A JSON string
   * @returns {Object} - An object representing block header data
   * @private
   */
  static fromObject(data) {
    $.checkArgument(data, 'data is required');
    var prevHash = data.prevHash;
    var merkleRoot = data.merkleRoot;
    if (_.isString(data.prevHash)) {
      prevHash = BufferUtil.reverse(new Buffer(data.prevHash, 'hex'));
    }
    if (_.isString(data.merkleRoot)) {
      merkleRoot = BufferUtil.reverse(new Buffer(data.merkleRoot, 'hex'));
    }
    const info = new BlockHeader({
      hash: data.hash,
      version: data.version,
      prevHash: prevHash,
      merkleRoot: merkleRoot,
      time: data.time,
      timestamp: data.time,
      bits: data.qbits,
      nonce: data.nonce
    })
    return info;
  };

  /**
   * @param {Binary} - Raw block binary data or buffer
   * @returns {BlockHeader} - An instance of block header
   */
  static fromRawBlock(data) {
    if (!BufferUtil.isBuffer(data)) {
      data = new Buffer(data, 'binary');
    }
    var br = BufferReader(data);
    br.pos = this.Constants.START_OF_HEADER;
    return BlockHeader._fromBufferReader(br)
  };

  /**
   * @param {Buffer} - A buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */
  static fromBuffer(buf) {
    return BlockHeader._fromBufferReader(BufferReader(buf))
  };

  /**
   * @param {string} - A hex encoded buffer of the block header
   * @returns {BlockHeader} - An instance of block header
   */
  static fromString(str) {
    var buf = new Buffer(str, 'hex');
    return BlockHeader.fromBuffer(buf);
  };

  /**
   * @param {BufferReader} - A BufferReader of the block header
   * @returns {Object} - An object representing block header data
   * @private
   */
  static _fromBufferReader(br) {
    var info = {}
    info.version = br.readInt32LE();
    info.prevHash = br.read(32);
    info.merkleRoot = br.read(32);
    info.time = br.readUInt32LE();
    info.qbits = br.readUInt32LE();
    info.nonce = br.readUInt32LE();
    return new BlockHeader(info)
  };


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
      bits: this.qbits,
      nonce: this.nonce
    };
  };

  /**
   * @returns {Buffer} - A Buffer of the BlockHeader
   */
  toBuffer() {
    return this.toBufferWriter().concat();
  };

  /**
   * @returns {string} - A hex encoded string of the BlockHeader
   */
  toString() {
    return this.toBuffer().toString('hex');
  };

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
  };

  /**
   * Returns the target difficulty for this block
   * @param {Number} bits
   * @returns {BN} An instance of BN with the decoded difficulty bits
   */
  getTargetDifficulty(bits) {
    bits = bits || this.qbits;

    var target = new BN(bits & 0xffffff);
    var mov = 8 * ((bits >>> 24) - 3);
    while (mov-- > 0) {
      target = target.mul(new BN(2));
    }
    return target;
  };

  /**
   * @link https://en.pqcoin.it/wiki/Difficulty
   * @return {Number}
   */
  getDifficulty() {
    var difficulty1TargetBN = this.getTargetDifficulty(GENESIS_BITS).mul(new BN(Math.pow(10, 8)));
    var currentTargetBN = this.getTargetDifficulty();

    var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
    var decimalPos = difficultyString.length - 8;
    difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos);

    return parseFloat(difficultyString);
  };

  /**
   * @returns {Buffer} - The little endian hash buffer of the header
   */
  hash() {
    var buf = this.toBuffer();
    return Hash.sha256sha256(buf);
  };

  /**
   * @returns {Boolean} - If timestamp is not too far in the future
   */
  validTimestamp() {
    var currentTime = Math.round(new Date().getTime() / 1000);
    if (this.time > currentTime + BlockHeader.Constants.MAX_TIME_OFFSET) {
      return false;
    }
    return true;
  };

  /**
   * @returns {Boolean} - If the proof-of-work hash satisfies the target difficulty
   */
  validProofOfWork() {
    var pow = new BN(this.id, 'hex');
    var target = this.getTargetDifficulty();

    if (pow.cmp(target) > 0) {
      return false;
    }
    return true;
  };

  /**
   * @returns {string} - A string formatted for the console
   */
  inspect() {
    return '<BlockHeader ' + this.id + '>';
  };

  static Constants = {
    START_OF_HEADER: 8, // Start buffer position in raw block data
    MAX_TIME_OFFSET: 2 * 60 * 60, // The max a timestamp can be in the future
    LARGEST_HASH: new BN('10000000000000000000000000000000000000000000000000000000000000000', 'hex')
  };
}

var idProperty = {
  configurable: false,
  enumerable: true,
  /**
   * @returns {string} - The big endian hash buffer of the header
   */
  get: function() {
    if (!this._id) {
      this._id = BufferReader(this._getHash()).readReverse().toString('hex');
    }
    return this._id;
  },
  set: _.noop
};
Object.defineProperty(BlockHeader.prototype, 'id', idProperty);
Object.defineProperty(BlockHeader.prototype, 'hash', idProperty);
