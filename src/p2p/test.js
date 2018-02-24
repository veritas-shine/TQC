import {connect} from './client'
import createServer from './index'
import config from '../config'

const {peer} = config
console.log(config, peer)

describe('p2p test', function () {
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
  it('should create server', function () {
    server = createServer(peer.ip, peer.port)
  })

  it('should connect to server', function () {
    connect(peer.ip, peer.port)
  })
})
