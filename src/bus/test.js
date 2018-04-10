import Bus from './model'

function dummy(message, payload) {
  console.log(4, message, payload)
}

describe('Bus test', () => {
  const bus = new Bus({})

  it('should register message handler', function () {
    this.timeout(20 * 1000)
    bus.on('fire', dummy)

  })

  it('should trigger message handler', () => {
    bus.trigger('fire', {name: 'Alice'})

    bus.off('fire', dummy)

    bus.trigger('fire', {name: 'Bob'})
  })
})
