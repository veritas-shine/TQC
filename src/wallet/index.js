import router from 'lib/router'
import Storage from 'storage'
import api from './api'
import Wallet from './model'

export default (scope, callback) => {
  const {server} = scope
  router(api, server)

  const files = Storage.getWalletFiles()
  Wallet.load(files[0])

  callback(null, Wallet)
}
