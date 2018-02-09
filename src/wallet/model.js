import fs from 'fs'
import Storage from 'storage'
import pqccore from 'pqc-core'
import bip39 from 'bip39'
const {PrivateKey, Address, PublicKey} = pqccore
import config from '../config'

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
  constructor(filePath) {
    if (filePath) {
      // load account from file
      const {address, publicKey, privateKey} = loadFromFile(filePath)
      this.address = address
      this.privateKey = privateKey
      this.publicKey = publicKey
    } else {
      // generate keypair && address
      const mnemonic = bip39.generateMnemonic()
      const seed = bip39.mnemonicToSeed(mnemonic)
      this.privateKey = new PrivateKey({
        bn: seed,
        network: 'livenet'
      }, 'livenet')
      this.publicKey = this.privateKey.toPublicKey()
      this.address = this.publicKey.toAddress()
      console.log(this.privateKey, this.publicKey, this.address)
    }
  }

  saveToFile(filename) {
    const data = {
      address: this.address.toString(),
      privateKey: this.privateKey.toString()
    }
    if (Storage.createWalletFile(filename, JSON.stringify(data))) {
      console.log('save wallet ok!')
    }
  }
}

