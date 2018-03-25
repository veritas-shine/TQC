import grpc from 'grpc'
import path from 'path'
import Client from './client'
import apiBinder from './api'
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
    server.addService(peerProto.BlockChain.service, apiBinder(this.scope))
    server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure())
    server.start()
    this.server = server
    this.connections = {}
    this.connectToPeers(peers)
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

    const {config} = this.scope
    const {peer: {port}} = config

    array.forEach(ip => {
      const client = new Client(ip, port, this)
      this.connections[ip] = client
    })
  }

  /**
   * server will be notified if client will close
   * @param client {Client}
   * @param ctx
   */
  clientWillClose(client, ctx) {
    const {ip} = ctx
    delete this.connections[ip]
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
}
