import fastRoot from 'merkle-lib/fastRoot'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
import WalletService from '../wallet/model'
import MineService from './model'

const {Transaction, Block, Hash} = pqccore

describe('Mine', () => {
  it('should create genesis block', function () {
    const prevHash = Hash.NULL
    const coinbase = Buffer.from('veritas', 'utf8')
    const scope = {}
    const walletService = new WalletService(scope)
    const mnemonic = bip39.generateMnemonic()
    const wallet = walletService.create(mnemonic)
    walletService.saveToFile()

    const mineService = new MineService(scope)

    const tx = Transaction.createCoinbaseTransaction(wallet.keypair, coinbase, 50 * 1e8)
    const merkleroot = fastRoot([tx.hash()], Hash.defaultHash)
    console.log(merkleroot)

    const template = mineService.mine(prevHash, merkleroot)
    if (template) {
      const newBlock = new Block({
        ...template,
        transactions: [tx]
      })
      console.log(newBlock.toString())
    }
  });
})
