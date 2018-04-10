import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import pqccore from 'pqc-core'
import storage from '../storage'
import {addressFromHash, isCoinbaseTX} from '../lib/utils'
import {kLastBlockIDKey} from '../block/model'
import {kModuleClearUp} from '../bus/constants'

const kMaxHash = 'ffffffffffffffffffffffffffffffff'
const {Block, Transaction, Network} = pqccore
const {NotFoundError} = levelup.errors

export default class Database {
  constructor(scope) {
    this.scope = scope
    const p = storage.getDBPath()
    const db = levelup(encode(leveldown(p), {valueEncoding: 'utf8'}))
    this.db = db

    const {bus} = scope
    bus.on(kModuleClearUp, this.close)
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
        const {config} = this.scope
        const network = Network[config.network].publicKeyHash
        block.transactions.forEach(t => {
          const {inputs, outputs} = t
          if (!isCoinbaseTX(t)) {
            inputs.forEach(ilooper => {
              const key = `${ilooper.prevTxID.toString('hex')}:${ilooper.outIndex.toString()}`
              utxo.push({
                type: 'del',
                key: `u${key}`
              })
              // save to spent table
              spent.push({
                type: 'put',
                key: `s${key}`,
                value: ilooper.outIndex.toString()
              })
            })
          }
          outputs.forEach((olooper, oidx) => {
            const address = addressFromHash(network, olooper.publicKeyHash)
            utxo.push({
              type: 'put',
              key: `u${address}${t.txid}`,
              value: `${oidx.toString()}:${olooper.amount.toString()}`
            })
          })
          queries.push({
            type: 'put',
            key: `t${t.txid}`,
            value: t.toString()
          })
        })

        // put block into queries
        queries.push({
          type: 'put',
          key: rid,
          value: block.toString()
        })
        // update lastblock id
        queries.push({
          type: 'put',
          key: kLastBlockIDKey,
          value: block.id
        })
        return this.db.batch([...queries, ...spent, ...utxo])
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

  async listTransactions() {
    const {logger} = this.scope
    return new Promise(((resolve, reject) => {
      const options = {
        keys: true,
        values: true,
        revers: false,
        limit: 20,
        fillCache: true
      }
      options.start = 't'
      options.end = `t${kMaxHash}`
      const result = []
      this.db.createReadStream(options)
        .on('data', (data) => {
          const tx = Transaction.fromBuffer(Buffer.from(data.value, 'hex'))
          result.push(tx)
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
      options.end = `u${address}${kMaxHash}`
      const txs = []
      let balance = 0
      this.db.createReadStream(options)
        .on('data', (data) => {
          const {key, value} = data
          console.log(249, key, value)
          const array = value.split(':')
          const amount = parseInt(array[1], 10)
          balance += amount
          txs.push({
            txid: key.slice(prefixLength),
            idx: parseInt(array[0], 10),
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
          resolve({
            balance,
            txs
          })
        })
    }))
  }

  /**
   * close db
   */
  close() {
    const {logger} = this.scope
    logger.log(69, 'db close')
    this.db.close()
  }
}
