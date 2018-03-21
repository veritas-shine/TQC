import router from 'lib/router'
import BlockService from './model'
import api from './api';

export default (scope, callback) => {
  router(api, scope)
  new BlockService(scope, callback)
}
