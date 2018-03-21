import Transaction from './model'
import schemas from './schemas'

export default {
  'post /transaction/create': async (req, ctx) => {
    const {validator} = ctx
    const ok = validator.validate(req.body, schemas.tx)
    if (ok) {

    } else {
      throw new Error('Invalid argument')
    }
  },
  'get /transaction/detail': async (req) => {
    res.send('detail')
  }
}
