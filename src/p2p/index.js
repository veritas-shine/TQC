import grpc from 'grpc'
import path from 'path'
import apis from './api'
import config from '../config'

const { peer } = config

const protoPath = path.resolve(__dirname, './chain.proto')
const peerProto = grpc.load(protoPath).peer

export default (callback) => {
  const { ip, port } = peer
  console.log(9, ip, port)
  const server = new grpc.Server()
  server.addService(peerProto.BlockChain.service, apis)
  server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure())
  server.start()
  callback(null, server)
}
