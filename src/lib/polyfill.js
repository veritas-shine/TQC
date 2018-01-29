import CryptoJS from 'crypto-js'
import Hex from 'crypto-js/enc-hex'
import BitArray from 'node-bitarray'

export function wordArrayToBuffer(array) {
  return Buffer.from(Hex.stringify(array), 'hex')
}

export function packBuffer(buffer) {
  const data = buffer.join('')
  return CryptoJS.SHA512(data)
}

export function toBitArray(part) {
  const {data, unused} = part
  const bits = BitArray.fromBuffer(data)
  const array = bits.toJSON()
  return Float32Array.from(array.slice(0, array.length - unused))
}
