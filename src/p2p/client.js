import grpc from 'grpc'
import path from 'path'
import pqccore from 'pqc-core'
import config from '../config'

const {Block} = pqccore

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
        this.getLastBlock()
      }
    })
  }

  disconnect() {
    this.client.close()
  }

  getLastBlock() {
    this.client.getLastBlock({}, (error, response) => {
      if (error) {
        console.error(error)
      } else {
        const {data} = response
        const b = Block.fromBuffer(data)
        if (this.delegate && this.delegate.clientDidGetLastBlock) {
          this.delegate.clientDidGetLastBlock(this, b)
        }
      }
      console.log(response)
    })
  }

  /**
   *
   * @param tx {Transaction}
   */
  sendTransaction(tx) {
    const payload = {
      data: tx.toBuffer()
    }
    this.client.sendTransaction(payload, (error, response) => {
      if (error) {
        console.error(error)
      } else {
        console.log(response)
      }
    })
  }

  /**
   * @param block {Block}
   */
  sendBlock(block) {
    const payload = {
      data: block.toBuffer()
    }
    this.client.sendBlock(payload, (error, response) => {
      if (error) {
        console.error(error)
      } else {
        console.log(response)
      }
    })
  }
}
