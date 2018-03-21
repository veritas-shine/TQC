import Miner from './model'
import schemas from './schemas'

export default {
  'post /mine/try': async (req, ctx) => {
    const {validator} = ctx
    const {block, nonce} = req.body
    let ok = validator.validate(block, schemas.block)
    if (ok) {
      ok = validator.validate(nonce, schemas.nonce)
      if (ok) {
        return Miner.run(block, nonce)
      }
    }
    if (!ok) {
      throw new Error('Invalid argument')
    } else {
      // will never go here
      return {}
    }
  }
}
