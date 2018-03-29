import pqccore from 'pqc-core'

const {Block, Transaction} = pqccore

function connect(scope) {
  return (call, callback) => {
    console.log(call)
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
    transaction.receiveTransaction(tx).then(() => {
      callback(null, {
        message: 'ok'
      })
    }).catch(e => {
      callback(e)
    })
  }
}

function sendBlock(scope) {
  return (call, callback) => {
    const {data} = call.request
    const rb = Block.fromBuffer(data)
    const {block} = scope
    block.receiveBlock(rb)
      .then(() => {
        callback(null, {
          message: 'ok'
        })
      })
  }
}

function getLastBlock(scope) {
  return (call, callback) => {
    scope.logger.log(48, 'getLastBlock')
    const blockService = scope.block
    blockService.lastBlock()
      .then(block => {
        callback(null, {
          data: block.toBuffer()
        })
      })
  }
}

function willClose(scope) {
  const {logger, p2p} = scope
  logger.log('p2p', 'did receive peer close message')
  return (call, callback) => {
    p2p.willPeerClose(call.request)
    callback(null, {})
  }
}

export default scope => ({
  connect: connect(scope),
  sendTransaction: sendTransaction(scope),
  sendBlock: sendBlock(scope),
  getLastBlock: getLastBlock(scope),
  willclose: willClose(scope)
})
