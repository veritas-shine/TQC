import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import pqccore from 'pqc-core'
import storage from '../storage'

const {Block, Transaction} = pqccore
const {NotFoundError} = levelup.errors

export default class Database {
  constructor(scope) {
    this.scope = scope
    const p = storage.getDBPath()
    const db = levelup(encode(leveldown(p), {valueEncoding: 'hex'}))
    this.db = db
  }

  queryObject(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (error, value) => {
        if (error) {
          if (error instanceof NotFoundError) {
            resolve(null)
          } else {
            reject(error)
          }
        } else {
          resolve(value)
        }
      })
    })
  }

  putObject(key, value, options) {
    return new Promise((resolve, reject) => {
      if (key && value) {
        console.log(35, key, value)
        this.db.put(key, value, options, error => {
          if (error) {
            console.error(39, error)
            reject(error)
          } else {
            resolve()
          }
        })
      }
    })
  }

  /**
   * query a block by block's hash
   * @param blockHash
   * @return {Promise<Block> | Promise<null>}
   */
  async queryBlock(blockHash) {
    const id = `b${blockHash}`
    const str = await this.queryObject(id)
    if (str) {
      return Block.fromBuffer(Buffer.from(str, 'hex'))
    } else {
      return null
    }
  }

  /**
   * save block into db, default key is block's hash
   * if argument `id` provided, will use `id` as key
   * @param block {Block}
   * @param id {String}
   * @return {Promise}
   */
  async putBlock(block, id) {
    if (block instanceof Block) {
      let rid = id
      if (id) {
        rid = `b${id}`
      } else {
        rid = `b${block.id}`
      }
      const savedBlock = await this.queryBlock(rid)
      if (savedBlock) {
        throw new Error('block already in db')
      } else {
        const queries = block.transactions.map(t => ({
          type: 'put',
          key: `t${t.txid}`,
          value: t.toString()
        }))
        queries.push({
          type: 'put',
          key: rid,
          value: block.toString()
        })
        return this.db.batch(queries)
      }
    } else {
      throw new Error('invalid argument type')
    }
  }

  /**
   * list blocks in db
   * @return {Promise<Array>}
   */
  async listBlocks() {
    return new Promise(((resolve, reject) => {
      const options = {
        keys: true,
        values: true,
        revers: false,
        limit: 20,
        fillCache: true
      }
      options.start = 'b'
      options.end = 'b1'
      const result = []
      this.db.createReadStream(options)
        .on('data', (data) => {
          const block = Block.fromBuffer(Buffer.from(data.value, 'hex'))
          result.push(block)
        })
        .on('error', error => {
          console.error(error)
          reject(error)
        })
        .on('close', () => {

        })
        .on('end', () => {
          resolve(result)
        })
    }))
  }

  /**
   * query transaction by txid
   * @param txid {String}
   * @return {Promise<Transaction>}
   */
  async queryTransaction(txid) {
    const id = `t${txid}`
    const str = await this.queryObject(id)
    if (str) {
      return Transaction.fromBuffer(Buffer.from(str, 'hex'))
    } else {
      return null
    }
  }

  /**
   * close db
   */
  close() {
    console.log(69, 'db close')
    this.db.close(console.log)
  }
}
