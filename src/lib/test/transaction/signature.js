import assert from 'assert'
require('chai').should()
const {expect} = require('chai')

const pqccore = require('../..')

const { Transaction, Script, PrivateKey, errors } = pqccore
const TransactionSignature = pqccore.Transaction.Signature

describe('TransactionSignature', () => {
  const fromAddress = 'GfJ7sr9k9razCx2C1TVm99GhWcjEkoQvKx';
  const privateKey = '2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct';
  const simpleUtxoWith100000Satoshis = {
    address: fromAddress,
    txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    outputIndex: 0,
    script: Script.buildPublicKeyHashOut(fromAddress).toString(),
    glv: 100000
  };

  const testJSON = '{"publicKey":"04440000000124ca9482e0b72fa244c777ba834ac50a9913f947f6e44cf22dc107760752f6c376537d384f48189193c1643a26a26fb7a99f73259e960f407eb83ce80bef8dbf010300061006211b1b801ba417444337852f2b14dbb9905f0f61776fedb4aed9820b856209c8478bea599f46cb62c3985f9dc2ac019e55db2ce69a2fc7ece6c7d4cdd9e4358576c364bd6d2158055a5cbbd6ff38ec3c862ec5fdedb18c00c105c3f83688884707090dd19fe4654ae664150c97680e8373a1f4a18c0ec03265339c8370db1bedb39b648859f3eb88a403ab3be2a2abb5a1f7e99dd893d0cfb73ce13b19f561184798665202eae8d2edb8cc660bc94deba547870cadca2779682f13ac2da204111d3dc06391d286d251757e6b71b07bee584139594319f0c1604b53d386423a7dcc85fee68898131fba223f81b75d87935e0bbecf13f4c59ffd2bd4bd72af8932b9880d90904f526d4e78976ac62e68d285f95f634c3eab0890d235cca1c299358b6fbd05ba23e6a5f98afceee95e0ec3754b8ca4d7ab395ee73d6fa63b9ba06f9d4ec83166cf5d7a7f5d7171b3e2b18fb6af334fdbec94bd0f98e5a56b2f80e33987f8a2247fb2c894fecac74fd2530ee15fb6a9741f8fe4780086d0963b68d2c14efd99693915291455f3a53e46d60bd937cbbda3a48fbb2bc3a7dacead95cbb4bd12679c106c3fe29b447b5f75d6f6244e954ba31fe802ba3163926a3b2187fb87bbfd34fa382c8a229bec4fd7343000ec51886e14de07c88dd0e14a0932753a697a51786f7fcb9e90c7799fb091755d8ba31dd35e9fadf66089d1f8b586e515a27f7f2ce0113780bb50974266181553c0d4451831e444305f6982973b91ff631dece88ec15065fcd45e2d2ee23da866964a33ea46cdc2aacf8fe556ac4c522443bb44cf2cc0ffd0c4b833c18eb06bc166c94f3b2a1afb09f0af604e166d68a788990e61603bcf963948b1aa050535e7637eb2287e8aa70af3b9ff47520285883cd5f94975bb97ee061a03a6b9d6a871ceac4929a13bdd4cc15ee7cadfb3981319bb758278e751f26f57cab6a77bcec8c51b81a1db86d6ec191c90e86333420b294c69cefec6d55dbd649392588ddb17bc97156ed4effbe5a4b5385be14ffed2c4a44c06434698bef13df8063c396d0c88373da77252a84d6d2be5d8c1234ca69aad90561465a395a5900f3a62cfac71b220fab4cb3fb731634452ce560ba61f8f2d8ee5f5ba21b1ccc8fcdde411d1e51dac54ebde19f818f97092c3cf3f8af1c12e8c11c465b1b37ff096e364b7ef4b7c0d3029058c63ae4c36e5f7bd6bf554c70492545bc2c13b64731316df7ba54a932e1390b33c85c586267416a195d32b699204c0ca0ed28584702c2ae31179d21a3ea29acf702255f0d810a910548ff890acefb0486ca2244d16b9e43f106e70935c6c9cdc11233ddf89b8abf278f3c533fcc7ff9a8573bb87eba884847bd112473b0c07b0e7df0b490f3d02882a3d56d8a685e159a92d71770bd7f91daf76de052145055190009a3de5d738","prevTxId":"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458","outputIndex":0,"inputIndex":0,"signature":"3045022100c728eac064154edba15d4f3e6cbd9be6da3498f80a783ab3391f992b4d9d71ca0220729eff4564dc06aa1d80ab73100540fe5ebb6f280b4a87bc32399f861a7b2563","sigtype":1}';
  const testObject = JSON.parse(testJSON);

  const getSignatureFromTransaction = function () {
    const transaction = new Transaction();
    transaction.from(simpleUtxoWith100000Satoshis);
    return transaction.getSignatures(privateKey)[0];
  };

  it('can be created without the `new` keyword', function() {
    this.timeout(20 * 1000)
    const privKey = new PrivateKey(privateKey)
    console.log(privKey.toAddress(), privKey.toPublicKey())
    const signature = getSignatureFromTransaction();
    const serialized = signature.toObject();
    const nonew = new TransactionSignature(serialized);
    expect(nonew.toObject()).to.deep.equal(serialized);
  });

  it('can be retrieved from Transaction#getSignatures', function() {
    this.timeout(20 * 1000)
    const signature = getSignatureFromTransaction();
    expect(signature instanceof TransactionSignature).to.equal(true);
  });

  // it('fails when trying to create from invalid arguments', function() {
  //   this.timeout(20 * 1000)
  //   expect(() => {
  //     return new TransactionSignature();
  //   }).to.throw(errors.InvalidArgument);
  //   expect(() => {
  //     return new TransactionSignature(1);
  //   }).to.throw(errors.InvalidArgument);
  //   expect(() => {
  //     return new TransactionSignature('hello world');
  //   }).to.throw(errors.InvalidArgument);
  // });
  it('returns the same object if called with a TransactionSignature', function() {
    this.timeout(20 * 1000)
    const signature = getSignatureFromTransaction();
    assert.deepEqual(new TransactionSignature(signature), signature);
  });

  it('gets returned by a P2SH multisig output', function() {
    this.timeout(20 * 1000)
    const private1 = new PrivateKey('2SWYiDzgzw1dmDh1SfZXi51kBUD6A1Qzncjf4Fgi1zm4LqxaM9qtRnLULeZjwMc97sfxwAka9j8Kz2d8VSwgFAKuj8AUgmg');
    const private2 = new PrivateKey('2SHixbZhuEYdkg6uCHFLTL7VpMQvXwQd67o2FaJBPEqeMRqiQP23onRNMfZzDQy3ZCZ3ypc9xMh8xBqGQELrz9o8s9SLgNF');
    const public1 = private1.publicKey;
    const public2 = private2.publicKey;
    const utxo = {
      txId: '0000000000000000000000000000000000000000000000000000000000000000', // Not relevant
      outputIndex: 0,
      script: Script.buildMultisigOut([public1, public2], 2).toScriptHashOut(),
      glv: 100000
    };
    const transaction = new Transaction().from(utxo, [public1, public2], 2);
    let signatures = transaction.getSignatures(private1);
    expect(signatures[0] instanceof TransactionSignature).to.equal(true);
    signatures = transaction.getSignatures(private2);
    expect(signatures[0] instanceof TransactionSignature).to.equal(true);
  });

  it('can be aplied to a Transaction with Transaction#addSignature', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction();
    transaction.from(simpleUtxoWith100000Satoshis);
    const signature = transaction.getSignatures(privateKey)[0];
    const addSignature = function () {
      return transaction.applySignature(signature);
    };
    expect(signature instanceof TransactionSignature).to.equal(true);
    expect(addSignature).to.not.throw();
  });

  describe('serialization', () => {
    it('serializes to an object and roundtrips correctly', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      expect(new TransactionSignature(serialized).toObject()).to.deep.equal(serialized);
    });

    it('can be deserialized with fromObject', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      expect(TransactionSignature.fromObject(serialized).toObject()).to.deep.equal(serialized);
    });

    it('can deserialize when signature is a buffer', function() {
      this.timeout(20 * 1000)
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      serialized.signature = Buffer.from(serialized.signature, 'hex');
      expect(TransactionSignature.fromObject(serialized).toObject()).to.deep.equal(signature.toObject());
    });

    it('can roundtrip to/from json', () => {
      const signature = getSignatureFromTransaction();
      const serialized = signature.toObject();
      const json = JSON.stringify(signature);
      expect(new TransactionSignature(JSON.parse(json)).toObject()).to.deep.equal(serialized);
      expect(TransactionSignature.fromObject(JSON.parse(json)).toObject()).to.deep.equal(serialized);
    });

    it('can parse a previously known json string', () => {
      const str = JSON.stringify(new TransactionSignature(JSON.parse(testJSON)));
      expect(JSON.parse(str)).to.deep.equal(JSON.parse(testJSON));
    });

    it('can deserialize a previously known object', () => {
      expect(new TransactionSignature(testObject).toObject()).to.deep.equal(testObject);
    });
  });
});
