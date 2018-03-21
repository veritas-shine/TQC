import pqccore from 'pqc-core'
import Wallet from '../wallet/model'

const {Transaction, Script, Block} = pqccore
const {Hash} = pqccore.crypto

export default class TransactionModel {
  static createCoinbase(to, amount) {
    const scriptPubkey = Script.buildPublicKeyHashOut(to)
    const utxo = {
      txId: '0000000000000000000000000000000000000000000000000000000000000000',
      outputIndex: 0,
      script: scriptPubkey,
      glv: amount
    }

    const tx = new Transaction()
    tx.from(utxo)
    tx.to(to, amount)
    return tx
  }

  static getTransactionHashes(txs) {
    if (txs.length === 0) {
      return [Block.Values.NULL_HASH]
    }
    return txs.map(t => t._getHash())
  }

  /**
   * Will build a merkle tree of all the transactions, ultimately arriving at
   * a single point, the merkle root.
   * @link https://en.pqcoin.it/wiki/Protocol_specification#Merkle_Trees
   * @returns {Array} - An array with each level of the tree after the other.
   */
  static getMerkleTree(txs) {
    const tree = this.getTransactionHashes(txs)
    let j = 0
    for (let size = txs.length; size > 1; size = Math.floor((size + 1) / 2)) {
      for (let i = 0; i < size; i += 2) {
        const i2 = Math.min(i + 1, size - 1)
        const buf = Buffer.concat([tree[j + i], tree[j + i2]])
        tree.push(Hash.sha256sha256(buf))
      }
      j += size
    }

    return tree
  }

  /**
   * Calculates the merkleRoot from the transactions.
   * @returns {Buffer} - A buffer of the merkle root hash
   */
  static getMerkleRoot(txs) {
    const tree = this.getMerkleTree(txs)
    return tree[tree.length - 1]
  }
}
