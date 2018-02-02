import assert from 'assert'
import chai from 'chai'
import {PrivateKey, Networks} from '..'

const should = chai.should();

describe('PrivateKey', () => {
  const wifHex = '9076537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbff48a7cadb51d29a13b6b72ac37a8cf71e72a6fd8c868c6a98cc95ea0b794a87a';
  const wifLiveNet = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct';
  const buf = Buffer.from(wifHex, 'hex');
  const publicKeyHex = '26010300061006211b1b801ba417444337852f2b14dbb9905f0f61776fedb4aed9820b856209c8478bea599f46cb62c3985f9dc2ac019e55db2ce69a2fc7ece6c7d4cdd9e4358576c364bd6d2158055a5cbbd6ff38ec3c862ec5fdedb18c00c105c3f83688884707090dd19fe4654ae664150c97680e8373a1f4a18c0ec03265339c8370db1bedb39b648859f3eb88a403ab3be2a2abb5a1f7e99dd893d0cfb73ce13b19f561184798665202eae8d2edb8cc660bc94deba547870cadca2779682f13ac2da204111d3dc06391d286d251757e6b71b07bee584139594319f0c1604b53d386423a7dcc85fee68898131fba223f81b75d87935e0bbecf13f4c59ffd2bd4bd72af8932b9880d90904f526d4e78976ac62e68d285f95f634c3eab0890d235cca1c299358b6fbd05ba23e6a5f98afceee95e0ec3754b8ca4d7ab395ee73d6fa63b9ba06f9d4ec83166cf5d7a7f5d7171b3e2b18fb6af334fdbec94bd0f98e5a56b2f80e33987f8a2247fb2c894fecac74fd2530ee15fb6a9741f8fe4780086d0963b68d2c14efd99693915291455f3a53e46d60bd937cbbda3a48fbb2bc3a7dacead95cbb4bd12679c106c3fe29b447b5f75d6f6244e954ba31fe802ba3163926a3b2187fb87bbfd34fa382c8a229bec4fd7343000ec51886e14de07c88dd0e14a0932753a697a51786f7fcb9e90c7799fb091755d8ba31dd35e9fadf66089d1f8b586e515a27f7f2ce0113780bb50974266181553c0d4451831e444305f6982973b91ff631dece88ec15065fcd45e2d2ee23da866964a33ea46cdc2aacf8fe556ac4c522443bb44cf2cc0ffd0c4b833c18eb06bc166c94f3b2a1afb09f0af604e166d68a788990e61603bcf963948b1aa050535e7637eb2287e8aa70af3b9ff47520285883cd5f94975bb97ee061a03a6b9d6a871ceac4929a13bdd4cc15ee7cadfb3981319bb758278e751f26f57cab6a77bcec8c51b81a1db86d6ec191c90e86333420b294c69cefec6d55dbd649392588ddb17bc97156ed4effbe5a4b5385be14ffed2c4a44c06434698bef13df8063c396d0c88373da77252a84d6d2be5d8c1234ca69aad90561465a395a5900f3a62cfac71b220fab4cb3fb731634452ce560ba61f8f2d8ee5f5ba21b1ccc8fcdde411d1e51dac54ebde19f818f97092c3cf3f8af1c12e8c11c465b1b37ff096e364b7ef4b7c0d3029058c63ae4c36e5f7bd6bf554c70492545bc2c13b64731316df7ba54a932e1390b33c85c586267416a195d32b699204c0ca0ed28584702c2ae31179d21a3ea29acf702255f0d810a910548ff890acefb0486ca2244d16b9e43f106e70935c6c9cdc11233ddf89b8abf278f3c533fcc7ff9a8573bb87eba884847bd112473b0c07b0e7df0b490f3d02882a3d56d8a685e159a92d71770bd7f91daf76de052145055190009a3de5d738';

  it('should create private key from buffer', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    privatekey.toString().should.equal(wifHex);
    console.log(16, privatekey.toPublicKey().toString())
  });

  it('should create private key from hex string', () => {
    const privatekey = PrivateKey.fromString(wifHex);
    privatekey.toString().should.equal(wifHex);
    console.log(16, privatekey.toPublicKey().toString())
  });

  it('should create private key from wif string', () => {
    const privatekey = PrivateKey.fromString(wifLiveNet);
    privatekey.toString().should.equal(wifHex);
    console.log(16, privatekey.toPublicKey().toString())
  });

  it('should create private key from JSON Object', () => {
    const privatekey = PrivateKey.fromObject({
      bn: buf.slice(1),
      network: buf[0]
    });
    privatekey.toString().should.equal(wifHex);
    console.log(16, privatekey.toPublicKey().toString())
  });

  // it('should create private key from randm bytes', () => {
  //   for (let i = 0; i < 4; ++i) {
  //     const privatekey = PrivateKey.fromRandom()
  //     console.log(privatekey.toWIF(), privatekey.toString(), privatekey.toPublicKey().toString())
  //     should.exist(privatekey)
  //   }
  // });

  it('should encode private key to hex string', () => {
    const privatekey = PrivateKey.fromString(wifHex);
    privatekey.toString().should.equal(wifHex);
    console.log(16, privatekey.toPublicKey().toString())
  });

  it('should encode private key to buffer', () => {
    const privatekey = PrivateKey.fromBuffer(buf);
    assert.deepEqual(privatekey.toBuffer(), buf);
  });

  it('should generate public key from a private key', () => {
    for (let i = 0; i < 4; ++i) {
      const privatekey = PrivateKey.fromBuffer(buf);
      const publicKey = privatekey.toPublicKey();
      publicKey.toString().should.equal(publicKeyHex);
    }
  });
  //
  // it('should generate address from a private key', () => {
  //   for (let i = 0; i < 4; ++i) {
  //     const privatekey = PrivateKey.fromRandom();
  //     const address = privatekey.toAddress(Networks.get('testnet'));
  //     console.log(address, privatekey.toPublicKey());
  //   }
  // });
  //
  // it('should convert to JSON Object', () => {
  //   const privatekey = PrivateKey.fromBuffer(buf);
  //   const obj = privatekey.toObject();
  //   const json = privatekey.toJSON();
  //   assert.deepEqual(obj, json);
  // });
  //
  // it('should show inspect string', () => {
  //   const privatekey = PrivateKey.fromBuffer(buf)
  //   console.log(77, privatekey.toWIF(), privatekey.toString())
  //   privatekey.inspect().should.equal(`<PrivateKey: ${wifHex}, network: livenet, uncompressed>`);
  // });
});
