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
  static load(filePath) {
    if (filePath) {
      // load account from file
      const {address, publicKey, privateKey} = loadFromFile(filePath)
      const wallet = {address, publicKey, privateKey}
      this.currentWallet = {...wallet}
      return wallet
    } else {
      // generate keypair && address
      const mnemonic = bip39.generateMnemonic()
      const seed = bip39.mnemonicToSeed(mnemonic)
      const privateKey = new PrivateKey({
        bn: seed,
        network: config.network
      }, config.network)
      const publicKey = this.currentWallet.privateKey.toPublicKey()
      const address = this.currentWallet.publicKey.toAddress()
      const wallet = {address, publicKey, privateKey}
      this.currentWallet = {...wallet}
      return wallet
    }
  }

  static saveToFile(wallet, filename) {
    const data = {
      address: wallet.address.toString(),
      privateKey: wallet.privateKey.toString()
    }
    if (Storage.createWalletFile(filename, JSON.stringify(data))) {
      console.log('save wallet ok!')
    }
  }
}

