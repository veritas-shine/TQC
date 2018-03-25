import grpc from 'grpc'
import path from 'path'
import config from '../config'

const {peer, network} = config
const protoPath = path.resolve(__dirname, './chain.proto')
const peerProto = grpc.load(protoPath).peer

export default class Client {
  constructor(ip, port, delegate) {
    this.ip = ip
    this.port = port
    this.delegate = delegate

    const address = `${ip}:${port}`
    console.log('will connect to peer:', address)

    const client = new peerProto.BlockChain(address, grpc.credentials.createInsecure())
    this.client = client
    // payload will be sent to target peer
    const payload = {
      ip: peer.ip,
      network
    }

    client.connect(payload, (error, response) => {
      if (error) {
        console.error(error)
        if (delegate && delegate.clientWillClose) {
          delegate.clientWillClose(this, {ip})
        }
        client.close()
      } else {
        console.log(response)
      }
    })
  }

  disconnect() {
    this.client.close()
  }

  /**
   *
   * @param tx {Transaction}
   */
  sendTransaction(tx) {
    this.client.sendTransaction({
      data: tx.toBuffer()
    })
  }

  /**
   * @param block {Block}
   */
  sendBlock(block) {
    this.client.sendBlock({
      data: block.toBuffer()
    })
  }
}
