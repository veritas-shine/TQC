import pqccore from 'pqc-core'

const {base58check, BufferUtil} = pqccore.Encoding
const {Transaction} = pqccore

/**
 *
 * @param network {Number}
 * @param publicKeyHash {Buffer|String}
 * @return {String}
 */
export function addressFromHash(network, publicKeyHash) {
  publicKeyHash = BufferUtil.ensureBuffer(publicKeyHash)
  const prefix = Buffer.from([network])
  const buffer = Buffer.concat([prefix, publicKeyHash])
  return base58check.encode(buffer)
}

/**
 *
 * @param tx {Transaction}
 * @return {Boolean}
 */
export function isCoinbaseTX(tx) {
  if (tx.inputs.length === 1) {
    const input = tx.inputs[0]
    return Transaction.Input.isCoinbase(input.prevTxID)
  }
  return false
}
