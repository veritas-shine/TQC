import assert from 'assert'
import chai from 'chai'
const should = chai.should()
import {PrivateKey, Networks, encoding} from '..'
import PublicKey from '../publickey'
import Address from '../address'

describe('PrivateKey', function() {
  const wifHex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a'
  const wifLiveNet = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct'
  const buf = new Buffer(wifHex, 'hex')
  const publicKeyHex = '308204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60'

  it('should create private key from buffer', function () {

    const privatekey = PrivateKey.fromBuffer(buf)
    privatekey.toString().should.equal(wifHex)
  })

  it('should create private key from hex string', function () {
    const privatekey = PrivateKey.fromString(wifHex)
    privatekey.toString().should.equal(wifHex)
  })

  it('should create private key from wif string', function () {
    const privatekey = PrivateKey.fromString(wifLiveNet)
    privatekey.toString().should.equal(wifHex)
  })

  it('should create private key from JSON Object', function () {
    const privatekey = PrivateKey.fromObject({
      bn: buf,
      network: buf[0]
    })
    privatekey.toString().should.equal(wifHex)
  })

  it('should create private key from randm bytes', function () {
    const privatekey = PrivateKey.fromRandom()
    should.exist(privatekey)
  })

  it('should encode private key to hex string', function () {
    const privatekey = PrivateKey.fromString(wifHex)
    privatekey.toString().should.equal(wifHex)
  })

  it('should encode private key to buffer', function () {
    const privatekey = PrivateKey.fromBuffer(buf)
    assert.deepEqual(privatekey.toBuffer(), buf)
  })

  it('should generate public key from a private key', function () {
    const privatekey = PrivateKey.fromBuffer(buf)
    const publicKey = privatekey.toPublicKey()
    publicKey.toString().should.equal(publicKeyHex)
  })

  it('should generate address from a private key', function () {
    const privatekey = PrivateKey.fromBuffer(buf)
    const address = privatekey.toAddress()
    console.log(address)
  })

  it('should convert to JSON Object', function () {
    const privatekey = PrivateKey.fromBuffer(buf)
    const obj = privatekey.toObject()
    const json = privatekey.toJSON()
    assert.deepEqual(obj, json)
  })

  it('should show inspect string', function () {
    const privatekey = PrivateKey.fromBuffer(buf)
    privatekey.inspect().should.equal(`<PrivateKey: ${wifHex}, network: livenet, uncompressed>`)
  })
})
