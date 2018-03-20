const kSupportedMethods = ['get', 'post', 'put', 'delete']

export default function (routers, app) {
  Object.keys(routers).forEach(key => {
    const func = routers[key]
    const [method, url] = key.split(' ')
    if (kSupportedMethods.indexOf(method) !== -1) {
      app[method](url, (req, res) => {
        try {
          func(req).then(result => res.send(result))
        } catch (e) {
          res.status(400).send({ message: e.message })
        }
      })
    } else {
      // unsupported method!
      console.warn('does not support method: ', key)
    }
  })
}
