import router from 'lib/router'
import Miner from './model'
import api from './api'

export default (callback) => {
  const { server } = callback
  router(api, server)
  callback(null, Miner)
}
