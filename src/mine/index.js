import router from 'lib/router'
import Miner from './model'
import api from './api'

export default (scope, callback) => {
  const { server } = scope
  router(api, server)
  callback(null, Miner)
}
