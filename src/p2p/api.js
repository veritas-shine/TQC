import pqccore from 'pqc-core'
import {queryNodeList, registerNode} from '../database'

const {Block} = pqccore

function connect(call, callback) {
  console.log(4, call.request)
  callback(null, {message: 'hello'})
}

function getLatestBlock(call, callback) {
  console.log(callback.request)
  callback(null, {})
}

function updateBlockChain(call, callback) {
  // verify block data
  const {header, transactions} = callback.request
  const block = new Block({header, transactions})
  if (block) {
    // block is valid will merge to this chain
  } else {
    // error
    callback(null, {message: `invalid block: ${header.hash}`})
  }
}

export default {
  connect,
  getLatestBlock,
  updateBlockChain
}
