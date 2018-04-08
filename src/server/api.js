import code from '../config/code'

export default {
  'get /server/config': async (req, ctx) => {
    const {config} = ctx
    return {
      code: code.ok,
      data: config
    }
  },
  'post /server/reload': async (req, ctx) => {
    const {wallet} = ctx
    wallet.reload()
    return {
      code: code.ok
    }
  }
}
