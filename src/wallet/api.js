import schemas from './schemas'
import code from '../config/code'

export default {
  'post /wallet/create': async (req, ctx) => {
    const {validator, wallet} = ctx
    const {secret} = req.body
    const ok = validator.validate(secret, schemas.secret)
    if (ok) {
      const obj = wallet.create(secret)
      return {
        code: code.ok,
        data: wallet.toJSON(obj)
      }
    } else {
      throw new Error('Invalid argument `secret`')
    }
  },
  'post /wallet/lock': async (req, ctx) => {
    const {wallet} = ctx
    wallet.lock()
    // TODO
    return {
      code: code.ok
    }
  },
  'post /wallet/unlock': async (req, ctx) => {
    const {wallet, transaction} = ctx
    const {password} = req.body
    wallet.unlock(password)
    const {balance} = await transaction.getBalance()
    return {
      code: code.ok,
      data: {
        ...wallet.toJSON(),
        balance
      }
    }
  },
  'get /wallet/balance': async (req, ctx) => {
    const {transaction} = ctx
    const balance = await transaction.getBalance()
    return {
      code: code.ok,
      data: balance
    }
  },
  'get /wallet/detail': async (req, ctx) => {
    const {wallet, transaction} = ctx
    const {balance} = await transaction.getBalance()
    return {
      code: code.ok,
      data: {
        ...wallet.toJSON(),
        balance
      }
    }
  }
}
