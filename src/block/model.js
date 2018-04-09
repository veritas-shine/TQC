import pqccore from 'pqc-core'
import genesisJSON from './genesis'

const {Block} = pqccore

export const kLastBlockIDKey = 'iblast'
const kGenesisKey = 'igenesis'

export default class BlockService {
  constructor(scope, callback) {
    this.scope = scope
    const {database, logger} = scope
    database.queryObject(kGenesisKey)
      .then(blockID => {
        if (!blockID) {
          logger.debug('no genesis block, so save it into db from JSON file ')
          // no any block
          this.genesisblock = Block.fromBuffer(Buffer.from(genesisJSON.hex, 'hex'))
          database.putBlock(this.genesisblock)
            .then(() => {
              database.putObject(kGenesisKey, this.genesisblock.id)
              database.putObject(kLastBlockIDKey, this.genesisblock.id)
              callback(null, this)
            })
        } else {
          logger.debug('load genesis from database')
          database.queryBlock(blockID)
            .then(block => {
              this.genesisblock = block
              callback(null, this)
            })
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
    const {database, transaction, p2p, logger} = this.scope
    await database.putBlock(block)
    await database.putObject(kLastBlockIDKey, block.id)
    const txids = block.transactions.filter(looper => looper.txid)
    transaction.prunePendingTransactions(txids)
    p2p.broadcastBlock(block)
    logger.log('did add mined block', block)
  }

  /**
   *
   * @param block {Block}
   * @return {Promise<void>}
   */
  async syncBlock(block) {
    const {database, transaction, logger} = this.scope
    const obj = await database.queryBlock(block.id)
    // make sure not have the block in database
    if (!obj) {
      await database.putBlock(block)
      transaction.clearTransactionForBlock(block)
    } else {
      logger.log('block already in db')
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
