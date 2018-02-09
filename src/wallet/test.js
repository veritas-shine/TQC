import assert from 'assert'
import Wallet from './model'
import config from '../config'
import Storage from 'storage'

describe('wallet test', function () {
  let files = Storage.getWalletFiles()
  const wallet = new Wallet(files[0])

  it('should save wallet to file', function (done) {
    wallet.saveToFile(wallet.address)
    done()
  })

  it('should load ', function (done) {
    files = Storage.getWalletFiles()
    let oldWallet = new Wallet(files[0])
    assert.equal(oldWallet.address.toString(), wallet.address.toString())
    done()
  })
})
