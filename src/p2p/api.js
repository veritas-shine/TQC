import pqccore from 'pqc-core'

const {Block} = pqccore

function connect(call, callback) {
  // TODO
  console.log(4, call.request)
  callback(null, {message: 'hello'})
}

function getLatestBlock(call, callback) {
  // TODO
  console.log(callback.request)
  callback(null, {})
}

function updateBlockChain(call, callback) {
  // TODO
  // verify block data
  const {header, transactions} = callback.request
  const block = new Block({header, transactions})
  if (block) {
    // block is valid will merge to this chain
  } else {
    // error
    callback(null, {message: `invalid block: ${header.id}`})
  }
}

export default {
  connect,
  getLatestBlock,
  updateBlockChain
}
