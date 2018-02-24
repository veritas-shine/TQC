import grpc from 'grpc'
import path from 'path'
import config from '../config'
import {putBlock, addPeerToDB} from '../database'

const {peer, network} = config
const protoPath = path.resolve(__dirname, './chain.proto')
const peerProto = grpc.load(protoPath).peer
const kClients = {}

export function isConnectedToPeer(ip, port) {
  const address = `${ip}:${port}`
  return kClients[address]
}

// remove a peer (i.e. when con't connect to the peer
export function removePeer(ip, port) {
  const address = `${ip}:${port}`
  const client = kClients[address]
  if (client) {
    client.close()
    delete kClients[address]
  }
}

// add a peer by ip & port
export function connectPeer(ip, port) {
  const address = `${ip}:${port}`
  let client = kClients[address]
  if (!client) {
    // not added yet, so create the client and connect to server
    client = new peerProto.BlockChain(address, grpc.credentials.createInsecure())
    client.connect({ ip: peer.ip, port: peer.port, network }, (error, response) => {
      if (error) {
        console.error(error)
        client.close()
      } else {
        console.log(response)
        kClients[address] = client
      }
    })
  }
}

export async function addPeer(node) {
  await addPeerToDB(node)
  connectPeer(node.ip, node.port)
}

// when mine a block, broadcast to tell all other node to update
export async function addBlock(block) {
  // save block to db
  await putBlock(block)
  // broadcast update
  kClients.forEach(client => {
    client.updateBlockChain(block)
  })
}
