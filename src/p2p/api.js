import pqccore from 'pqc-core'

const {Block, Transaction} = pqccore

function connect(scope) {
  return (call, callback) => {
    const {ip, network} = call.request
    const {p2p} = scope
    p2p.addPeer({
      ip: ip.trim(),
      network: network.trim()
    })
    callback(null, {message: 'hello'})
  }
}

function sendTransaction(scope) {
  return (call, callback) => {
    const {data} = call.request
    const tx = Transaction.fromBuffer(data)
    const {transaction} = scope
    transaction.receiveTransaction(tx)
    callback(null, {
      message: 'ok'
    })
  }
}

function sendBlock(scope) {
  return (call, callback) => {
    const {data} = call.request
    const rb = Block.fromBuffer(data)
    const {block} = scope
    block.receiveBlock(rb)
    callback(null, {
      message: 'ok'
    })
  }
}

export default scope => ({
  connect: connect(scope),
  sendTransaction: sendTransaction(scope),
  sendBlock: sendBlock(scope)
})
