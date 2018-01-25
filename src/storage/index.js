import os from 'os'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import config from 'config'

function getDataFolder() {
  return process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/PQC' : '/var/local')
}

function getWalletPath() {
  let folder = getDataFolder()
  folder = path.join(folder, '/wallet')
  switch (os.platform()) {
    case 'darwin': {
      if (!fs.existsSync(folder)) {
        if(!mkdirp.sync(folder)) {
          console.log('fail to make folder', folder)
        }
      }
      return folder
    }
  }
  return folder
}

function getWalletFiles() {
  const folder = getWalletPath()
  const result = []
  fs.readdirSync(folder).forEach(name => {
    if (path.extname(name) === config.wallet.fileExtension) {
      const filePath = path.join(folder, name)
      result.push(filePath)
    }
  })
  return result
}

function createWalletFile(name, data) {
  if (name && data) {
    name = `wallet_${name}${config.wallet.fileExtension}`
    const folder = getWalletPath()
    const filePath = path.join(folder, name)
    if (!fs.existsSync(filePath)) {
      return fs.writeFileSync(filePath, data)
    }
  }
  return false
}

export default {
  getWalletPath,
  getWalletFiles,
  createWalletFile
}
