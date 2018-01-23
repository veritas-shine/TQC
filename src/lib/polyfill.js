import Hex from 'crypto-js/enc-hex'

export function wordArrayToBuffer(array) {
  return Buffer.from(Hex.stringify(array), 'hex')
}
