import code from '../config/code'
import schemas from './schemas'

export default {
  'get /peer/list': async (req, ctx) => {
    const {p2p} = ctx
    return {
      code: code.ok,
      data: p2p.getPeers()
    }
  },
  'post /peer/add': async (req, ctx) => {
    const {p2p, validator} = ctx
    const {peer} = req.body
    const ok = validator.validate(peer, schemas.peer)
    if (ok) {
      p2p.addPeer(peer)
      return {
        code: code.ok
      }
    } else {
      throw new Error('Invalid argument')
    }
  },
  'post /peer/remove': async (req, ctx) => {
    const {p2p, validator} = ctx
    const {ip} = req.body
    const ok = validator.validate(ip, schemas.ip)
    if (ok) {
      p2p.removePeer(ip)
      return {
        code: code.ok
      }
    } else {
      throw new Error('Invalid argument')
    }
  }
}
