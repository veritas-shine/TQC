const should = require('chai').should();
const expect = require('chai').expect;
const _ = require('lodash');

const bitcore = require('../../..');

const Transaction = bitcore.Transaction;
const PrivateKey = bitcore.PrivateKey;
const Address = bitcore.Address;
const Script = bitcore.Script;
const Signature = bitcore.crypto.Signature;
const MultiSigInput = bitcore.Transaction.Input.MultiSig;

describe('MultiSigInput', () => {
  const privateKey1 = new PrivateKey('2ShLGGW7NPNdTJsYKkVxx8Wp5ThyASmpumDKkj5P8iCGia7s3yXY3AnhCQRs9kQeYEoHjGHgmDCLhynE2RZPfQYh8ej1YGK');
  const privateKey2 = new PrivateKey('2SV7QR25RCZAT6GeyhmTAw6Rrm4JSywAUKow9CWnY277c8BeHv7B2UNJPm3sG6zm8cSn2qNozy2yco6nVFMuy1q7ojNdsUB');
  const privateKey3 = new PrivateKey('2SWYiDzgzw1dmDh1SfZXi51kBUD6A1Qzncjf4Fgi1zm4LqxaM9qtRnLULeZjwMc97sfxwAka9j8Kz2d8VSwgFAKuj8AUgmg');
  const public1 = privateKey1.publicKey;
  const public2 = privateKey2.publicKey;
  const public3 = privateKey3.publicKey;
  const address = new Address('Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX');

  const output = {
    txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script('524d49040444000000018186f68f5d068f98ff995c49e70b5b78ec18b686f5c9519f9493f2d66034f1d39e1d77172fb4098285595194aa6a36708a56664a60e3f03b5c6db5b6353afa2d01030006106b5a641d2e855100354d4ace22afc958b0e5baa22e01fd68db0f065d9ec7d466e54982a8c4d128abd825922b5fde77eba909f53f125bffafee4921f28a0cffe5e9fef6689c83d9043be96b2a9d5732124e03660cee7069234de15573cb39df5b19d4cc34ef7d2ea4ec9ba5a6b79513b28a6b53925955649e72c9a5373a9fbb218425a558c3ff47b00fd42de5e73efbce16331bfed3affc4b2d3a1e60fa189c430a017860d00c6968e934f88e00a8bb3f083959d5fea6b1d027155c4b83c5b7351b589b87377be6de5e525090497b1be96989802e4f6a96523dd5eb71e48b379ac1d3d8ceaf7e4ec47e9fd4381126f1963071a56a2ada7e0dacf169b67fe0e5558ca803f688e36cc70726715e9318a57bc7b4cbe8eb77aab80125fc4972f0c17608d7a095d7f340b87ac750445005e552d58f7355a5a8c48fee375d4de061f99a2fa6a4b10f17e6e1dbb3f5b92ccb30268f6963ffb7ead12ef1c77355d967fe74b9a3f0c395f96168ed71e63ca518a2411bbe783f12f0376e806fb2a46f0fc4cd7387e8e6b954dca91afb29e0585ea47b60d27a4320db828cf3f830dbf284c154393eb4a589f4932048bbb9d881938cf2ba5db0fd6c80e7964bfb1162b3d47af2cf4334d9e9d01a70e6c0e52af670f15a4ea7c1fac8d0c9fd7dead8dc049e0a8a8e254cf56d31143d2251d2dfb475fb694cfa3f601db40acf1e8eb2d13e03e9a024f232baf879ba0b6284552614fc2d9d391e162b1df08772f680450efffd600fd3d88c7ca08c7755a64c1063df1469a1fbd34984f7d3ecf8991007f3ab04facfad6ea10e950aefd87d5c47ad64053b426791eb2df01619e8b8079d47dee1fafde6b5c6ad82fb2cfe6ed9cf0027d13ece77e468eeed0842a9714669ff87b03341cad4827d251e20566cd0f2f2dcf1feaeed70a91bbee2ef4b1c892b7bc68d4b28d827441390ec2ae346ce097ea3b72bb02cc0a70cb05d9f98a88422c6e6cdebc552c7cc8f48d5e5f5c9a90bfb6d546f7256c7798e793c5335b3f35f2dacc9ad68e33324bc29e4ec2627862a77b093726a1c24abb5499ea2ada96987ee14c6ea00fe3676e0e52776d59db91d3979fcc05021a43e41f9cd1855c74a96205c2e68c9320fbd7a5b2c1f136e15249e5f308fb315a8fa8ff53d71b527db701a948420f6b3098718f5f100a3916466469f165ad5c52ab5897eaa7a163435bc5cf2b0bb2ade3af3861a5915d7e82a4310dbc2e0fbe37fed256d1409e2faae7ea8ef217f290ecce992356a21939c471121c968002c5a293d82f82ef0812f4c94f2e2ecb8201f9bf0a24d5daea3ca8ac173529a0e531c33b37e0a9c6606af930f5f7fefa0f0eed9f00f4c548e8e723264d7c71ce6cf5944951d4a038be5dc49a127b8b22b241041130eccf06a871d1886b6d98c96d1c46077faf8d192388ee2dc28c7684d49040444000000019d730da08151aeed8c1a7eac5b699e4ee3245c8e0eef689e9b88bdfaea54ca709322e9e616b2718eaaaa3011c9dd645be7a7aac7b29e6ce67ce04ddefb19e89701030006107b60776d58bded0f587216d4c0a3fc5b54f9cbc856da76effcbc9f92e3ddd8d0f43bf6659020293567ae9f4feb3eab9437fa5ae57a93a90f59ca8ef1e58171fa32a5a67de4ae01df1bfef424631427260e445fafd4799174da82b0974741622f56ac82babd572693308f0671182c283dd04bbdfc263e3550ece3f2445ab2b56d38c273e7ce6784d09cf2989740ead485591e4d677b5addbac9e35b816b315aa9f4fe07b728c38f295252e95d39a6ad13953fadc2f3796c426b71089fab5b131d68d32f42a975abc8b1efca125216fe93f3c8dec226675cdf2fa313a0cfc5dbcf3ce5ca7ff318e6b2dd24b7a1d9b9b725bac7483695c583277994824d105d4284ad7e2960de01cec5ba8b56f0d2a0a2c61a751d7e2b5ae169265e4396830889aff21f158b96a5c89e9a38b954f7925a8352ed2e9a470cdd648b3d6f41ee8f6b5e732cc2c873ac5a1d2b95e9daf4051a99bf6075a937cd6d5f17862243b14616937e1c3d90e5da51d95bfe15583ca83ffafa4b4547e1d303f471f60ef1793f36f34a2a0abf6aec1ecb181725bbc5e0952e4b4fed8704f450c337332fb768f9753b15fff992e0991dc6591f87cf1610c55830fee7dcefde9f9018592109b7ac2e87a3a81ad5045e052b4e66b299d32c0eb1902423840132aa18fbd4eded02cc76cf47870961c8752aae2de036edb9b2a585c2af35a6729ef4b3f1151c056b4bb7d73cfd13fff085132db3e97f7162fb13e7e1695d8d0496796497e531077f4c5b3301f556b31d070f59be16c315abcf782341f7445d771b781f85e4cf5c55ae320ca061f33483b9d7ba4da9350e32ac342e5a8fb953bec3055f20f82de9240a9116c040d4d84d09168400878ffb4bcb383b2e7e32ec3b545f56b371391ee4f8bc3ec0e2fd93824cc0f0add9ae15255e6400fc1638fa9f5a19b2e5019769df3487ea418f2034889e6c43bbb82335f070187174b4665848bc511b0f55ccc39cdda7ad45da6f46fc95ebafdf2888ee592640150ec83a459b12f59e026a4415bbe989fecc5e68713ea1d0c1c133399f26b191d5ab6d27f8e48520087c1788b7445a780b358dba900d79f0147ec2358022fef6c26061b22e4ba964dcd483f7a7e0d6606f39e1a1b8a3654387a4f36f3c796492890f90e7871ab7e84dd3480b6f54d90a0133da4c330852d4615ceedd498275bd074d2b4a519c0f6fa3b9b0a64ce46d6b61c88121087695b57c3aab487a209a6be334f396e314bd575a61bcb685358375ccf219c7447dca25a6e81e152eacd83a67154cea6af58d47a702d9366b09d0b0763cc80f76f0a04edebb88893272a5d54463b8f65c58abd2ed7fa9c4dfe613a43e57611cd6972d852e35cbdca30c81d73d2947078f49ddd2851702f083732a8152946cbdf0a4e67620cdf7fbc1b5acd2710cd5d8996d0ee0a55c3e4e8120d04d4904044400000001e38ff92912fdacd0a03e9f8e49db95efb5196e8338c26ce8c02706f8f79e391ef08de2ecea8ec14b261526f44dea1d337aba557c2a15c6ebb783220e7f3cbca601030006105b8e3677cfbf7d926ea88f7c20b9e08081973b4e729154eb9eb7c4d1f8cbef099e98248ff9bd21a0bdf6423a1a11188f00432ee4464e2922d4f45b164ba4140232912b90002da8e33b1419d3026568af56ee64dd6bf41e14cfc02cf1f16b6796c2b4ced35e8849d8175307ec9889c4ce3be96db46c7f05222dcc1301e55429156f711df8a5853b95b7f79b902c214acef4aea0031df897f8f3339e954c4062ee215aa68e5d85e75449b2beab4e6a3bdb2e557c1003014bce867e82d2efe27d8bd3f4eb395399ac6150e68f5d87dd09e4b532fdeae92083ed6271d6ed3a8ec4c8a781df7d8b5a4cc6765af0e6e723fba92f49c9d3fa12f02fc74c0c19a6b3fc98542ef00699a92b82867378f0cb3c064f521f13bbd9aa5b93d32f0026a55b2d6edb6ba6dd572819a29d4b73756fa05f87100aa508ae4e30b34207df423bda41e8b383670265aadc4427bfaeb1ce41c460244fd224622596fa778336345942d1121656fb746171da94d2dfc1b731337b16e424aab76f7c1dc0a2b900882ebec14cfdaa6d24eb8e4c98b73c29f8f9e3979024e8f9e152f64982fa98eb0ed6d56c3edfdaa4d490f9f4886a1a45f0d114c98655445ac26c9b358a5b554cd5dbd364917a9bee5cd7587db540eb1e83993873a8467ffcbe4e8fff90e2de39d7e6db211b206ddd32c8b73fa73b7c41370a949b12e1d935f65dced6509f3ef16dbc1368437a06549774771f6b6f5b13574161b7333aa028530d8fb24346e2f6e9719290feaa247a9d19ab8a8e8b1c955db17a5f71176bc50be0bb664d563c48e8a84f4b1c7b6d31317f1fbae43c540bb01c7372d4c2ea02a72d7874078a60e8db81a0e8ef41e417a42c962abec51a3d0e41756ebc80044657ef2edb9e5726bbbad223fe3535d5ae41b178a69388fed162eef631e475abf9dca7544aee52f3d4d30a174d6c49230865d9934e5fe664965fa329a8d409da0a31a17dd89b4fae51ac2c931bb8e42f0a5d1dd328047a28d009c9d83f11bac9c7015c247429f7cc8aa70ce19795dc159b1ef4b4b6743696763305c8daf0fe6afa1b6df6a87fae24c3b1af16ede838fe87e8de82c9286c585d52c0cdba890a455268d9aa967d0ddd80ea9322e3869ec95fe54afe07d46b72273fd5552c63ab6d2d9c2d8aec1c7266ef8e986dc9e951f8eb370a986f83dc383c841b203e5e5d3c2d34f92e45b0edde23802811a62c8b3aa023e2b2381a005210a00c1269ee542e54c5d35bb18d8f8e0b90c6681a040e325c0f0a2335a5295ad830fed56c45fa2f7bfb964316d6bafeea5f8a473f0dd1c066ec8e85e89d9f35477ce22e5574c2d25b3a315a12f56cda52a328408745be77ff527d20426bc958e88261a05e466afdeed8e372b2a4aeb1ebc6db3beb9d334bfc60e3c7a21f34eee1eca349050621dab298b9a41ac47b9287313a2053ae'),
    glv: 1000000
  };
  it('can count missing signatures', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];

    input.countSignatures().should.equal(0);

    transaction.sign(privateKey1);
    input.countSignatures().should.equal(1);
    input.countMissingSignatures().should.equal(1);
    input.isFullySigned().should.equal(false);

    transaction.sign(privateKey2);
    input.countSignatures().should.equal(2);
    input.countMissingSignatures().should.equal(0);
    input.isFullySigned().should.equal(true);
  });
  it('can count missing signatures, signed with key 3 and 1', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];

    input.countSignatures().should.equal(0);

    transaction.sign(privateKey3);
    input.countSignatures().should.equal(1);
    input.countMissingSignatures().should.equal(1);
    input.isFullySigned().should.equal(false);

    transaction.sign(privateKey1);
    input.countSignatures().should.equal(2);
    input.countMissingSignatures().should.equal(0);
    input.isFullySigned().should.equal(true);
  });
  it('returns a list of public keys with missing signatures', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];

    _.every(input.publicKeysWithoutSignature(), (publicKeyMissing) => {
      const serialized = publicKeyMissing.toString();
      return serialized === public1.toString() ||
              serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
    transaction.sign(privateKey1);
    _.every(input.publicKeysWithoutSignature(), (publicKeyMissing) => {
      const serialized = publicKeyMissing.toString();
      return serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
  });
  it('can clear all signatures', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1)
      .sign(privateKey2);

    const input = transaction.inputs[0];
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });
  it('can estimate how heavy is the output going to be', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];
    input._estimateSize().should.equal(147);
  });
  it('uses SIGHASH_ALL by default', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];
    const sigs = input.getSignatures(transaction, privateKey1, 0);
    sigs[0].sigtype.should.equal(Signature.SIGHASH_ALL);
  });
  it('roundtrips to/from object', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1);
    const input = transaction.inputs[0];
    const roundtrip = new MultiSigInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('roundtrips to/from object when not signed', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];
    const roundtrip = new MultiSigInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('can parse list of signature buffers, from TX signed with key 1 and 2', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction('010000000140c1ae9d6933e4a08594f814ba73a4e94d19c8a83f45784b1684b3a3f84ee666000000009200473044022012bd2f15e56ab1b63d5ee23e194ed995ad4b81a21bcb8e0d913e5e791c07f7280220278bdb6b54cdc608193c869affe28dc2f700902218122770faff25c56142102b01483045022100e74e9955e042aca36f4f3ad907a0926c5b85e5d9608b0678a78a9cbc0259c7a2022053ff761e5f9a80558db7023e45c4979ac3c19a423f0184fb0596d3da308cc4b501ffffffff0140420f000000000017a91419438da7d16709643be5abd8df62ca4034a489a78700000000');

    const inputObj = transaction.inputs[0].toObject();
    inputObj.output = output;
    transaction.inputs[0] = new Transaction.Input(inputObj);

    inputObj.signatures = MultiSigInput.normalizeSignatures(
      transaction,
      transaction.inputs[0],
      0,
      transaction.inputs[0].script.chunks.slice(1).map((s) => { return s.buf; }),
      [public1, public2, public3]
    );

    transaction.inputs[0] = new MultiSigInput(inputObj, [public1, public2, public3], 2);

    transaction.inputs[0].signatures[0].publicKey.should.deep.equal(public1);
    transaction.inputs[0].signatures[1].publicKey.should.deep.equal(public2);
    should.equal(transaction.inputs[0].signatures[2], undefined);
    transaction.inputs[0].isValidSignature(transaction, transaction.inputs[0].signatures[0]).should.be.true;
    transaction.inputs[0].isValidSignature(transaction, transaction.inputs[0].signatures[1]).should.be.true;
  });
  it('can parse list of signature buffers, from TX signed with key 3 and 1', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction('010000000140c1ae9d6933e4a08594f814ba73a4e94d19c8a83f45784b1684b3a3f84ee666000000009300483045022100fc39ce4f51b2766ec8e978296e0594ea4578a3eb2543722fd4053e92bf16e6b1022030f739868397a881b019508b9c725a5c69a3652cb8928027748e93e67dfaef5501483045022100e74e9955e042aca36f4f3ad907a0926c5b85e5d9608b0678a78a9cbc0259c7a2022053ff761e5f9a80558db7023e45c4979ac3c19a423f0184fb0596d3da308cc4b501ffffffff0140420f000000000017a91419438da7d16709643be5abd8df62ca4034a489a78700000000');

    const inputObj = transaction.inputs[0].toObject();
    inputObj.output = output;
    transaction.inputs[0] = new Transaction.Input(inputObj);

    inputObj.signatures = MultiSigInput.normalizeSignatures(
      transaction,
      transaction.inputs[0],
      0,
      transaction.inputs[0].script.chunks.slice(1).map((s) => { return s.buf; }),
      [public1, public2, public3]
    );

    transaction.inputs[0] = new MultiSigInput(inputObj, [public1, public2, public3], 2);

    transaction.inputs[0].signatures[0].publicKey.should.deep.equal(public1);
    should.equal(transaction.inputs[0].signatures[1], undefined);
    transaction.inputs[0].signatures[2].publicKey.should.deep.equal(public3);
    transaction.inputs[0].isValidSignature(transaction, transaction.inputs[0].signatures[0]).should.be.true;
    transaction.inputs[0].isValidSignature(transaction, transaction.inputs[0].signatures[2]).should.be.true;
  });
});
