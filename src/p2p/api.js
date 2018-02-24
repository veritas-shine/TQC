import {queryNodeList, registerNode} from '../database'

export default {
  /**
   * another node will call this to register it
   * @param req
   * @param res
   * @param next
   */
  'post /p2p/register': (req, res, next) => {
    const {body} = req
    registerNode(body)
    res.send(200)
  },

  'get /p2p/query': (req, res) => {
    const list = queryNodeList()
    res.send(list)
  },

  'delete /p2p/remove': (req, res) => {
    res.send(200)
  }
}
