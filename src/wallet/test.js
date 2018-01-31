import assert from 'assert'
import ntru from 'ntrujs'
import Wallet from './model'
import config from '../config'
import Storage from 'storage'

describe('wallet test', function () {
  let files = Storage.getWalletFiles()
  const wallet = new Wallet(files[0])
  const {length, suffix, prefix} = config.address

  it('should generate wallet', function (done) {
    assert.equal(wallet.address.length, length + suffix.length + prefix.length)
    done()
  })

  it('should save wallet to file', function (done) {
    wallet.saveToFile(wallet.address)
    done()
  })

  it('should load ', function (done) {
    files = Storage.getWalletFiles()
    let oldWallet = new Wallet(files[0])
    assert.equal(oldWallet.address, wallet.address)
    done()
  })

  it('should ntru encrypt & decrypt', async function () {
    const keypair = await ntru.keyPair()
    const plainText = new Uint8Array([104, 101, 108, 108, 111, 0])
    const encrypted = await ntru.encrypt(plainText, keypair.publicKey)
    const decrypted = await ntru.decrypt(encrypted, keypair.privateKey)
    assert.deepEqual(decrypted, plainText)
  })
})
