import levelup from 'levelup'
import leveldown from 'leveldown'
import pqccore from 'pqc-core'
import storage from '../storage'

const {Block} = pqccore
const {NotFoundError} = levelup.errors

export default class Database {
  constructor(scope, callback) {
    const p = storage.getDBPath()
    const db = levelup(leveldown(p))
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

  putObject(key, value) {
    if (key && value) {
      this.db.put(key, value)
    }
  }

  async queryBlock(blockHash) {
    const id = `b${blockHash}`
    const str = await this.queryObject(id)
    if (str) {
      return new Block(str)
    } else {
      return null
    }
  }

  async putBlock(block) {
    if (block instanceof Block) {
      const id = `b${block.hash}`
      const savedBlock = await this.queryBlock(id)
      if (savedBlock) {
        throw new Error('block already in db')
      } else {
        return this.putObject(id, block.toString())
      }
    } else {
      throw new Error('invalid argument type')
    }
  }
}
