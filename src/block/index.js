import router from 'lib/router'
import BlockService from './model'
import api from './api';

export default (scope, callback) => {
  try {
    router(api, scope)
    const block = new BlockService(scope)
    callback(null, block)
  } catch (e) {
    scope.logger.error(e)
  }
}
