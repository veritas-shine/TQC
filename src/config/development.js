import ip from 'ip'

export default {
  port: 7770,
  name: 'PQC',
  wallet: {
    fileExtension: '.pqc'
  },
  network: 'testnet',
  ip: ip.address(),
  peer: {
    ip: ip.address(),
    port: 50051
  }
}
