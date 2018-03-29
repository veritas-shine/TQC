import fs from 'fs'
import Storage from 'storage'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
import config from '../config'

const {Keypair} = pqccore

function loadFromFile(filePath) {
  const content = fs.readFileSync(filePath)
  if (content) {
    try {
      const obj = JSON.parse(content)
      if (obj) {
        const {secret} = obj
        const keypair = new Keypair({secret})
        return {
          address: keypair.toAddress(),
          keypair,
          secret
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  return {}
}

export default class WalletService {
  constructor(scope) {
    this.scope = scope
    this.current = {}
  }

  /**
   * load wallet from file
   * @param filePath {String}
   * @param shouldCreate {Boolean}
   * @return {{secret: String, address: String, keypair: Keypair}}
   */
  load(filePath, shouldCreate = false) {
    if (filePath) {
      // load account from file
      const {secret, keypair, address} = loadFromFile(filePath)
      const wallet = {
        address,
        keypair,
        secret
      }
      this.current = {...wallet}
      return wallet
    } else if (shouldCreate) {
      // generate keypair && address
      const mnemonic = bip39.generateMnemonic()
      return this.create(mnemonic)
    } else {
      return this.current
    }
  }

  /**
   * create wallet from mnemonic string
   * @param mnemonic {String}
   * @return {{secret: String, address: String, keypair: Keypair}}
   */
  create(mnemonic) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    const keypair = new Keypair({
      secret: seed,
      network: config.network
    })
    const address = keypair.toAddress()
    const wallet = {
      secret: seed,
      address,
      keypair
    }
    this.current = {...wallet}
    return wallet
  }

  /**
   * save wallet to file, JSON format
   * @param filename {String}
   */
  saveToFile(filename) {
    const {logger} = this.scope
    const address = this.current.address.toString()
    filename = filename || address
    const data = {
      secret: this.current.secret.toString('hex')
    }
    if (Storage.createWalletFile(filename, JSON.stringify(data))) {
      logger.log('save wallet ok!')
    }
  }

  /**
   * convert wallet to JSON format
   * @return {Object}
   */
  toJSON() {
    const wallet = this.current
    if (Object.keys(wallet).length > 0) {
      return {
        secret: wallet.secret.toString('hex')
      }
    } else {
      return {}
    }
  }
}
