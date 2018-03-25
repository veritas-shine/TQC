import pqccore from 'pqc-core'
import fastRoot from 'merkle-lib/fastRoot'

const {Hash} = pqccore

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
    const idx = this.pendingTXs.findIndex(looper => looper.txid === tx.txid)
    if (idx === -1) {
      this.pendingTXs.push(tx)
      // stop current mine event, because pending transactions change caused merkle root changed
      const {mine} = this.scope
      mine.stopCurrentMine()
    }
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
