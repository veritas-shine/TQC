import grpc from 'grpc'
import path from 'path'
import pqccore from 'pqc-core'
import config from '../config'

const {Block} = pqccore

const {peer, network} = config
const protoPath = path.resolve(__dirname, './chain.proto')
const peerProto = grpc.load(protoPath).peer

export default class Client {
  constructor(ip, port, delegate, scope) {
    this.scope = scope
    this.ip = ip
    this.port = port
    this.delegate = delegate
    const {logger} = scope
    const address = `${ip}:${port}`
    logger.log('will connect to peer:', address)

    const client = new peerProto.BlockChain(address, grpc.credentials.createInsecure())
    this.client = client
    // payload will be sent to target peer
    const payload = {
      network
    }

    client.connect(payload, (error, response) => {
      if (error) {
        logger.error(error)
        if (delegate && delegate.clientWillClose) {
          delegate.clientWillClose(this, {ip})
        }
        client.close()
      } else {
        logger.log(response)
        this.getLastBlock()
      }
    })
  }

  /**
   *
   * @param silent {Boolean}
   */
  disconnect(silent = false) {
    const {logger} = this.scope
    if (silent) {
      this.client.close()
    } else {
      this.client.willclose({}, (error, response) => {
        if (error) {
          logger.error(error)
        } else {
          logger.log(response)
          this.client.close()
        }
      })
    }
  }

  getLastBlock() {
    const {logger} = this.scope
    this.client.getLastBlock({}, (error, response) => {
      if (error) {
        logger.error(error)
      } else {
        const {data} = response
        const b = Block.fromBuffer(data)
        logger.log(54, b)
        if (this.delegate && this.delegate.clientDidGetLastBlock) {
          this.delegate.clientDidGetLastBlock(this, b)
        }
      }
      logger.log(response)
    })
  }

  /**
   *
   * @param tx {Transaction}
   */
  sendTransaction(tx) {
    const {logger} = this.scope
    const payload = {
      data: tx.toBuffer()
    }
    this.client.sendTransaction(payload, (error, response) => {
      if (error) {
        logger.error(error)
      } else {
        logger.log(response)
      }
    })
  }

  /**
   * @param block {Block}
   */
  sendBlock(block) {
    const {logger} = this.scope
    const payload = {
      data: block.toBuffer()
    }
    this.client.sendBlock(payload, (error, response) => {
      if (error) {
        logger.error(error)
      } else {
        logger.log(response)
      }
    })
  }
}
