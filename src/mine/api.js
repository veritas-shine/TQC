import ZSchema from 'z-schema'
import Miner from './model'
import schemas from './schemas'

const validator = new ZSchema()

export default {
  'post /mine/try': async req => {
    const {block, nonce} = req.body
    let error = validator.validate(block, schemas.block)
    if (!error) {
      error = validator.validate(nonce, schemas.nonce)
      if (!error) {
        return Miner.run(block, nonce)
      }
    }
    if (error) {
      throw new Error(error)
    } else {
      // will never go here
      return {}
    }
  }
}
