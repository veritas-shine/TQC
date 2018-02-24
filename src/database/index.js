import levelup from 'levelup'
import leveldown from 'leveldown'
import storage from '../storage'

const {NotFoundError} = levelup.errors
let kDB = null

export async function getPeerList() {
  return new Promise((resolve, reject) => {
    kDB.get('peers', (error, value) => {
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

export function openDB() {
  if (!kDB) {
    const p = storage.getDBPath()
    kDB = levelup(leveldown(p))
  }
  return kDB
}
