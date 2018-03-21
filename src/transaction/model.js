import pqccore from 'pqc-core'
import Wallet from '../wallet/model'

const {Transaction, Script} = pqccore

export default class TransactionModel {
  static create(from, to, amount) {
    const scriptPubkey = Script.buildPublicKeyHashOut(from)
    const utxo = {
      txid: '0000000000000000000000000000000000000000',
      vout: 0,
      address: from.toString(),
      scriptPubKey: scriptPubkey,
      amount
    }
    const wallet = Wallet.currentWallet
    const {privateKey} = wallet

    const tx = new Transaction()
    tx.from(utxo)
    tx.to(to, amount)
    tx.sign(privateKey)
    return tx
  }
}
