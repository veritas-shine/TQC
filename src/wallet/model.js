import fs from 'fs'
import Storage from 'storage'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
import CryptoJS from 'crypto-js'
import config from '../config'

const {Keypair} = pqccore

function loadFromFile(filePath) {
  const content = fs.readFileSync(filePath)
  if (content) {
    try {
      const obj = JSON.parse(content)
      if (obj) {
        const {seed, encrypted} = obj
        console.log(17, obj)
        if (encrypted) {
          return {
            seed,
            encrypted
          }
        } else {
          console.log(23, seed)
          const keypair = new Keypair({secret: seed})
          return {
            address: keypair.toAddress(),
            keypair,
            seed
          }
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

  reload() {
    const files = Storage.getWalletFiles()
    this.load(files[0], false)
  }
  /**
   * load wallet from file
   * @param filePath {string}
   * @param shouldCreate {Boolean}
   * @return {{seed: string, address: string, keypair: Keypair}}
   */
  load(filePath, shouldCreate = false) {
    if (filePath) {
      // load account from file
      const {seed, keypair, address, encrypted} = loadFromFile(filePath)
      const wallet = {
        address,
        keypair,
        seed,
        encrypted
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
   * @param mnemonic {string}
   * @return {{seed: string, address: string, keypair: Keypair}}
   */
  create(mnemonic) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    const keypair = new Keypair({
      secret: seed,
      network: config.network
    })
    const address = keypair.toAddress()
    const wallet = {
      seed,
      address,
      keypair
    }
    this.current = {...wallet}
    return wallet
  }

  lock() {
    const {seed, address, password, encrypted} = this.current
    if (!encrypted) {
      const {logger} = this.scope
      console.log(97, this.current)
      const filename = address.toString()
      const seedString = seed.toString('hex')
      const bytes = CryptoJS.AES.encrypt(seedString, password)
      const data = {
        seed: bytes.toString(), // base64 encoded
        encrypted: true
      }
      if (Storage.createWalletFile(filename, JSON.stringify(data))) {
        logger.log('save wallet ok!')
      }
      this.current = {
        seed: bytes.toString(),
        encrypted: true
      }
    }
  }

  /**
   * unlock wallet with AES key
   * @param password {string}
   */
  unlock(password) {
    const {seed, encrypted} = this.current
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(seed, password)
      const pt = bytes.toString(CryptoJS.enc.Utf8)
      const realSeed = Buffer.from(pt, 'hex')
      const keypair = new Keypair({secret: realSeed})
      this.current = {
        address: keypair.toAddress(),
        keypair,
        seed: realSeed,
        password,
        encrypted: false
      }
    }
    console.log(130, this.current)
    return {...this.current}
  }

  /**
   * save wallet to file, JSON format
   * @param filename {string}
   */
  saveToFile(filename) {
    const {logger} = this.scope
    const address = this.current.address.toString()
    filename = filename || address
    const data = {
      seed: this.current.seed.toString('hex')
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
        address: wallet.address,
        encrypted: wallet.encrypted
      }
    } else {
      return {}
    }
  }
}
