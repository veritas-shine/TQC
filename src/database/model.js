import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import pqccore from 'pqc-core'
import storage from '../storage'

const {Block, Transaction, Hash} = pqccore
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
    const {logger} = this.scope
    return new Promise((resolve, reject) => {
      if (key && value) {
        this.db.put(key, value, options, error => {
          if (error) {
            logger.error(39, error)
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
        // save transactions & block into database
        const spent = []
        const utxo = []
        const queries = []
        const {wallet} = this.scope
        const publicKeyHash = Hash.defaultHash(wallet.current.publicKey)
        const {address} = wallet.current
        block.transactions.forEach(t => {
          const {inputs, outputs} = t
          if (!Transaction.isCoinbase(t.txid)) {
            inputs.forEach(ilooper => {
              if (ilooper.verify(publicKeyHash)) {
                // it's mine spent, so delete from utxo table
                utxo.push({
                  type: 'del',
                  key: `u${address}${ilooper.prevTxID}`
                })
                // save to spent table
                spent.push({
                  type: 'put',
                  key: `s${address}${ilooper.prevTxID}`,
                  value: ilooper.outIndex.toString()
                })
              }
            })
            outputs.forEach((olooper, oidx) => {
              if (olooper.publicKeyHash.equals(publicKeyHash)) {
                // it's mine utxo
                utxo.push({
                  type: 'put',
                  key: `u${address}${t.txid}`,
                  value: `${oidx.toString()}${olooper.amount.toString()}`
                })
              }
            })
          }
          queries.push({
            type: 'put',
            key: `t${t.txid}`,
            value: t.toString()
          })
        })
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
    const {logger} = this.scope
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
          logger.error(error)
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
   * get balance of a account
   * @param account {String}
   */
  async getAccountBalance(address) {
    const {logger, wallet} = this.scope
    address = address || wallet.current.address
    const prefixLength = address.length + 1
    return new Promise(((resolve, reject) => {
      const options = {
        keys: true,
        values: true,
        revers: false,
        limit: 20,
        fillCache: true
      }
      options.start = `u${address}`
      options.end = `u${address}f`
      const txs = []
      let balance = 0
      this.db.createReadStream(options)
        .on('data', (data) => {
          const {key, value} = data
          const amount = parseInt(value.slice(1), 10)
          balance += amount
          txs.push({
            txid: key.slice(prefixLength),
            idx: parseInt(value.slice(0, 1), 10),
            amount
          })
        })
        .on('error', error => {
          logger.error(error)
          reject(error)
        })
        .on('close', () => {

        })
        .on('end', () => {
          resolve({balance, txs})
        })
    }))
  }
  /**
   * close db
   */
  close() {
    const {logger} = this.scope
    logger.log(69, 'db close')
    this.db.close(logger.log)
  }
}
