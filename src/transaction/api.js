import schemas from './schemas'
import code from '../config/code'

export default {
  'post /transaction/create': async (req, ctx) => {
    const {validator, transaction} = ctx
    const ok = validator.validate(req.body, schemas.tx)
    if (ok) {
      const {to, amount} = req.body
      const result = await transaction.createTXto(to, amount)
      if (result) {
        return {
          code: code.ok
        }
      }
      // first, gather enough UTXOs
    } else {
      throw new Error('Invalid argument')
    }
  },
  'get /transaction/one': async (req, ctx) => {
    const {database, validator} = ctx
    const {id} = req.query
    const ok = validator.validate(id, schemas.id)
    if (ok) {
      const tx = await database.queryTransaction(id)
      return {
        code: code.ok,
        data: tx.toJSON()
      }
    } else {
      throw new Error('Invalid argument')
    }
  },
  'get /transaction/list': async (req, ctx) => {
    const {database} = ctx
    const txs = await database.listTransactions()
    return {
      code: code.ok,
      data: txs
    }
  }
}
