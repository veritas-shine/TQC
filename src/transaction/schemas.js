export default {
  tx: {
    type: 'object',
    properties: {
      from: {
        type: 'string'
      },
      to: {
        type: 'string'
      },
      amount: {
        type: 'integer'
      }
    },
    required: ['from', 'to', 'amount']
  }
}
