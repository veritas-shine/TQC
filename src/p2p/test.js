import {expect} from 'chai'
import { addPeer, connectPeer, isConnectedToPeer, removePeer } from './client'
import createServer from './index'
import config from '../config'

const {peer} = config

describe('p2p test', () => {
  let server = null
  const testpeer = {
    ip: '192.168.199.162',
    port: 50051,
    network: 'testnet'
  }
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
  })

  it('should connect to server', () => {
    connectPeer(testpeer.ip, testpeer.port)
    expect(isConnectedToPeer(testpeer.ip, testpeer.port)).to.be.true
  })

  it('should disconnect from peer', () => {
    removePeer(peer.ip, peer.port)
    expect(isConnectedToPeer(testpeer.ip, testpeer.port)).to.be.false
  })

  it('should add peer to db', async () => {
    await addPeer(testpeer)
  })
})
