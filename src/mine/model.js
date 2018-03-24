import NodeSchedule from 'node-schedule'
import pqccore from 'pqc-core'
import Domain from 'domain'
import Transaction from '../transaction/model'
import Wallet from '../wallet/model'
import Storage from '../storage'

const {Block} = pqccore

export default class MinerService {
  /**
   * 根据区块参数初始化
   * @param scope {Object}
   */
  constructor(scope) {
    this.scope = scope
  }

  static mine(prevHash, merkleRoot, startNonce = 0) {
    const time = Math.floor(Date.now() / 1000)
    const blocktemplate = {
      version: 1,
      prevHash,
      qbits: 0x1f00ffff,
      time,
      merkleRoot,
    }
    const nonce = Block.mine(blocktemplate, startNonce)
    blocktemplate.nonce = nonce
    return blocktemplate
  }

  schedule() {
    console.log('start mine schedule')
    const d = Domain.create()
    d.run(() => {
      const files = Storage.getWalletFiles()
      const wallet = Wallet.load(files[0])
      const blockService = this.scope.block
      const txSerivce = this.scope.transaction

      NodeSchedule.scheduleJob('*/1 * * * *', () => {
        blockService.lastBlock()
          .then(lastBlock => {
            const coinbase = Buffer.from('veritas', 'utf8')
            const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
            txSerivce.addTransaction(tx)
            const merkleroot = txSerivce.merkleRoot()
            console.log(merkleroot)

            const template = MinerService.mine(lastBlock.id, merkleroot)
            const newBlock = new Block({
              header: template,
              transactions: [tx]
            })
            blockService.addMineBlock(newBlock)
          })
      })
    })
  }
}
