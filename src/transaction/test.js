import pqccore from 'pqc-core'
import TransactionModel from './model'

const {PrivateKey} = pqccore

describe('tx test', () => {
  it('should create transaction', () => {
    const p1 = new PrivateKey()
    const p2 = new PrivateKey()
    const a1 = p1.toAddress()
    const a2 = p2.toAddress()
    const tx = TransactionModel.create(a1, a2, 1e8)
    console.log(tx.id)
  })
})
