import fs from 'fs'
import Storage from 'storage'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
import config from '../config'

const {Keypair} = pqccore

function loadFromFile(filePath) {
  const content = fs.readFileSync(filePath)
  if (content) {
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
  }
  return {}
}

export default class Wallet {
  static currentWallet = {}
  static load(filePath, shouldCreate) {
    if (filePath) {
      // load account from file
      const {secret, keypair, address} = loadFromFile(filePath)
      const wallet = {address, keypair, secret}
      this.currentWallet = {...wallet}
      return wallet
    } else if (shouldCreate) {
      // generate keypair && address
      const mnemonic = bip39.generateMnemonic()
      return this.create(mnemonic)
    } else {
      return this.currentWallet
    }
  }

  static create(mnemonic) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    const keypair = new Keypair({
      secret: seed,
      network: config.network
    })
    const address = keypair.toAddress()
    const wallet = {secret: seed, address, keypair}
    this.currentWallet = {...wallet}
    return wallet
  }

  static saveToFile(wallet, filename) {
    const address = wallet.address.toString()
    filename = filename || address
    const data = {
      secret: wallet.secret
    }
    console.log(64, data)
    if (Storage.createWalletFile(filename, JSON.stringify(data))) {
      console.log('save wallet ok!')
    }
  }

  static toJSON(wallet) {
    wallet = wallet || this.currentWallet
    if (Object.keys(wallet).length > 0) {
      return {
        secret: wallet.secret
      }
    } else {
      return {}
    }
  }
}

