import ZSchema from 'z-schema'

export default callback => {
  const validator = new ZSchema()
  callback(null, validator)
}
