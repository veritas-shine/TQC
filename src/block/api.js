
import code from '../config/code'

export default {
  'get /block/list': async (req, ctx) => {
    // TODO
    return {
      code: code.ok
    }
  },
  'get /block/one': async (req, ctx) => {
    const {block, database} = ctx
    const {id} = req.query
    let obj = null
    if (id) {
      // TODO
      obj = await database.queryBlock(id)
    } else {
      obj = block.genesisblock
    }
    return {
      code: code.ok,
      data: obj
    }
  }
}
