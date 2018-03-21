import Domain from 'domain'
import async from 'async'

import config from './config'
import validator from './lib/validator'
import server from './server'
import p2p from './p2p'
import database from './database'
import wallet from './wallet'
import mine from './mine'

const d = Domain.create()
d.run(() => {
  async.auto({
    config(callback) {
      callback(null, config)
    },
    validator,
    database: ['config', database],
    server: ['config', server],
    p2p: ['config', p2p],
    wallet: ['server', wallet],
    mine: ['server', mine],
    ready: ['validator', 'database', 'server', 'p2p', 'wallet', 'mine', (scope, callback) => callback()]
  }, (error, scope) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Modules ready')

      process.once('cleanup', () => {
        console.error('Cleaning up...')
        // TODO
      })
    }
  })
})

process.on('uncaughtException', err => {
  // handle the error safely
  console.error('system error', err)
  process.emit('cleanup')
})

process.once('SIGTERM', () => {
  process.emit('cleanup');
})

process.once('exit', () => {
  process.emit('cleanup');
})

process.once('SIGINT', () => {
  process.emit('cleanup');
})
