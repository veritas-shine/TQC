import assert from 'assert'
import pqccore from 'pqc-core'
import Miner from './model'
import Transaction from '../transaction/model'
import Wallet from '../wallet/model'
import Storage from '../storage'

const {Block, BlockHeader} = pqccore

describe('Mine', () => {
  // 00000000a141216a896c54f211301c436e557a8d55900637bbdce14c6c7bddef
  const block = {
    version: 1,
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleroot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    time: 1518511836,
    bits: 0x1f00ff00
  }

  it('should check hash', function () {
    const target = Buffer.from('00000000ffff0000000000000000000000000000000000000000000000000000', 'hex')
    const h = Buffer.from('62152b9ce48bad259dad70229aee6c62cb9e52297c9f622fccd8eddc6ed673fa', 'hex')
    assert.equal(Buffer.compare(target, h) > 0, false)
    const h2 = Buffer.from('00000000eeee11000000000000000000000000000000000000000000000000ff', 'hex')
    assert.equal(Buffer.compare(target, h2) > 0, true)
  });
  it('should mine a block', function () {
    // Miner.run(block, 1614136539)
  })

  it('should create a blockheader', function () {
    const header = new BlockHeader({
      hash: '0000fcd2f56cfd911c8963510443ecb0bd82a254c1b22b8baee2a36eccd5e01e',
      version: 1,
      prevHash: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
      merkleRoot: Buffer.from('c28d0bb90de0d366f98bf1f8e4112eedbae754a4ca49d218dee48d7eef7d5bd9', 'hex'),
      time: 1521611579,
      qbits: 520158976,
      nonce: 33397
    })
    // console.log(45, header.hash, header.toJSON())
  });

  it('should create a genesis block', function () {
    this.timeout(20 * 1000)
    const files = Storage.getWalletFiles()
    const wallet = Wallet.load(files[0])
    const tx = Transaction.createCoinbase(wallet.address.toString(), 50 * 1e8)
    const merkleroot = Transaction.getMerkleRoot([tx]).toString('hex')
    console.log(merkleroot)
    const time = Math.floor(Date.now() / 1000)
    const blockheader = {
      version: 1,
      prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleroot,
      time,
      bits: 0x1f00ff00
    }
    const nonce = Miner.run(blockheader)
    blockheader.nonce = nonce
    // create
    const obj = {
      version: blockheader.version,
      prevHash: blockheader.prev_hash,
      merkleRoot: merkleroot,
      time: blockheader.time,
      qbits: 0x1f00ff00,
      nonce
    }
    const genesisBlock = new Block({
      header: obj,
      transactions: [tx]
    })
    console.log(obj, blockheader)
    const header = BlockHeader.fromObject(obj)
    console.log(genesisBlock.header, header,
      genesisBlock.toString(),
      genesisBlock.toJSON())
  })
})
