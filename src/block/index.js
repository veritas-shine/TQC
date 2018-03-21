import router from 'lib/router'
import BlockService from './model'
import api from './api';

export default (scope, callback) => {
  const {server} = scope
  router(api, server)
  new BlockService(scope, callback)
}
