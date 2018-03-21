import router from 'lib/router'
import api from './api'
import Transaction from './model'

export default (scope, callback) => {
  const {server} = scope
  router(api, server)

  callback(null, Transaction)
}
