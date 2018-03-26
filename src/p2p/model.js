import grpc from 'grpc'
import path from 'path'
import Client from './client'
import serviceBinder from './service'
import Storage from '../storage'

export default class PeerService {
  constructor(scope) {
    this.scope = scope

    const {config} = scope
    const {peer: {ip, port}, peers} = config
    console.log(9, ip, port)

    const protoPath = path.resolve(__dirname, './chain.proto')
    const peerProto = grpc.load(protoPath).peer

    const server = new grpc.Server()
    server.addService(peerProto.BlockChain.service, serviceBinder(this.scope))
    server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure())
    server.start()
    this.server = server
    this.connections = {}
    this.connectToPeers(peers)
  }

  /**
   *
   * @return {Array}
   */
  getPeers() {
    return this.peers
  }

  /**
   * connect to peers
   * @param peers
   */
  connectToPeers(peers) {
    const p2 = Storage.readPeers()
    let array = peers
    if (p2.length > 0) {
      // we will ignore peers in code
      array = p2
    }

    this.peers = array.slice(0)
    const {config} = this.scope
    const {peer: {port}} = config

    array.forEach(ip => {
      const client = new Client(ip, port, this)
      this.connections[ip] = client
    })
    Storage.savePeers(this.peers)
  }

  /**
   *
   * @param info {{ip: String, network: String}}
   */
  addPeer(info) {
    const {config} = this.scope
    const {peer: {port}, network} = config
    const {ip} = info
    // same network type
    if (info.network === network) {
      // ignore already connected peer
      if (!this.connections[ip]) {
        const client = new Client(ip, port, this)
        this.connections[ip] = client

        // save peers list
        if (!this.peers.includes(ip)) {
          this.peers.push(ip)
          Storage.savePeers(this.peers)
        }
      }
    }
  }

  /**
   * remove peer by ip
   * @param ip {String}
   */
  removePeer(ip) {
    if (ip) {
      const client = this.connections[ip]
      if (client) {
        client.close()
        delete this.connections[ip]
        const idx = this.peers.indexOf(ip)
        if (idx !== -1) {
          this.peers.splice(idx, 1)
        }
        Storage.savePeers(this.peers)
      }
    }
  }

  /**
   * server will be notified if client will close
   * @param client {Client}
   * @param ctx
   */
  clientWillClose(client, ctx) {
    const {ip} = ctx
    delete this.connections[ip]
    // const idx = this.peers.indexOf(ip)
    // remove disconnected peers
    // if (idx !== -1) {
    //   this.peers.splice(idx, 1)
    //   Storage.savePeers(this.peers)
    // }
  }

  /**
   * did receive block from `getLastBlock`
   * @param client {Client}
   * @param block {Block}
   */
  clientDidGetLastBlock(client, block) {
    const blockService = this.scope.block
    blockService.syncBlock(block)
      .then()
  }

  /**
   * broadcast transaction to all other peer
   * @param tx {Transaction}
   */
  broadcastTransaction(tx) {
    this.connections.forEach(client => client.sendTransaction(tx))
  }

  /**
   * broadcast block to all other peer
   * @param block {Block}
   */
  broadcastBlock(block) {
    this.connections.forEach(client => client.sendBlock(block))
  }

  /**
   * close p2p network connection
   */
  close() {
    console.log('will close all p2p network connections')
    Object.keys(this.connections).forEach(ip => {
      this.connections[ip].close()
    })
  }
}
