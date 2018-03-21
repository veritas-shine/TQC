import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import pqccore from 'pqc-core'
import storage from '../storage'

const {Block} = pqccore
const {NotFoundError} = levelup.errors

export default class Database {
  constructor(scope, callback) {
    const p = storage.getDBPath()
    const db = levelup(encode(leveldown(p), {valueEncoding: 'hex'}))
    this.db = db
    callback(null, this)
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

  async queryBlock(blockHash) {
    const id = `b${blockHash}`
    const str = await this.queryObject(id)
    if (str) {
      return new Block(Buffer.from(str, 'hex'))
    } else {
      return null
    }
  }

  async putBlock(block, id) {
    if (block instanceof Block) {
      let rid = id
      if (id) {
        rid = `b${id}`
      } else {
        rid = `b${block.hash}`
      }
      const savedBlock = await this.queryBlock(rid)
      if (savedBlock) {
        throw new Error('block already in db')
      } else {
        return this.putObject(rid, block.toString(), {
          sync: true,
          keyEncoding: 'utf8',
          valueEncoding: 'hex'
        })
      }
    } else {
      throw new Error('invalid argument type')
    }
  }

  close() {
    console.log(69, 'db close')
    this.db.close(console.log)
  }
}
