import ip from 'ip'

export default {
  port: 7770,
  name: 'PQC',
  mine: {
    enable: false,
  },
  wallet: {
    fileExtension: '.pqc'
  },
  network: 'testnet',
  ip: ip.address(),
  peer: {
    ip: ip.address(),
    port: 50051
  },
  peers: ['192.168.199.162']
}
