export default {
  tx: {
    type: 'object',
    properties: {
      to: {
        type: 'string'
      },
      amount: {
        type: 'integer'
      }
    },
    required: ['to', 'amount']
  },
  id: {
    type: 'string'
  }
}
