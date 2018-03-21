import router from 'lib/router'
import Miner from './model'
import api from './api'

export default (scope, callback) => {
  router(api, scope)
  callback(null, Miner)

  const {config} = scope
  if (config.mine.enable) {
    Miner.schedule(scope)
  }
}
