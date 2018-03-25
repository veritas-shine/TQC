import code from '../config/code'

export default {
  'get /block/list': async (req, ctx) => {
    const {database} = ctx
    const data = await database.listBlocks()
    return {
      code: code.ok,
      data: data.map(l => l.toString())
    }
  },
  'get /block/one': async (req, ctx) => {
    const {block, database} = ctx
    const {id} = req.query
    let obj = null
    if (id) {
      obj = await database.queryBlock(id)
    } else {
      obj = block.genesisblock
    }
    return {
      code: code.ok,
      data: obj.toString()
    }
  }
}
