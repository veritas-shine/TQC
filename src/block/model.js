import assert from 'assert'
import pqccore from 'pqc-core'
import genesisJSON from './genesis'

const {Block} = pqccore

const kLastBlockIDKey = 'iblast'

export default class BlockService {
  constructor(scope) {
    this.scope = scope
    const {database} = scope
    database.queryBlock('genesis')
      .then(block => {
        if (!block) {
          // no any block
          this.genesisblock = Block.fromBuffer(Buffer.from(genesisJSON.hex, 'hex'))
          database.putBlock(this.genesisblock)
          database.putBlock(this.genesisblock, 'genesis')
          database.putObject(kLastBlockIDKey, this.genesisblock.id)
        } else {
          this.genesisblock = block
        }
      })
  }

  async lastBlock() {
    const {database} = this.scope
    const id = await database.queryObject(kLastBlockIDKey)
    const block = await database.queryBlock(id)
    return block
  }

  async addMineBlock(block) {
    const {database, transaction} = this.scope
    await database.putBlock(block)
    await database.putObject(kLastBlockIDKey, block.id)
    const txids = block.transactions.filter(looper => looper.txid)
    transaction.prunePendingTransactions(txids)
    console.log('did add mined block', block)
  }
}
