import config from '../config/code'
import schemas from './schemas'

export default {
  'post /mine/try': async (req, ctx) => {
    const {validator, mine} = ctx
    const {block, nonce} = req.body
    let ok = validator.validate(block, schemas.block)
    if (ok) {
      ok = validator.validate(nonce, schemas.nonce)
      if (ok) {
        return mine.run(block, nonce)
      }
    }
    if (!ok) {
      throw new Error('Invalid argument')
    } else {
      // will never go here
      return {}
    }
  },
  'post /mine/start': async (req, ctx) => {
    const {mine} = ctx
    mine.mineOnce()
    return {
      code: config.ok
    }
  }
}
