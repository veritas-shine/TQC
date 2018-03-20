import router from 'lib/router'
import api from './api'
import Wallet from './model'

export default (scope, callback) => {
  const {server} = scope
  router(api, server)
  callback(null, Wallet)
}
