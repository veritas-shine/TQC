import NodeSchedule from 'node-schedule'
import pqccore from 'pqc-core'
import Domain from 'domain'

const {Block, Transaction, Consensus} = pqccore

export default class MinerService {
  constructor(scope) {
    this.scope = scope
    this.stop = true
  }

  stopCurrentMine() {
    this.stop = true
  }

  /**
   *
   * @param prevHash {Buffer}
   * @param merkleRoot {Buffer}
   * @param startNonce {Number}
   * @return {Object}
   */
  mine(prevHash, merkleRoot, startNonce = 0) {
    const time = Math.floor(Date.now() / 1000)
    const qbits = 0x1f00ffff
    const blocktemplate = {
      version: 1,
      prevHash,
      qbits,
      time,
      merkleRoot,
    }

    const targetBuffer = Block.bitsToTargetBuffer(qbits)
    console.log('target:', targetBuffer.toString('hex'))
    const {maxNonce} = Consensus.Block
    while (startNonce < maxNonce && !this.stop) {
      blocktemplate.nonce = startNonce
      const hash = Block.hashFunction(Block.concatBuffer(blocktemplate)).reverse()
      if (Buffer.compare(targetBuffer, hash) > 0) {
        // found one
        console.log('found:', startNonce, hash.toString('hex'))
        break
      }
      ++startNonce
    }

    if (this.stop) {
      return null
    }
    // recheck the hash
    const hash = Block.hashFunction(Block.concatBuffer(blocktemplate))
      .reverse()
    if (Buffer.compare(targetBuffer, hash) > 0) {
      blocktemplate.hash = hash
      return blocktemplate
    } else {
      // not found a valid hash
    }
    return null
  }

  schedule() {
    console.log('start mine schedule')
    const d = Domain.create()
    d.run(() => {
      const walletService = this.scope.wallet
      const wallet = walletService.current
      const blockService = this.scope.block
      const txSerivce = this.scope.transaction

      NodeSchedule.scheduleJob('*/1 * * * *', () => {
        if (this.stop) {
          blockService.lastBlock()
            .then(lastBlock => {
              console.log('lastblock', lastBlock.id, lastBlock.height)

              const coinbase = Buffer.from('veritas', 'utf8')
              try {
                const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
                txSerivce.addTransaction(tx)
                const merkleroot = txSerivce.merkleRoot()
                this.stop = false
                console.log(85, merkleroot)

                const template = this.mine(lastBlock.id, merkleroot)
                if (template) {
                  template.height = lastBlock.height + 1
                  const newBlock = new Block({
                    ...template,
                    transactions: [tx]
                  })
                  blockService.addMineBlock(newBlock)
                }
              } catch (e) {
                console.error(e)
              }
            })
        }
      })
    })
  }
}
