import Bus from './model'

export default (scope, callback) => {
  try {
    const bus = new Bus(scope)
    callback(null, bus)
  } catch (e) {
    scope.logger.error(e)
  }
}
