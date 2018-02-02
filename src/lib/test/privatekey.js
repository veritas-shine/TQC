import assert from 'assert'
import chai from 'chai'
const should = chai.should()
import {PrivateKey, Networks, encoding, crypto} from '..'
import PublicKey from '../publickey'
import Address from '../address'

describe('PrivateKey', function() {
  const wifHex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a'
  const wifLiveNet = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct'
  const buf = new Buffer(wifHex, 'hex')
  const publicKeyHex = '040103000610c3756637e4384d32fccdd2f3c7658dea6549cefe8ceff8670e184ee1036eeb115e2313e6a60125fdcc326f8fef6e36d054452a823478e345b8cf7740b5e85942c4eefc0c9cb26573a3a51175c4d6823cf631ccb56145a844f4e7febf7aff6db8505c105f26734311dc36f184022834491813ade49e5922b4033e001ae706421857440bc6c82ac05e268105c8397da3491d71228db331d6c22b7fc19ab34b5f7daeb0769ac3e9a5ad8277745c37c908534122e876653af4174e4c1b01ea8616b87334896f6107575243fdca950a23c72f0ba4f02bd942803c9fedd66d574763692f2bbb0bb955eb0cd7c9bc7f80f8fb0641c66e1a63e310275d19a792c8c53e1231da22e0aff45e936528e7fdbf581117002cd030cb5cc2cdadad76e68d42e7cdd5efdef47ce2537ab5cb44fceffbf351c5be5ac6c585fd3716d9e2d221b78911a3d6c4482dbefac2dbc670fce26cb24da8a7d5bc46382b2ee05649f0c24a8eb6981d78650f2f2bcec06fb2fea02397aff700811cfec722c2549ae05c658f68b872521de9982084a3c458954637839fc175e63b0878717e0914ecff9dd18cae706bf80794dee3ae965d1bab9c15125b1f7690309901a97df5442ed11cc6c382df01d76b58f58c37560f28c139378e9ea1a6552e0deb213d157592e6958a7ea49c70872c361852ec3e56fe46a0f6d17863dff56034d8ea23c5cedb12b01e027f781ecf2daca6d7f30d07877d23fe708e45920e132985f51aaf2dea49b79235a56968dec8532360a2e55f5a89c30e27ed9ce8cea596c322b16427b9f8291ebfaf2d7a3e455367b4fcabb3ee74077d7c21f03ce6e8356553f6bc2556190663feec7b40f71cb0e191b851f046acab3940678841d8df20e93dca0de8546d9ffd3f39fe6929471bf2dcebc9e2df5a16c2a69d2fa0ecdb819379987f7dd7b9beef54498b196284c615c3c7b0466488afa3ad6bed4822d9e8de8937cebf27340cb799887f9eb5280b6ed84757fa4bf6ac1c23538e571447671382bad27b5b0fb14afcc5a45482208e9a8aca452f2ea8a0e6250f6f0dbce0bf312c06eb8417cb880126a606c102118285d6be2d4677a7fd858e04ff20fc375bddd6c4109769d28b2cf39df7edc64b9f6852a95cd999a2c727270f3c683ee3b51ff28aabbf1f9a13fda6869ab83693d8a95dc8b1953d3cf04ff01a18297fbbf9420b130038b9bb79e2f5f49b8c3cc902626e7bf0f918b55da1ac5d0175532f52b3e066f9f07710bbf7caebc3135a52b45b882aa46ac8dead3bc0433d8e25ca0e285e060851510538d3781d909c6a9a6ac2b46ff04b3387585ac079ebe4b2547a3c3c1b8258336d0d6a7bd411b07e4f1575270e767465ddefc9217dbc9451be2e7ab8dd5c0990705bb0692d8d413621ddfb6fe481967618eaa465feef622c81702f6f190b3a17bb0e4ba'

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
      bn: buf.slice(1),
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
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromRandom()
      const address = privatekey.toAddress(Networks.get('testnet'))
      console.log(address, privatekey.toPublicKey())
    }
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
