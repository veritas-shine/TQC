import EIP from 'express-ipfilter'

const {IpFilter} = EIP
const localFilter = IpFilter(['::ffff', '127.0.0.1', '::1'], {mode: 'allow'})

const kSupportedMethods = ['get', 'post', 'put', 'delete']

export default function (routers, ctx) {
  const {server, logger} = ctx
  Object.keys(routers)
    .forEach(key => {
      const func = routers[key]
      const [method, url] = key.split(' ')
      if (kSupportedMethods.indexOf(method) !== -1) {
        server[method](url, /*localFilter,*/ (req, res) => {
          try {
            func(req, ctx)
              .then(result => res.send(result))
              .catch(error => {
                res.status(400)
                  .send({message: error.message})
              })
          } catch (e) {
            res.status(400)
              .send({message: e.message})
          }
        })
      } else {
        // unsupported method!
        logger.warn('does not support method: ', key)
      }
    })
}
