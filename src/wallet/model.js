import fs from 'fs'
import Storage from 'storage'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
import config from '../config'

const {PrivateKey, Address} = pqccore

function loadFromFile(filePath) {
  const content = fs.readFileSync(filePath)
  if (content) {
    const obj = JSON.parse(content)
    if (obj) {
      const {address, privateKey} = obj
      const pk = PrivateKey.fromString(privateKey)
      return {
        address: Address.fromString(address),
        publicKey: pk.toPublicKey(),
        privateKey: pk
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
      const {address, publicKey, privateKey} = loadFromFile(filePath)
      const wallet = {address, publicKey, privateKey}
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
    const privateKey = new PrivateKey({
      bn: seed,
      network: config.network
    }, config.network)
    const publicKey = privateKey.toPublicKey()
    const address = publicKey.toAddress()
    const wallet = {address, publicKey, privateKey}
    this.currentWallet = {...wallet}
    return wallet
  }

  static saveToFile(wallet, filename) {
    const address = wallet.address.toString()
    filename = filename || address
    const data = {
      address,
      privateKey: wallet.privateKey.toString()
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
        address: wallet.address.toString(),
        publicKey: wallet.publicKey.toString(),
        privateKey: wallet.privateKey.toString()
      }
    } else {
      return {}
    }
  }
}

