import Wallet from './model'
import schemas from './schemas'
import code from '../config/code'

export default {
  'post /wallet/create': async (req, ctx) => {
    const {validator} = ctx
    const { secret } = req.body
    const ok = validator.validate(secret, schemas.secret)
    if (ok) {
      const wallet = Wallet.create(secret)
      return {
        code: code.ok,
        data: Wallet.toJSON(wallet)
      }
    } else {
      throw new Error('Invalid argument `secret`')
    }
  },
  'get /wallet/detail': async () => {
    const wallet = Wallet.currentWallet
    return {
      code: code.ok,
      data: Wallet.toJSON(wallet)
    }
  }
}
