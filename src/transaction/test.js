import pqccore from 'pqc-core'
import TransactionModel from './model'

const {PrivateKey} = pqccore

describe('tx test', () => {
  it('should create transaction', function () {
    this.timeout(20 * 1000)
    const p2 = new PrivateKey()
    const a2 = p2.toAddress()
    const tx = TransactionModel.createCoinbase(a2, 1e8)
    console.log(tx.id)
  })
})
