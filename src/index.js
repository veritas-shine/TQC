import Domain from 'domain'
import async from 'async'

import config from './config'
import validator from './lib/validator'
import server from './server'
import p2p from './p2p'
import database from './database'
import wallet from './wallet'
import mine from './mine'
import block from './block'

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
    block: ['database', block],
    // mine: ['block', 'server', mine],
    ready: ['validator', 'database', 'server', 'p2p', 'wallet', (scope, callback) => callback()]
  }, (error, scope) => {
    if (error) {
      console.error(error)
    } else {
      console.log('Modules ready')

      process.once('cleanup', () => {
        console.error('Cleaning up...')
        // TODO
        const {database} = scope
        database.close()
      })
    }
  })
})

process.on('uncaughtException', err => {
  // handle the error safely
  console.error('system error', err)
  process.emit('cleanup')
})

process.once('SIGTERM', (error) => {
  console.error(49, error)
  process.emit('cleanup');
})

process.once('exit', (error) => {
  console.error(54, error)
  process.emit('cleanup');
})

process.once('SIGINT', (error) => {
  console.error(59, error)
  process.emit('cleanup');
})
