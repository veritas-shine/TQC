import assert from 'assert'
import pqccore from 'pqc-core'
import genesisJSON from './genesis'

const {Block} = pqccore

const kLastBlockIDKey = 'iblast'

export default class BlockService {
  constructor(scope, callback) {
    this.scope = scope
    const {database} = scope
    database.queryBlock('genesis').then(block => {
      console.log(14, block)
      if (!block) {
        // no any block
        this.genesisblock = new Block(Buffer.from(genesisJSON.hex, 'hex'))
        database.putBlock(this.genesisblock)
        database.putObject('bgenesis', this.genesisblock)
        database.putObject(kLastBlockIDKey, this.genesisblock.hash)
      } else {
        this.genesisblock = block
      }
      console.log(23, this.genesisblock, genesisJSON)
      // assert.equal(this.genesisblock.hash, genesisJSON.header.hash)
    }).catch(e => {
      console.log(26, e)
    })
    callback(null, this)
  }
  async lastBlock() {
    const {database} = this.scope
    const id = await database.queryObject(kLastBlockIDKey)
    const block = await database.queryBlock(id)
    return block
  }
}