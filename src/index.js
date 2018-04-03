import Domain from 'domain'
import async from 'async'
import pqccore from 'pqc-core'

import config from './config'
import logger from './logger'
import validator from './lib/validator'
import server from './server'
import p2p from './p2p'
import database from './database'
import transaction from './transaction'
import wallet from './wallet'
import mine from './mine'
import block from './block'

const {Keypair} = pqccore

const d = Domain.create()
d.run(() => {
  async.auto({
    config(callback) {
      callback(null, config)
    },
    logger,
    validator,
    database: ['config', 'logger', database],
    server: ['config', 'logger', server],
    p2p: ['config', 'logger', p2p],
    wallet: ['server', wallet],
    block: ['database', block],
    transaction: ['config', 'logger', transaction],
    mine: ['block', 'transaction', 'server', mine]
  }, (error, scope) => {
    const lo = scope.logger
    if (error) {
      lo.error(error)
    } else {
      lo.log('Modules ready')

      process.on('uncaughtException', err => {
        // handle the error safely
        lo.error('system error', err)
        process.emit('cleanup')
      })

      process.once('SIGTERM', (error) => {
        lo.error(49, error)
        process.emit('cleanup');
      })

      process.once('exit', (error) => {
        lo.error(54, error)
        process.emit('cleanup');
      })

      process.once('SIGINT', (error) => {
        lo.error(59, error)
        process.emit('cleanup');
      })

      process.once('cleanup', () => {
        lo.error('Cleaning up...')
        // try to close all services
        Object.keys(scope)
          .forEach(key => {
            const service = scope[key]
            if (service && service.close) {
              service.close()
            }
          })
      })
    }
  })
})
