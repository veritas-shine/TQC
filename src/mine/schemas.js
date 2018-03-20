export default {
  block: {
    id: 'block',
    type: 'object',
    properties: {
      version: {type: 'integer'},
      prev_hash: {type: 'string'},
      merkleroot: {type: 'string'},
      time: {type: 'integer'},
      bits: {type: 'string'}
    },
    required: ['version', 'prev_hash', 'merkleroot', 'time', 'bits']
  },
  nonce: {
    id: 'nonce',
    type: 'integer'
  }
}
