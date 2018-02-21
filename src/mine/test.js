import assert from 'assert'
import Miner from './index'

describe('Mine', () => {
  // 00000000a141216a896c54f211301c436e557a8d55900637bbdce14c6c7bddef
  const block = {
    version: 1,
    previousblockhash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleroot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    time: 1518511836,
    bits: '1d00ffff'
  }

  const b = Buffer.from('4b094f5c4b00f721a7edf47c36862e4f1e08c5c7d35558c157a9574daeaed796', 'hex');

  it('should target', function () {
    const bits = parseInt(`0x${block.bits}`, 16);
    const exponent = bits >>> 24;
    const mantissa = bits & 0xFFFFFF;
    const t = (mantissa * (2 ** (8 * (exponent - 3))));
    const target = t.toString('16');
    console.log(t, target)
  });
  it('should check hash', function () {
    const target = Buffer.from('00000000ffff0000000000000000000000000000000000000000000000000000', 'hex')
    const h = Buffer.from('62152b9ce48bad259dad70229aee6c62cb9e52297c9f622fccd8eddc6ed673fa', 'hex')
    assert.equal(Buffer.compare(target, h) > 0, false)
    const h2 = Buffer.from('00000000eeee11000000000000000000000000000000000000000000000000ff', 'hex')
    assert.equal(Buffer.compare(target, h2) > 0, true)
  });
  it('should mine a block', function () {
    Miner.run(block, 1614136539)
  });
})
