import winston from 'winston'

export default callback => {
  let level = 'error'
  if (process.env.NODE_ENV !== 'production') {
    level = 'debug'
  }
  const logger = new winston.Logger({
    level,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({filename: 'combined.log'})
    ]
  })

  callback(null, logger)
}
