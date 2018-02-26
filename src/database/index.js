import levelup from 'levelup'
import leveldown from 'leveldown'
import pqccore from 'pqc-core'
import storage from '../storage'

const {Block} = pqccore
const {NotFoundError} = levelup.errors

let kDB = null

export function openDB() {
  if (!kDB) {
    const p = storage.getDBPath()
    kDB = levelup(leveldown(p))
  }
  return kDB
}

function queryObject(key) {
  openDB()

  return new Promise((resolve, reject) => {
    kDB.get(key, (error, value) => {
      if (error) {
        if (error instanceof NotFoundError) {
          resolve({})
        } else {
          reject(error)
        }
      } else {
        const obj = JSON.parse(value)
        resolve(obj)
      }
    })
  })
}

function putObject(key, value) {
  openDB()
  if (key && value) {
    kDB.put(key, value)
  }
}

export async function getPeerList() {
  return queryObject('peers')
}

export async function addPeerToDB(node) {
  let peers = await getPeerList()
  if (!peers) {
    peers = {}
  }
  const address = `${node.ip}:${node.port}`
  const peer = peers[address]
  if (!peer) {
    peers[address] = node
    return kDB.put('peers', JSON.stringify(peers))
  }
  return null;
}

export async function removeNodeByIP(ip, port) {
  const peers = await getPeerList()
  if (peers) {
    const address = `${ip}:${port}`
    const peer = peers[address]
    if (peer) {
      delete peers[address]
      return kDB.put('peers', JSON.stringify(peers))
    }
  }
  return null;
}

export async function queryBlock(blockHash) {
  const json = await queryObject(blockHash)
  if (json) {
    return new Block(json)
  } else {
    return null
  }
}

export async function putBlock(block) {
  if (block instanceof Block) {
    const savedBlock = await queryBlock(block.header.hash)
    if (savedBlock) {
      throw new Error('block already in db')
    } else {
      return putObject(block.header.hash, JSON.stringify(block.toJSON()))
    }
  } else {
    throw new Error('invalid argument type')
  }
}
