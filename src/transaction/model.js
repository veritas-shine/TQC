import pqccore from 'pqc-core'
import Wallet from '../wallet/model'

const {Transaction, Script} = pqccore

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
}
