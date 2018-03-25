import PeerService from './service'

export default (scope, callback) => {
  try {
    const service = new PeerService(scope)
    callback(null, service)
  } catch (e) {
    console.error(e)
  }
}
