import assert from 'assert'
import Storage from 'storage'
import CryptoJS from 'crypto-js'
import Wallet from './model'

describe('wallet test', function () {
  // let files = Storage.getWalletFiles()
  // const walletService = new Wallet({})
  // walletService.load(files[0], true)

  const seed = 'f1284b8615c53211e851e8f522d5ef847ad12a11ac00162bad6190480d770fdeab4bc3736f4b8ef267929c98ee38c5f996b6885b2b332d2d6b85bb337f66275d'
  const cipherText = 'U2FsdGVkX1++KtEkXi9JRh/UM44/iqh/l5g4dAXWf2NHtxYgNlOc91gtZgfk+fbLHTSoegUPybllNW0bu167igFEm5pzorerthEGQZAhPrgQJlN16v9PRLDP6CnddvN80YKxSEeLnH9y8b1yxfwXu8SrKLtvCcidWizCXzZJoQyFPbyucuMAi5673vHHoIuwG8fcqPnuqpzGtq2pq62sfw=='
  // it('should save wallet to file', function (done) {
  //   walletService.saveToFile()
  //   done()
  // })
  //
  // it('should load ', function (done) {
  //   files = Storage.getWalletFiles()
  //   const newService = new Wallet({})
  //   newService.load(files[0])
  //   assert.equal(walletService.current.address, newService.current.address)
  //   done()
  // })

  it('should lock wallet', function () {
    const bytes = CryptoJS.AES.encrypt(seed, '1qaz!QAZ')
    console.log(28, bytes.toString())
  })

  it('should unlock wallet', function () {
    const bytes = CryptoJS.AES.decrypt(cipherText, '1qaz!QAZ')
    console.log(bytes.toString(CryptoJS.enc.Utf8))
  });
})
