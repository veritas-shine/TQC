import assert from 'assert'
import Wallet from './model'
import Storage from 'storage'

describe('wallet test', function () {
  let files = Storage.getWalletFiles()
  Wallet.load(files[0])
  const wallet = Wallet.currentWallet

  it('should save wallet to file', function (done) {
    Wallet.saveToFile(wallet, files[0])
    done()
  })

  it('should load ', function (done) {
    files = Storage.getWalletFiles()
    const oldWallet = Wallet.load(files[0])
    assert.equal(oldWallet.address.toString(), wallet.address.toString())
    done()
  })
})
