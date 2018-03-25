import pqccore from 'pqc-core'
import fastRoot from 'merkle-lib/fastRoot'

const {Hash, Transaction} = pqccore

export default class TransactionService {
  constructor(scope) {
    this.scope = scope
    this.pendingTXs = []
  }

  /**
   *
   * @param tx {Transaction}
   */
  addTransaction(tx) {
    const {p2p} = this.scope
    const idx = this.pendingTXs.findIndex(looper => looper.txid === tx.txid)
    if (idx === -1) {
      this.pendingTXs.push(tx)
      // stop current mine event, because pending transactions change caused merkle root changed
      const {mine} = this.scope
      mine.stopCurrentMine()

      // will broadcast normal transaction out
      if (!Transaction.isCoinbase(tx.txid)) {
        p2p.broadcastTransaction(tx)
      }
    }
  }

  /**
   * @param tx {Transaction}
   */
  receiveTransaction(tx) {
    // TODO
  }

  /**
   * @param tx {Transaction}
   */
  validateTransaction(tx) {
    let error = null
    if (tx) {
      const {inputs, outputs} = tx
      if (inputs.length === 0) {
        error = 'Zero inputs!'
      } else if (outputs.length === 0) {
        error = 'Zero outputs'
      } else {
        // TODO
      }
    } else {
      error = 'Nil argument'
    }
    return error
  }

  /**
   * prune saved transactions from pending transactions
   * @param txids {Array}
   */
  prunePendingTransactions(txids = []) {
    const result = this.pendingTXs.filter(looper => !txids.includes(looper.txid))
    this.pendingTXs = result
  }

  /**
   * return merkle root of current pending transactions
   * @return {Buffer}
   */
  merkleRoot() {
    const hashes = this.pendingTXs.map(tx => tx.hash())
    const root = fastRoot(hashes, Hash.defaultHash)
    return root
  }
}
