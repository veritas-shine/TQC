import fastRoot from 'merkle-lib/fastRoot'
import pqccore from 'pqc-core'
import WalletService from '../wallet/model'
import MineService from './model'
import Database from '../database/model'
import BlockService from '../block/model'
import Storage from '../storage'

const {Transaction, Block, Hash} = pqccore

describe('Mine', () => {
  const scope = {}
  // const db = new Database(scope)
  // scope.database = db
  // const blockService = new BlockService(scope)
  // scope.block = blockService

  // it('should create genesis block', function () {
  //   this.timeout(200 * 1000)
  //   return;
  //   try {
  //     const prevHash = Hash.NULL
  //     const coinbase = Buffer.from('veritas', 'utf8')
  //     const walletService = new WalletService(scope)
  //
  //     const files = Storage.getWalletFiles()
  //     walletService.load(files[0])
  //     const wallet = walletService.current
  //
  //     const mineService = new MineService(scope)
  //
  //     const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
  //     const merkleroot = fastRoot([tx.hash()], Hash.defaultHash)
  //
  //     const template = mineService.mine(prevHash, merkleroot)
  //     if (template) {
  //       template.height = 0
  //       const newBlock = new Block({
  //         ...template,
  //         transactions: [tx]
  //       })
  //       console.log(newBlock, newBlock.toString())
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // })

  it('should correct block', function () {
    this.timeout(200 * 1000)
    try {
      const prevHash = Hash.NULL
      const coinbase = Buffer.from('veritas', 'utf8')
      const walletService = new WalletService(scope)

      const files = Storage.getWalletFiles()
      walletService.load(files[0])
      const wallet = walletService.current

      const mineService = new MineService(scope)
      mineService.stop = false
      const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
      const merkleroot = Buffer.from('1875504aba7ae1ba2b17050ab2fcb378d08800fd9c39bbe258d86ec367670956', 'hex')

      const template = mineService.mine(prevHash, merkleroot)
      if (template) {
        template.height = 0
        const newBlock = new Block({
          ...template,
          transactions: [tx]
        })
        console.log(newBlock, newBlock.toString())
      }
    } catch (e) {
      console.log(e)
    }
  })

  // it('should mine a new block', function (done) {
  //   this.timeout(200 * 1000)
  //   return;
  //   blockService.lastBlock()
  //     .then(lastBlock => {
  //       console.log(49, lastBlock)
  //       const prevHash = lastBlock.id
  //       const coinbase = Buffer.from('veritas', 'utf8')
  //
  //       const walletService = new WalletService(scope)
  //
  //       const files = Storage.getWalletFiles()
  //       walletService.load(files[0])
  //       const wallet = walletService.current
  //
  //       const mineService = new MineService(scope)
  //
  //       const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
  //       const merkleroot = fastRoot([tx.hash()], Hash.defaultHash)
  //
  //       const template = mineService.mine(prevHash, merkleroot)
  //       if (template) {
  //         template.height = lastBlock.height + 1
  //         const newBlock = new Block({
  //           ...template,
  //           transactions: [tx]
  //         })
  //         console.log(newBlock, newBlock.toString())
  //       }
  //       done()
  //     })
  // });
})
