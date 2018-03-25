import router from 'lib/router'
import MineService from './model'
import api from './api'

export default (scope, callback) => {
  try {
    router(api, scope)
    const mine = new MineService(scope)
    callback(null, mine)

    const {config} = scope
    if (config.mine.enable) {
      mine.schedule()
    }
  } catch (e) {
    console.error(e)
  }
}
