import router from 'lib/router'
import api from './api'

export default function (ctx) {
  router(api, ctx.express)
}
