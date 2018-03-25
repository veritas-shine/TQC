import router from 'lib/router'
import api from './api'
import Wallet from './model'
import Storage from '../storage'

export default (scope, callback) => {
  router(api, scope)

  const wallet = new Wallet(scope)
  const files = Storage.getWalletFiles()
  wallet.load(files[0])
  callback(null, wallet)
}
