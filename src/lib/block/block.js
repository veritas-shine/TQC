import _ from 'lodash'
import BlockHeader from './blockheader'
import BN from '../crypto/bn'
import BufferUtil from '../util/buffer'
import BufferReader from '../encoding/bufferreader'
import BufferWriter from '../encoding/bufferwriter'
import Hash from '../crypto/hash'
import Transaction from '../transaction'
import $ from '../util/preconditions'

/**
 * Instantiate a Block from a Buffer, JSON object, or Object with
 * the properties of the Block
 *
 * @param {*} - A Buffer, JSON string, or Object
 * @returns {Block}
 * @constructor
 */
export default class Block {
  static MAX_BLOCK_SIZE = 4 * 1000000

  constructor(arg) {
    if (BufferUtil.isBuffer(arg)) {
      this._initByBufferReader(BufferReader(arg))
    } else if (_.isObject(arg)) {
      this._initByObject(arg)
    } else {
      throw new TypeError('Unrecognized argument for Block')
    }
  }

  _initByBufferReader(br) {
    $.checkState(!br.finished(), 'No block data received')
    this.header = BlockHeader.fromBufferReader(br)
    const transactions = br.readVarintNum()
    this.transactions = []
    for (let i = 0; i < transactions; i++) {
      this.transactions.push(Transaction().fromBufferReader(br))
    }
  }

  _initByObject(data) {
    this.header = BlockHeader.fromObject(data.header)
    this.transactions = data.transactions.map(tx => {
      if (tx instanceof Transaction) {
        return tx
      } else {
        return Transaction().fromObject(tx)
      }
    })
  }
  /**
   * @param {Object} - A plain JavaScript object
   * @returns {Object} - An object representing block data
   * @private
   */
  static fromObject(data) {
    const info = new Block()
    info._initByObject(data)
    return info
  }


  /**
   * @param {BufferReader} - Block data
   * @returns {Object} - An object representing the block data
   * @private
   */
  static fromBufferReader(br) {
    const info = new Block()
    info._initByBuffer(br)
    return info
  }

  /**
   * @param {string} - str - A hex encoded string of the block
   * @returns {Block} - A hex encoded string of the block
   */
  static fromString(str) {
    const buf = new Buffer(str, 'hex')
    return Block.fromBuffer(buf)
  }

  /**
   * @param {Binary} - Raw block binary data or buffer
   * @returns {Block} - An instance of block
   */
  static fromRawBlock(data) {
    if (!BufferUtil.isBuffer(data)) {
      data = new Buffer(data, 'binary')
    }
    const br = BufferReader(data)
    br.pos = Block.Values.START_OF_BLOCK
    const info = Block._fromBufferReader(br)
    return new Block(info)
  }


  /**
   * @returns {Object} - A plain object with the block properties
   */
  toObject() {
    return {
      header: this.header.toObject(),
      transactions: this.transactions.map(tx => tx.toObject())
    }
  }

  /**
   * @returns {Buffer} - A buffer of the block
   */
  toBuffer() {
    return this.toBufferWriter().concat()
  }

  /**
   * @returns {string} - A hex encoded string of the block
   */
  toString() {
    return this.toBuffer().toString('hex')
  }

  /**
   * @param {BufferWriter} - An existing instance of BufferWriter
   * @returns {BufferWriter} - An instance of BufferWriter representation of the Block
   */
  toBufferWriter(bw) {
    if (!bw) {
      bw = new BufferWriter()
    }
    bw.write(this.header.toBuffer())
    bw.writeVarintNum(this.transactions.length)
    for (let i = 0; i < this.transactions.length; i++) {
      this.transactions[i].toBufferWriter(bw)
    }
    return bw
  }

  /**
   * Will iterate through each transaction and return an array of hashes
   * @returns {Array} - An array with transaction hashes
   */
  getTransactionHashes() {
    if (this.transactions.length === 0) {
      return [Block.Values.NULL_HASH]
    }
    return this.transactions.map(t => t._getHash())
  }

  /**
   * Will build a merkle tree of all the transactions, ultimately arriving at
   * a single point, the merkle root.
   * @link https://en.pqcoin.it/wiki/Protocol_specification#Merkle_Trees
   * @returns {Array} - An array with each level of the tree after the other.
   */
  getMerkleTree() {
    const tree = this.getTransactionHashes()
    let j = 0
    for (let size = this.transactions.length; size > 1; size = Math.floor((size + 1) / 2)) {
      for (let i = 0; i < size; i += 2) {
        const i2 = Math.min(i + 1, size - 1)
        const buf = Buffer.concat([tree[j + i], tree[j + i2]])
        tree.push(Hash.sha256sha256(buf))
      }
      j += size
    }

    return tree
  }

  /**
   * Calculates the merkleRoot from the transactions.
   * @returns {Buffer} - A buffer of the merkle root hash
   */
  getMerkleRoot() {
    const tree = this.getMerkleTree()
    return tree[tree.length - 1]
  }

  /**
   * Verifies that the transactions in the block match the header merkle root
   * @returns {Boolean} - If the merkle roots match
   */
  validMerkleRoot() {

    const h = new BN(this.header.merkleRoot.toString('hex'), 'hex')
    const c = new BN(this.getMerkleRoot().toString('hex'), 'hex')

    if (h.cmp(c) !== 0) {
      return false
    }

    return true
  }

  /**
   * @returns {Buffer} - The little endian hash buffer of the header
   */
  _getHash() {
    return this.header._getHash()
  }


  /**
   * @returns {string} - A string formatted for the console
   */
  inspect() {
    return '<Block ' + this.id + '>'
  }

  static Values = {
    START_OF_BLOCK: 8, // Start of block in raw block data
    NULL_HASH: new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
  }
}

const idProperty = {
  configurable: false,
  enumerable: true,
  /**
   * @returns {string} - The big endian hash buffer of the header
   */
  get: function() {
    if (!this._id) {
      this._id = this.header.id
    }
    return this._id
  },
  set: _.noop
}

Object.defineProperty(Block.prototype, 'id', idProperty)
Object.defineProperty(Block.prototype, 'hash', idProperty)
