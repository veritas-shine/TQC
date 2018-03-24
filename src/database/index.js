import Database from './model'

export default (scope, callback) => {
  const db = new Database(scope)
  callback(null, db)
}
