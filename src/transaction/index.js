import router from 'lib/router'
import api from './api'
import Transaction from './model'

export default (scope, callback) => {
  router(api, scope)

  callback(null, Transaction)
}
