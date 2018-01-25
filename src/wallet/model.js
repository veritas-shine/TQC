import fs from 'fs'
import 'lib/polyfill'
import Base58 from 'lib/encoding/base58'
import config from '../config'
import PQP from 'pqp'
import { wordArrayToBuffer } from 'lib/polyfill'
import Storage from 'storage'

const {Keygen, IO} = PQP

function generateAddressByPublicKey(publicKey) {
  const hash = publicKey.G.pack()
  const {length, prefix, suffix} = config.address
  const b58 = Base58.encode(wordArrayToBuffer(hash)).slice(0, length)
  return `${prefix}${b58}${suffix}`
}

function loadFromFile(filePath) {
  const io = new IO()
  const content = fs.readFileSync(filePath)
  if (content) {
    const obj = JSON.parse(content)
    if (obj) {
      const {address, publicKey, privateKey} = obj
      return {
        address,
        publicKey: io.extract_der_pub_key(publicKey),
        privateKey: io.extract_der_priv_key(privateKey)
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
      const gen = new Keygen()
      const [privateKey, publicKey] = gen.generate()
      this.address = generateAddressByPublicKey(publicKey)
      this.privateKey = privateKey
      this.publicKey = publicKey
    }
  }

  saveToFile(filename) {
    const io = new IO()
    const privateKeyString = io.get_der_priv_key(this.privateKey)
    const address = this.address
    const publicKeyString = io.get_der_pub_key(this.publicKey)
    const data = {
      address,
      publicKey: publicKeyString,
      privateKey: privateKeyString
    }
    if (Storage.createWalletFile(filename, JSON.stringify(data))) {
      console.log('save wallet ok!')
    }
  }
}

