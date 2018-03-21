import Database from './model'

export default (scope, callback) => {
  new Database(scope, callback)
}
