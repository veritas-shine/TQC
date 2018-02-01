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
  const publicKeyHex = '040103000610bb763843d40e19fa54241428324e048c9d90c5a5b10c209ba58ea2b94bca59f287226f54e9dd2db916ab5d41f0d801b1410ebee537ddf1cfa35056f4bca6f1ebfd96034cacc926d233a463788545c919c51d2183c0c2d3b05bbeed91fe82f451697d14f83d92cb3877a861925b21ffac63e228222a43fb6238fd186bb6534f172f383e08c8b77e2d7cdddde019bc9d26f4a8076d6dd0a02ae77f545a2b93a80103dd5686d998b5ed9e6310b88d200574e1a7889f460e5cf6f95026e4dbe4381e3dc567b02b135022e8a98c9d630ce23c09bb1f1f3198566ba0741bfdb2121f9dbd47f5446db748c9f60861df63d9d738d358a1920b4c1c6b7838d9d86aa9e3333bd0507071f95bf34ed693e07b487d33a695ccca53a4503f2ab55ccb29be06226cde1a18a981eca249bbdbdf8349c15924bbea7ef92b232b0573d61701237719b78c4ba06129361e79fd562232aee75d84671ae9c3a6a4e57e2a5e1a9efaf505557704bc9d0d8436efd1041b6584c108016c49bc4dd606eda4b8c9756fb9584ef09a9a2541194dbe628250d464367199fd853819a4a20d8c044db45cc2e1e939bf954bb05d47f5c5246463c21398b31313bf29f4e4d884f1cc5d194b60684edd9eb456009bc8c8188650fda69cd846bb3114a7bdc0fe2ea8df530ee904d923c185118ca0b8fa8042c5c096f09cd7d0d4dec1353ba3e990e4ceba7adddd6677c0aace691dbb1a4281f6240c285c419d48cc23c75e450a1c76c0226f150250e2844a59a12b73cfc122400dea2e9e65543fd59ff64e81ae2c118a4bccd115ac568f3990e6dddce603652016adcbc92bae172f90c160340325337ce41f68492167ec0540ce127b33c645fd61c967173fdb4e3aa71c9d65d93621fbe77f7c5c8847244c4e67e532bf1933500331253e81bafa0ac670d662762c393cf27b1322cc1716ae0b698b46feff946ce6ea6b75f7152bae0f727d601e9a58307e535b34ca02fbeb03d8e97552110be9cf2abc7eb0b818e6a44eaa1614b5bec1ee64d7b4be62f14e9c9b0134ab523d3b90899329d9187a6290e407c42fb85379ead17edc16b29b5970142c97e51ea9ffb1c13ce5ef8151578a76d5fde4abda48a11f5f7163792f0be7425da267bfbf6dc0ea0d6c17e8f2b964ec64a43fe8dbe5343f365c70e31f4f4f5092aa137c24b4b8c0917daf6f539d51829c54a7694410283987bf3487834ef2094f76d5194c60c333e08acaeeb322eff6212f8b4a3d0b5fd656410c36e780c6a28ba489a1f8ed649bc74fb1c46d79e9179ad2257a1ac9cc682773e703c23c8ce3626a547ebb2f1cefa22d99554f05e8ac7c94f1c0843f2988a967e10468a4d9ad4e610ad84f3ca71fc79e8fc6215eed4a03e74646012b5749d21fdc42488455e91452a52136829bc9a2541e0bc479109ad48ec8bb12336dbf7da448'

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
