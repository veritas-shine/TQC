export default {
  ip: {
    type: 'string'
  },
  peer: {
    type: 'object',
    properties: {
      ip: {type: 'string'},
      network: {type: 'string'}
    },
    required: ['ip', 'network']
  }
}
