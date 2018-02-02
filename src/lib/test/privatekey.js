import assert from 'assert'
import chai from 'chai'
import {PrivateKey, Networks} from '..'

const should = chai.should();

describe('PrivateKey', () => {
  const wifHex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a';
  const wifLiveNet = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct';
  const buf = Buffer.from(wifHex, 'hex');
  const publicKeyHex = '0401030006101629d57647b23173080182c5f9843d004e32333dc247c8bf54d0ec364444b76fe3182d6010e3da22cbe2692d802d10102dad5bdad5c7e595a10630dba769db020fd4a76463affd29cd80fb33ae7f22c324d09d734c4ed84d008d9061f6cb51dc240e83be25bfc1847c2f7b317c3242a09b144f73adc7d3d9f30c01c8422d30ddfd3646ea17bc7b818f4d8890389308a5cf54fe2574a9d0635038609fda95efa97f8405785173866578faa8fe846a402f9301e5d04ad9afe27da8c01821bacc86f17d0267dc0d5a51db6617043026a98aa44dfd1f3915ff292b5bbdd4a78555c335955484d88ca928d5d8fcafe486844dcd3f8b0df6443805fc1cb6cc1c571a92d01443bc7387d9699b27c4ac92998e1c39d2674c7f69e584826da13c0d49862b3cce83d0fad1fcf6cc47731e11491bd7b14352eb685d969dc3698f589122e00b2d5324f831614f5e8c88ef515ba92857d74e15fcb9f30e6680327321fe16171455506e281dc9d47e95c7fb79636c538be3081f3514a44ab14bff467655b5b502b196e0df2d1f18ac39cdd7cc6fbbb1c5e48e33781801c7cff0dd16c0c67c3ef630db431498782d766680de2f03bcc604acf1a99ff9d4e612d12798a7b4f7c1750f818abdffda60738d80ae146db417ee8a45b303e607a02e9aa4f65e287c6c7fbc045a57e390961dc2318cb7fc22e10d10286883fc658d453b74e5bd4878f1be0f268d83b233bc755d4869b77c8aef8f361e6d2888ab7fdd8ca779007bf08e9fd2beb3eefbb521a311ada95a105462428e94019e712dce7da886a3760852b921256623f9caafb53484c231c489b4fa6642bb246ed43048da4637faedcd5e50b934f4d52a535a4ac6a3e4986f48a648600bfb626f1bf16c386c1559fa8bc7c3cafe94d258856c2fb8f000c9d54e31f712bc4c7ae6488510c9bac10155755cc4faa0c673e9f96059bdf905e45a7ab5d1c5c02841c7af1d4c2a070eed7f081d5e72ca0d46f52c361887be18b976aba48f8c836e99a4759732c6b89f8fe92d64b54e637a56e3b112fe6e0873a117d29e7511bccdc829b08433fa9088fe6a602bbb80180cdea23c29aab2130ed711a6bc9f9f0140ffdf2753aa367145889e5fedd5fbd435bfd98684633fcd4578284a026657e91c37153af9b387d7f0391891d70900e34076e537a30d3f08fcf4ada8438be5cf7e60e24ebb29b92f49192bccd2367f6d60a86d63b56f11c5c04f4a1ea095399e0af1513610b85d8dc49debf04da2cabb629ed258fcfcca576b49c866df1dc2ee75f26aeb339727be6e151dbf24439e3de332bda120ba168fe56791e8e3acee7eb8e1589a4ac2dc56d39566d0562a1a3b54367638a588dfe00df0689efd099cbb75e460bf7e4a58c2caaf3000dca2a5692f7753584298801c13d4ffd8a22d3fcc9a827bc8f95b7609a68352cc00';

  it('should create private key from buffer', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    privatekey.toString().should.equal(wifHex);
  });

  it('should create private key from hex string', () => {
    const privatekey = PrivateKey.fromString(wifHex);
    privatekey.toString().should.equal(wifHex);
  });

  it('should create private key from wif string', () => {
    const privatekey = PrivateKey.fromString(wifLiveNet);
    privatekey.toString().should.equal(wifHex);
  });

  it('should create private key from JSON Object', () => {
    const privatekey = PrivateKey.fromObject({
      bn: buf.slice(1),
      network: buf[0]
    });
    privatekey.toString().should.equal(wifHex);
  });

  it('should create private key from randm bytes', () => {
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromRandom()
      console.log(privatekey.toWIF(), privatekey.toString(), privatekey.toPublicKey().toString())
      should.exist(privatekey)
    }
  });

  it('should encode private key to hex string', () => {
    const privatekey = PrivateKey.fromString(wifHex);
    privatekey.toString().should.equal(wifHex);
  });

  it('should encode private key to buffer', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    assert.deepEqual(privatekey.toBuffer(), buf);
  });

  it('should generate public key from a private key', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    const publicKey = privatekey.toPublicKey();
    publicKey.toString().should.equal(publicKeyHex);
  });

  it('should generate address from a private key', () => {
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromRandom();
      const address = privatekey.toAddress(Networks.get('testnet'));
      console.log(address, privatekey.toPublicKey());
    }
  });

  it('should convert to JSON Object', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    const obj = privatekey.toObject();
    const json = privatekey.toJSON();
    assert.deepEqual(obj, json);
  });

  it('should show inspect string', () => {
    const privatekey = PrivateKey.fromBuffer(buf)
    console.log(77, privatekey.toWIF(), privatekey.toString())
    privatekey.inspect().should.equal(`<PrivateKey: ${wifHex}, network: livenet, uncompressed>`);
  });
});
