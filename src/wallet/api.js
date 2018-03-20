import ZSchema from 'z-schema'
import Wallet from './model'
import schemas from './schemas'
import code from '../config/code'

const validator = new ZSchema()

export default {
  'post /wallet/create': async (req) => {
    const { secret } = req.body
    const error = validator.validate(secret, schemas.secret)
    if (!error) {
      const wallet = Wallet.create(secret)
      console.log(13, wallet)
      return {
        code: code.ok
      }
    } else {
      throw new Error(error[0].message)
    }
  },
  'get /wallet/detail': async (req) => {
    return {}
  }
}
