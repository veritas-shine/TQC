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
          console.debug('no genesis block, so save it into db from JSON file ')
          // no any block
          this.genesisblock = Block.fromBuffer(Buffer.from(genesisJSON.hex, 'hex'))
          database.putBlock(this.genesisblock)
          database.putBlock(this.genesisblock, 'genesis')
          database.putObject(kLastBlockIDKey, this.genesisblock.id)
        } else {
          console.debug('load genesis from database')
          this.genesisblock = block
        }
      })
  }

  /**
   * query latest block from database
   * @return {Promise<Block>}
   */
  async lastBlock() {
    const {database} = this.scope
    const id = await database.queryObject(kLastBlockIDKey)
    const block = await database.queryBlock(id)
    return block
  }

  /**
   * save block to database
   * @param block {Block}
   * @return {Promise<void>}
   */
  async addMineBlock(block) {
    const {database, transaction, p2p} = this.scope
    await database.putBlock(block)
    await database.putObject(kLastBlockIDKey, block.id)
    const txids = block.transactions.filter(looper => looper.txid)
    transaction.prunePendingTransactions(txids)
    p2p.broadcastBlock(block)
    console.log('did add mined block', block)
  }

  async syncBlock(block) {
    const {database} = this.scope
    const obj = await database.queryBlock(block.id)
    // make sure not have the block in database
    if (!obj) {
      await database.putBlock(block)
    } else {
      console.log('block already in db')
    }
  }
  /**
   * did receive block from p2p network
   * @param block {Block}
   */
  async receiveBlock(block) {
    const {database} = this.scope
    const obj = await database.queryBlock(block.id)
    // make sure not have the block in database
    if (!obj) {
      await database.putBlock(block)
    }
  }
}
