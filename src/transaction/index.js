import router from 'lib/router'
import api from './api'
import Transaction from './model'

export default (scope, callback) => {
  router(api, scope)
  const tx = new Transaction(scope)
  callback(null, tx)
}
