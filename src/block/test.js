import pqccore from 'pqc-core'
import genesis from './genesis.json'

const {Block} = pqccore
describe('Block', () => {
  it('should init genesis block', function () {
    const buffer = Buffer.from(genesis.hex, 'hex')
    const block = Block.fromBuffer(buffer)
    console.log(block)
  });
})
