import assert from 'assert'
import CryptoJS from 'crypto-js'
import {wordArrayToBuffer} from './polyfill'
import base58 from './encoding/base58'

describe('lib test', function () {
  it('should encode base58', function () {
    const array = CryptoJS.lib.WordArray.create([ -753669751,
      -3588564952,
      16721795857,
      -19634938616,
      7502143739,
      6678699864,
      6102287709,
      -654601071,
      811849771,
      8046282987,
      500435844,
      -8050149037,
      -8919009172,
      534835077,
      17191892959,
      -3650438640 ])
    const buffer = wordArrayToBuffer(array)
    assert.equal(base58.encode(buffer).length, 88)
  })
})
