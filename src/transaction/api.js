import Transaction from './model'

export default {
  'post /transaction/create': (req, res, next) => {
    res.send(200)
  },
  'get /transaction/detail': (req, res) => {
    res.send('detail')
  }
}
