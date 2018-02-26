import {expect} from 'chai'
import { addPeer, connectPeer, isConnectedToPeer, removePeer } from './client'
import createServer from './index'
import config from '../config'

const {peer} = config

const targetPeer = {
  ip: '192.168.199.162',
  port: 50051,
  network: 'testnet'
}

describe('p2p server test', () => {
  let server = null

  function shutdown() {
    server.tryShutdown((error) => {
      if (error) {
        console.log(error)
      } else {
        console.log('success')
      }
    })
  }
  it('should create server', () => {
    server = createServer(peer.ip, peer.port)
    shutdown()
  })
})

describe('p2p client test', () => {

  it('should connect to server', async () => {
    const client = await connectPeer(targetPeer.ip, targetPeer.port)
    expect(isConnectedToPeer(targetPeer.ip, targetPeer.port)).to.be.true
    client.close()
  })

  it('should disconnect from peer', () => {
    removePeer(targetPeer.ip, targetPeer.port)
    expect(isConnectedToPeer(targetPeer.ip, targetPeer.port)).to.be.false
  })

  it('should add peer to db', async () => {
    await addPeer(targetPeer)
  })
})
