import Express from 'express'
import winston from 'winston'
import expressWinston from 'express-winston'
import config from './config'
import routes from './routes'
import p2p from './p2p'

const app = new Express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: () => false
}))

const ctx = {
  express: app
}

routes(ctx)

app.listen(config.port, error => {
  if (error) {
    console.log(error)
  } else {
    console.log(`PQC node started, listen on port: ${config.port}`)
  }
})

p2p()

process.on('uncaughtException', err => {
  // handle the error safely
  console.log(err)
})
