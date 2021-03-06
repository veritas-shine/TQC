import pqccore from 'pqc-core'
import fastRoot from 'merkle-lib/fastRoot'

const {Hash, Transaction, Keypair} = pqccore
const {Input, Output} = Transaction

/**
 *
 * @param txs {Array<{txid: string, idx: number}>}
 * @param amount {number}
 */
function gatherTxsForAmount(txs, amount) {
  const result = []
  let total = 0
  for (let i = 0; i < txs.length; ++i) {
    total += txs[i].amount
    result.push(txs[i])
    if (total >= amount) {
      break;
    }
  }
  return result
}

/**
 *
 * @param result {Array<{txid: string, idx: number, amount: number}>}
 * @param {Buffer} from
 * @param {Buffer}
 * @param {string} toAddress
 * @param {number} totalAmount
 */
function createNormalTransaction(from, result, keypair, toAddress, totalAmount) {
  let change = totalAmount
  const inputs = result.map(({txid, idx, amount}) => {
    const message = Input.createMessageForSign(txid, idx)
    const signature = keypair.sign(message)
    change -= amount
    return new Input({
      prevTxID: txid,
      outIndex: idx,
      signature,
      publicKey: keypair.publicKey()
    })
  })
  const outputs = []
  let publicKeyHash = Keypair.addressToPublicKeyHash(toAddress)
  outputs.push(new Output(totalAmount, publicKeyHash))
  publicKeyHash = Keypair.addressToPublicKeyHash(from)
  outputs.push(new Output(-change, publicKeyHash))
  const info = {
    version: 1,
    inputs,
    outputs,
    locktime: 0
  }
  return new Transaction(info)
}

export default class TransactionService {
  constructor(scope) {
    this.scope = scope
    this.pendingTXs = []
  }

  /**
   * get balance of current wallet
   * @return {Promise<{balance: number, txs: Array}>}
   */
  async getBalance() {
    const {database, wallet} = this.scope
    const {address} = wallet.current
    if (address) {
      return database.getAccountBalance(address)
    } else {
      return {
        balance: 0,
        txs: []
      }
    }
  }

  /**
   *
   * @param toAddress {string}
   * @param amount {number}
   */
  async createTXto(toAddress, amount) {
    const {wallet} = this.scope
    const {keypair, address} = wallet.current
    const {balance, txs} = await this.getBalance()
    if (balance < amount) {
      throw new Error('balance is small than amount')
    } else {
      // gather txs to create the transaction
      const result = gatherTxsForAmount(txs, amount)
      console.log(98, result, txs)
      const tx = createNormalTransaction(address, result, keypair, toAddress, amount)
      return this.addTransaction(tx)
    }
  }

  /**
   * add a transaction to memory
   * @param tx {Transaction}
   */
  async addTransaction(tx, needBroadcast = true) {
    const {p2p, database} = this.scope
    const storedTX = await database.queryTransaction(tx.txid)
    if (!storedTX) {
      // tx should not already be in database
      const idx = this.pendingTXs.findIndex(looper => looper.txid === tx.txid)
      if (idx === -1) {
        if (tx.isCoinbase()) {
          this.pendingTXs.unshift(tx)
        } else {
          this.pendingTXs.push(tx)
        }
        // stop current mine event, because pending transactions change caused merkle root changed
        const {mine} = this.scope
        mine.stopCurrentMine()
        // will broadcast normal transaction out
        if (!tx.isCoinbase() && needBroadcast) {
          p2p.broadcastTransaction(tx)
        }
        return this.pendingTXs
      } else {
        throw new Error('transaction already in memory!')
      }
    } else {
      throw new Error('transaction already in database!')
    }
  }

  /**
   * @param tx {Transaction}
   */
  async receiveTransaction(tx) {
    const error = this.validateTransaction(tx)
    if (!error) {
      await this.addTransaction(tx, false)
    }
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
   * @param {Array<string>} txids
   */
  prunePendingTransactions(txs = []) {
    const txids = txs.map(tx => tx.txid)
    console.log(174, txids)
    const result = this.pendingTXs.filter(looper => {
      const ret = !txids.includes(looper.txid)
      console.log(ret, looper.txid)
      return ret
    })
    console.log(176, result)
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

  /**
   * discard all pending transactions
   * debug usage
   */
  prune() {
    this.pendingTXs = []
  }
}
