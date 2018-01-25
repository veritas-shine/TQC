import Wallet from './model'

export default {
  'post /wallet/create': (req, res, next) => {
    res.send(200)
  },
  'get /wallet/detail': (req, res) => {
    res.send('detail')
  }
}
