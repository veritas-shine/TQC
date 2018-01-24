
const kSupportedMethods = ['get', 'post', 'put', 'delete']

export default function (routers, app) {
  Object.keys(routers).forEach(key => {
    const func = routers[key]
    const [method, url] = key.split(' ')
    if (kSupportedMethods.indexOf(method) !== -1) {
      app[method](url, func)
    } else {
      // unsupported method!
      console.warn('does not support method: ', key)
    }
  })
}
