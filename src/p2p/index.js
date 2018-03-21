import grpc from 'grpc'
import path from 'path'
import apis from './api'

const protoPath = path.resolve(__dirname, './chain.proto')
const peerProto = grpc.load(protoPath).peer

export default (scope, callback) => {
  const {config} = scope
  const {peer} = config
  const {ip, port} = peer
  console.log(9, ip, port)
  const server = new grpc.Server()
  server.addService(peerProto.BlockChain.service, apis)
  server.bind(`${ip}:${port}`, grpc.ServerCredentials.createInsecure())
  server.start()
  callback(null, server)
}
