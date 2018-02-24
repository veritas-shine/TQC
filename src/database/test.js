import {expect} from 'chai'
import assert from 'assert'
import {openDB, getPeerList, addPeerToDB, removeNodeByIP} from './index'

describe('db test', () => {
  before(() => {
    openDB()
  })

  it('should open db', () => {
    const db = openDB()
    expect(db).to.exist
  })

  it('should query peers', async () => {
    const list = await getPeerList()
    console.log(list)
  })

  it('should add peer', async () => {
    const peer = {
      ip: '192.168.0.1',
      port: 50051,
      network: 'testnet'
    }
    const address = `${peer.ip}:${peer.port}`
    await addPeerToDB(peer)
    const list2 = await getPeerList()
    console.log(31, list2)
    const p = list2[address]
    assert.deepEqual(peer, p)
  })

  it('should remove peer', async () => {
    const peer = {
      ip: '192.168.0.1',
      port: 50051,
      network: 'testnet'
    }
    const address = `${peer.ip}:${peer.port}`
    await addPeerToDB(peer)
    await removeNodeByIP(peer.ip, peer.port)
    const list2 = await getPeerList()
    const p = list2[address]
    expect(p).to.not.exist
  })
})
