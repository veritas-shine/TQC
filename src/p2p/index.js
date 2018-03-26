import router from 'lib/router'
import PeerService from './model'
import api from './api';

export default (scope, callback) => {
  try {
    router(api, scope)

    const service = new PeerService(scope)
    callback(null, service)
  } catch (e) {
    console.error(e)
  }
}
