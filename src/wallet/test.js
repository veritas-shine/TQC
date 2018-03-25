import assert from 'assert'
import Storage from 'storage'
import Wallet from './model'

describe('wallet test', function () {
  let files = Storage.getWalletFiles()
  const walletService = new Wallet({})
  walletService.load(files[0], true)

  it('should save wallet to file', function (done) {
    walletService.saveToFile()
    done()
  })

  it('should load ', function (done) {
    files = Storage.getWalletFiles()
    const newService = new Wallet({})
    newService.load(files[0])
    assert.equal(walletService.current.address, newService.current.address)
    done()
  })
})
