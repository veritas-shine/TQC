import ZSchema from 'z-schema'
import Miner from './model'
import schemas from './schemas'

const validator = new ZSchema()

export default {
  'post /mine/try': async req => {
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
