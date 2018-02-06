
import assert from 'assert'

const should = require('chai').should();
const expect = require('chai').expect;
const pqccore = require('../..');

const BufferUtil = pqccore.util.buffer;
const Script = pqccore.Script
const Networks = pqccore.Networks;
const Opcode = pqccore.Opcode;
const PublicKey = pqccore.PublicKey;
const Address = pqccore.Address;

// 2ShLGGW7NPNdTJsYKkVxx8Wp5ThyASmpumDKkj5P8iCGia7s3yXY3AnhCQRs9kQeYEoHjGHgmDCLhynE2RZPfQYh8ej1YGK 044400000001e38ff92912fdacd0a03e9f8e49db95efb5196e8338c26ce8c02706f8f79e391ef08de2ecea8ec14b261526f44dea1d337aba557c2a15c6ebb783220e7f3cbca601030006105b8e3677cfbf7d926ea88f7c20b9e08081973b4e729154eb9eb7c4d1f8cbef099e98248ff9bd21a0bdf6423a1a11188f00432ee4464e2922d4f45b164ba4140232912b90002da8e33b1419d3026568af56ee64dd6bf41e14cfc02cf1f16b6796c2b4ced35e8849d8175307ec9889c4ce3be96db46c7f05222dcc1301e55429156f711df8a5853b95b7f79b902c214acef4aea0031df897f8f3339e954c4062ee215aa68e5d85e75449b2beab4e6a3bdb2e557c1003014bce867e82d2efe27d8bd3f4eb395399ac6150e68f5d87dd09e4b532fdeae92083ed6271d6ed3a8ec4c8a781df7d8b5a4cc6765af0e6e723fba92f49c9d3fa12f02fc74c0c19a6b3fc98542ef00699a92b82867378f0cb3c064f521f13bbd9aa5b93d32f0026a55b2d6edb6ba6dd572819a29d4b73756fa05f87100aa508ae4e30b34207df423bda41e8b383670265aadc4427bfaeb1ce41c460244fd224622596fa778336345942d1121656fb746171da94d2dfc1b731337b16e424aab76f7c1dc0a2b900882ebec14cfdaa6d24eb8e4c98b73c29f8f9e3979024e8f9e152f64982fa98eb0ed6d56c3edfdaa4d490f9f4886a1a45f0d114c98655445ac26c9b358a5b554cd5dbd364917a9bee5cd7587db540eb1e83993873a8467ffcbe4e8fff90e2de39d7e6db211b206ddd32c8b73fa73b7c41370a949b12e1d935f65dced6509f3ef16dbc1368437a06549774771f6b6f5b13574161b7333aa028530d8fb24346e2f6e9719290feaa247a9d19ab8a8e8b1c955db17a5f71176bc50be0bb664d563c48e8a84f4b1c7b6d31317f1fbae43c540bb01c7372d4c2ea02a72d7874078a60e8db81a0e8ef41e417a42c962abec51a3d0e41756ebc80044657ef2edb9e5726bbbad223fe3535d5ae41b178a69388fed162eef631e475abf9dca7544aee52f3d4d30a174d6c49230865d9934e5fe664965fa329a8d409da0a31a17dd89b4fae51ac2c931bb8e42f0a5d1dd328047a28d009c9d83f11bac9c7015c247429f7cc8aa70ce19795dc159b1ef4b4b6743696763305c8daf0fe6afa1b6df6a87fae24c3b1af16ede838fe87e8de82c9286c585d52c0cdba890a455268d9aa967d0ddd80ea9322e3869ec95fe54afe07d46b72273fd5552c63ab6d2d9c2d8aec1c7266ef8e986dc9e951f8eb370a986f83dc383c841b203e5e5d3c2d34f92e45b0edde23802811a62c8b3aa023e2b2381a005210a00c1269ee542e54c5d35bb18d8f8e0b90c6681a040e325c0f0a2335a5295ad830fed56c45fa2f7bfb964316d6bafeea5f8a473f0dd1c066ec8e85e89d9f35477ce22e5574c2d25b3a315a12f56cda52a328408745be77ff527d20426bc958e88261a05e466afdeed8e372b2a4aeb1ebc6db3beb9d334bfc60e3c7a21f34eee1eca349050621dab298b9a41ac47b9287313a20
// 2SV7QR25RCZAT6GeyhmTAw6Rrm4JSywAUKow9CWnY277c8BeHv7B2UNJPm3sG6zm8cSn2qNozy2yco6nVFMuy1q7ojNdsUB 0444000000019d730da08151aeed8c1a7eac5b699e4ee3245c8e0eef689e9b88bdfaea54ca709322e9e616b2718eaaaa3011c9dd645be7a7aac7b29e6ce67ce04ddefb19e89701030006107b60776d58bded0f587216d4c0a3fc5b54f9cbc856da76effcbc9f92e3ddd8d0f43bf6659020293567ae9f4feb3eab9437fa5ae57a93a90f59ca8ef1e58171fa32a5a67de4ae01df1bfef424631427260e445fafd4799174da82b0974741622f56ac82babd572693308f0671182c283dd04bbdfc263e3550ece3f2445ab2b56d38c273e7ce6784d09cf2989740ead485591e4d677b5addbac9e35b816b315aa9f4fe07b728c38f295252e95d39a6ad13953fadc2f3796c426b71089fab5b131d68d32f42a975abc8b1efca125216fe93f3c8dec226675cdf2fa313a0cfc5dbcf3ce5ca7ff318e6b2dd24b7a1d9b9b725bac7483695c583277994824d105d4284ad7e2960de01cec5ba8b56f0d2a0a2c61a751d7e2b5ae169265e4396830889aff21f158b96a5c89e9a38b954f7925a8352ed2e9a470cdd648b3d6f41ee8f6b5e732cc2c873ac5a1d2b95e9daf4051a99bf6075a937cd6d5f17862243b14616937e1c3d90e5da51d95bfe15583ca83ffafa4b4547e1d303f471f60ef1793f36f34a2a0abf6aec1ecb181725bbc5e0952e4b4fed8704f450c337332fb768f9753b15fff992e0991dc6591f87cf1610c55830fee7dcefde9f9018592109b7ac2e87a3a81ad5045e052b4e66b299d32c0eb1902423840132aa18fbd4eded02cc76cf47870961c8752aae2de036edb9b2a585c2af35a6729ef4b3f1151c056b4bb7d73cfd13fff085132db3e97f7162fb13e7e1695d8d0496796497e531077f4c5b3301f556b31d070f59be16c315abcf782341f7445d771b781f85e4cf5c55ae320ca061f33483b9d7ba4da9350e32ac342e5a8fb953bec3055f20f82de9240a9116c040d4d84d09168400878ffb4bcb383b2e7e32ec3b545f56b371391ee4f8bc3ec0e2fd93824cc0f0add9ae15255e6400fc1638fa9f5a19b2e5019769df3487ea418f2034889e6c43bbb82335f070187174b4665848bc511b0f55ccc39cdda7ad45da6f46fc95ebafdf2888ee592640150ec83a459b12f59e026a4415bbe989fecc5e68713ea1d0c1c133399f26b191d5ab6d27f8e48520087c1788b7445a780b358dba900d79f0147ec2358022fef6c26061b22e4ba964dcd483f7a7e0d6606f39e1a1b8a3654387a4f36f3c796492890f90e7871ab7e84dd3480b6f54d90a0133da4c330852d4615ceedd498275bd074d2b4a519c0f6fa3b9b0a64ce46d6b61c88121087695b57c3aab487a209a6be334f396e314bd575a61bcb685358375ccf219c7447dca25a6e81e152eacd83a67154cea6af58d47a702d9366b09d0b0763cc80f76f0a04edebb88893272a5d54463b8f65c58abd2ed7fa9c4dfe613a43e57611cd6972d852e35cbdca30c81d73d2947078f49ddd2851702f083732a8152946cbdf0a4e67620cdf7fbc1b5acd2710cd5d8996d0ee0a55c3e4e8120d0
// 2SWYiDzgzw1dmDh1SfZXi51kBUD6A1Qzncjf4Fgi1zm4LqxaM9qtRnLULeZjwMc97sfxwAka9j8Kz2d8VSwgFAKuj8AUgmg 0444000000018186f68f5d068f98ff995c49e70b5b78ec18b686f5c9519f9493f2d66034f1d39e1d77172fb4098285595194aa6a36708a56664a60e3f03b5c6db5b6353afa2d01030006106b5a641d2e855100354d4ace22afc958b0e5baa22e01fd68db0f065d9ec7d466e54982a8c4d128abd825922b5fde77eba909f53f125bffafee4921f28a0cffe5e9fef6689c83d9043be96b2a9d5732124e03660cee7069234de15573cb39df5b19d4cc34ef7d2ea4ec9ba5a6b79513b28a6b53925955649e72c9a5373a9fbb218425a558c3ff47b00fd42de5e73efbce16331bfed3affc4b2d3a1e60fa189c430a017860d00c6968e934f88e00a8bb3f083959d5fea6b1d027155c4b83c5b7351b589b87377be6de5e525090497b1be96989802e4f6a96523dd5eb71e48b379ac1d3d8ceaf7e4ec47e9fd4381126f1963071a56a2ada7e0dacf169b67fe0e5558ca803f688e36cc70726715e9318a57bc7b4cbe8eb77aab80125fc4972f0c17608d7a095d7f340b87ac750445005e552d58f7355a5a8c48fee375d4de061f99a2fa6a4b10f17e6e1dbb3f5b92ccb30268f6963ffb7ead12ef1c77355d967fe74b9a3f0c395f96168ed71e63ca518a2411bbe783f12f0376e806fb2a46f0fc4cd7387e8e6b954dca91afb29e0585ea47b60d27a4320db828cf3f830dbf284c154393eb4a589f4932048bbb9d881938cf2ba5db0fd6c80e7964bfb1162b3d47af2cf4334d9e9d01a70e6c0e52af670f15a4ea7c1fac8d0c9fd7dead8dc049e0a8a8e254cf56d31143d2251d2dfb475fb694cfa3f601db40acf1e8eb2d13e03e9a024f232baf879ba0b6284552614fc2d9d391e162b1df08772f680450efffd600fd3d88c7ca08c7755a64c1063df1469a1fbd34984f7d3ecf8991007f3ab04facfad6ea10e950aefd87d5c47ad64053b426791eb2df01619e8b8079d47dee1fafde6b5c6ad82fb2cfe6ed9cf0027d13ece77e468eeed0842a9714669ff87b03341cad4827d251e20566cd0f2f2dcf1feaeed70a91bbee2ef4b1c892b7bc68d4b28d827441390ec2ae346ce097ea3b72bb02cc0a70cb05d9f98a88422c6e6cdebc552c7cc8f48d5e5f5c9a90bfb6d546f7256c7798e793c5335b3f35f2dacc9ad68e33324bc29e4ec2627862a77b093726a1c24abb5499ea2ada96987ee14c6ea00fe3676e0e52776d59db91d3979fcc05021a43e41f9cd1855c74a96205c2e68c9320fbd7a5b2c1f136e15249e5f308fb315a8fa8ff53d71b527db701a948420f6b3098718f5f100a3916466469f165ad5c52ab5897eaa7a163435bc5cf2b0bb2ade3af3861a5915d7e82a4310dbc2e0fbe37fed256d1409e2faae7ea8ef217f290ecce992356a21939c471121c968002c5a293d82f82ef0812f4c94f2e2ecb8201f9bf0a24d5daea3ca8ac173529a0e531c33b37e0a9c6606af930f5f7fefa0f0eed9f00f4c548e8e723264d7c71ce6cf5944951d4a038be5dc49a127b8b22b241041130eccf06a871d1886b6d98c96d1c46077faf8d192388ee2dc28c768
// 2SHixbZhuEYdkg6uCHFLTL7VpMQvXwQd67o2FaJBPEqeMRqiQP23onRNMfZzDQy3ZCZ3ypc9xMh8xBqGQELrz9o8s9SLgNF 0444000000016514f5c552229bc6e2db4d29bc1bed79936ac5ce4dbfdf807f8f797dd8b5e9573c194f40f17af6d0c7d23586551a90651a4f912ec4bee4145dff37dd3124c1d50103000610db729aa17e50d7fa13d0d1161dafbdd0204eda55bcc16eff65ad506253e10abbf9cb8d2dd3b4cce10d801aba8adf3ff3f8ab5246e76459afbc142b599155312c3e4b897232126f9dda5f4c9662959bb843f1775634a8aa5e7b268360d9a26be32f5af1e59a053e03698a118ba896c10b52ffef7cb9e112eae7b78d5dbdc361a5646e7de532412406546c26cbcd498e15ee86ff85d81148c7d3db364228861459244d22bd74ed33efc547123fcd2dcf318565a6497bfc5909adbba870354f342b8f138234ee0189b1717d1440c77b427478749b92333609e362689214eabc5b9e488a0d2269103a5f69522d4ad4b46509c2b940c3db01c5ea57aedaa2d0e5c01fac618ee0e0b1f83283e0876cd9ce88b63980754e2de2708ccef42686a23a279a5b77e0e5fbd31b605397e09d449935b77f8586331ab3538892db7c4129817298c290f2e15e4dcbc984c3936540ca091ef3a30b0be567d06a00eca73140b870477b6d1da82c28ccf055fa4437a610350b6f185e9f73e9c4094afc753206298d7d8e579dddf52918fdab9aa33f71eceeaa38c5bcef92cdd591dbfa074b5487d5a44929464ecbf285dbee23384a3fcbae55fa29dd31f229b229b811e12e730d3f7e935e8d08be5e74a2ea932523353561bc895bf603e112e430356b47e5ed9c9eb5801046486d25752b7e29a4b004163dc29f85302f389d29c1c0d69112b3979fc70706d05b3b1902771e5606c979382d1312bc7cfaf6847dd27e48874c10ccc9da848fb94d941dfb55f5b2cfeda647b082159dd6abe06c591fbb180993d6b7d4b6a0e75cac1744f266755dcc150001da9fb410525b8be2624b572878741bc48f3906bd31bbb4cf4982303b9486806b306fd491686626a1e4455102b0c35a6b6b04ef0633199cb4043c309b45fed4c674d0c8d0821b83d4a6ff416be232d79514dce778fc4738b9d5d8de9fa36ca5e600d99e190cbe5857e582316a60a8a0ef00695a95a0531352c30d37f166df3cc99e9278ec410f3aad8f9f89572290645b7cf9b55f018e3c9ea221bc75f824e3021be73c9916fcc3e767a6e14a0bc1537aa8666dd78beffc053ab4efb2491be5f9d9e5465d1ca6825d22306f254a4f37fcdb7c0ba542fe26f84f26ce1da2abf286b355c42aecee6d762416a4292091888aa865aaa549d6050d5e89ad31690ee8234f0b25437a24afc9d430b7f43affaaf2e7af20f990a606d7e9e5cee03b96074309a4308c920f0bb3f3ef0f36592eec7ff0aebd4006cc90fe2b1214e64b7b99e68029a50e7222eb335fd09f4bd43651ba77b5dd19c19960b247e2ba84bf7cd9d7686798a7e095ef95dbcc8b566b3b5f0af8e103e1297b162f2f68831fce4c403568cd6e245302fa1ec2b2a5012c01bb1cf790a1054c4b18ef7085dc236494421eb497cf7fb9c2fa92ab7d537b14b03170

describe('Script', () => {
  it('should make a new script', () => {
    const script = new Script();
    should.exist(script);
  });

  describe('#fromBuffer', () => {
    it('should parse this buffer containing an OP code', () => {
      const buf = new Buffer(1);
      buf[0] = Opcode.OP_0;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].opcodenum.should.equal(buf[0]);
    });

    it('should parse this buffer containing another OP code', () => {
      const buf = new Buffer(1);
      buf[0] = Opcode.OP_CHECKMULTISIG;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].opcodenum.should.equal(buf[0]);
    });

    it('should parse this buffer containing three bytes of data', () => {
      const buf = Buffer.from([3, 1, 2, 3]);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
    });

    it('should parse this buffer containing OP_PUSHDATA1 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA1;
      buf.writeUInt8(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
    });

    it('should parse this buffer containing OP_PUSHDATA2 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA2;
      buf.writeUInt16LE(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
    });

    it('should parse this buffer containing OP_PUSHDATA4 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA4;
      buf.writeUInt16LE(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
    });

    it('should parse this buffer an OP code, data, and another OP code', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 0, 1, 2, 3, 0]);
      buf[0] = Opcode.OP_0;
      buf[1] = Opcode.OP_PUSHDATA4;
      buf.writeUInt16LE(3, 2);
      buf[buf.length - 1] = Opcode.OP_0;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(3);
      script.chunks[0].opcodenum.should.equal(buf[0]);
      script.chunks[1].buf.toString('hex').should.equal('010203');
      script.chunks[2].opcodenum.should.equal(buf[buf.length - 1]);
    });
  });

  describe('#toBuffer', () => {
    it('should output this buffer containing an OP code', () => {
      const buf = new Buffer(1);
      buf[0] = Opcode.OP_0;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].opcodenum.should.equal(buf[0]);
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer containing another OP code', () => {
      const buf = new Buffer(1);
      buf[0] = Opcode.OP_CHECKMULTISIG;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].opcodenum.should.equal(buf[0]);
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer containing three bytes of data', () => {
      const buf = Buffer.from([3, 1, 2, 3]);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer containing OP_PUSHDATA1 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA1;
      buf.writeUInt8(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer containing OP_PUSHDATA2 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA2;
      buf.writeUInt16LE(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer containing OP_PUSHDATA4 and three bytes of data', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 1, 2, 3]);
      buf[0] = Opcode.OP_PUSHDATA4;
      buf.writeUInt16LE(3, 1);
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(1);
      script.chunks[0].buf.toString('hex').should.equal('010203');
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });

    it('should output this buffer an OP code, data, and another OP code', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 0, 1, 2, 3, 0]);
      buf[0] = Opcode.OP_0;
      buf[1] = Opcode.OP_PUSHDATA4;
      buf.writeUInt16LE(3, 2);
      buf[buf.length - 1] = Opcode.OP_0;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(3);
      script.chunks[0].opcodenum.should.equal(buf[0]);
      script.chunks[1].buf.toString('hex').should.equal('010203');
      script.chunks[2].opcodenum.should.equal(buf[buf.length - 1]);
      script.toBuffer().toString('hex').should.equal(buf.toString('hex'));
    });
  });

  describe('#fromASM', () => {
    it('should parse this known script in ASM', () => {
      const asm = 'OP_DUP OP_HASH160 f4c03610e60ad15100929cc23da2f3a799af1725 OP_EQUALVERIFY OP_CHECKSIG';
      const script = Script.fromASM(asm);
      script.chunks[0].opcodenum.should.equal(Opcode.OP_DUP);
      script.chunks[1].opcodenum.should.equal(Opcode.OP_HASH160);
      script.chunks[2].opcodenum.should.equal(20);
      script.chunks[2].buf.toString('hex').should.equal('f4c03610e60ad15100929cc23da2f3a799af1725');
      script.chunks[3].opcodenum.should.equal(Opcode.OP_EQUALVERIFY);
      script.chunks[4].opcodenum.should.equal(Opcode.OP_CHECKSIG);
    });
  });

  describe('#fromString', () => {
    it('should parse these known scripts', () => {
      Script.fromString('OP_0 OP_PUSHDATA4 3 0x010203 OP_0').toString().should.equal('OP_0 OP_PUSHDATA4 3 0x010203 OP_0');
      Script.fromString('OP_0 OP_PUSHDATA2 3 0x010203 OP_0').toString().should.equal('OP_0 OP_PUSHDATA2 3 0x010203 OP_0');
      Script.fromString('OP_0 OP_PUSHDATA1 3 0x010203 OP_0').toString().should.equal('OP_0 OP_PUSHDATA1 3 0x010203 OP_0');
      Script.fromString('OP_0 3 0x010203 OP_0').toString().should.equal('OP_0 3 0x010203 OP_0');
    });
  });

  describe('#toString', () => {
    it('should work with an empty script', () => {
      const script = new Script();
      script.toString().should.equal('');
    });

    it('should output this buffer an OP code, data, and another OP code', () => {
      const buf = Buffer.from([0, 0, 0, 0, 0, 0, 1, 2, 3, 0]);
      buf[0] = Opcode.OP_0;
      buf[1] = Opcode.OP_PUSHDATA4;
      buf.writeUInt16LE(3, 2);
      buf[buf.length - 1] = Opcode.OP_0;
      const script = Script.fromBuffer(buf);
      script.chunks.length.should.equal(3);
      script.chunks[0].opcodenum.should.equal(buf[0]);
      script.chunks[1].buf.toString('hex').should.equal('010203');
      script.chunks[2].opcodenum.should.equal(buf[buf.length - 1]);
      script.toString().toString('hex').should.equal('OP_0 OP_PUSHDATA4 3 0x010203 OP_0');
    });

    it('should output this known script as ASM', () => {
      const script = Script.fromHex('76a914f4c03610e60ad15100929cc23da2f3a799af172588ac');
      script.toASM().should.equal('OP_DUP OP_HASH160 f4c03610e60ad15100929cc23da2f3a799af1725 OP_EQUALVERIFY OP_CHECKSIG');
    });
  });

  describe('toHex', () => {
    it('should return an hexa string "03010203" as expected from [3, 1, 2, 3]', () => {
      const buf = Buffer.from([3, 1, 2, 3]);
      const script = Script.fromBuffer(buf);
      script.toHex().should.equal('03010203');
    });
  });

  describe('#isDataOut', () => {
    it('should know this is a (blank) OP_RETURN script', () => {
      Script('OP_RETURN').isDataOut().should.equal(true);
    });

    it('validates that this 40-byte OP_RETURN is standard', () => {
      const buf = new Buffer(40);
      buf.fill(0);
      Script(`OP_RETURN 40 0x${buf.toString('hex')}`).isDataOut().should.equal(true);
    });
    it('validates that this 80-byte OP_RETURN is standard', () => {
      const buf = new Buffer(80);
      buf.fill(0);
      Script(`OP_RETURN OP_PUSHDATA1 80 0x${buf.toString('hex')}`).isDataOut().should.equal(true);
    });

    it('validates that this 40-byte long OP_CHECKMULTISIG is not standard op_return', () => {
      const buf = new Buffer(40);
      buf.fill(0);
      Script(`OP_CHECKMULTISIG 40 0x${buf.toString('hex')}`).isDataOut().should.equal(false);
    });

    it('validates that this 81-byte OP_RETURN is not a valid standard OP_RETURN', () => {
      const buf = new Buffer(81);
      buf.fill(0);
      Script(`OP_RETURN OP_PUSHDATA1 81 0x${buf.toString('hex')}`).isDataOut().should.equal(false);
    });
  });

  describe('#isPublicKeyIn', () => {
    it('correctly identify scriptSig as a public key in', () => {
      // from txid: 5c85ed63469aa9971b5d01063dbb8bcdafd412b2f51a3d24abf2e310c028bbf8
      // and input index: 5
      const scriptBuffer = new Buffer('483045022050eb59c79435c051f45003d9f82865c8e4df5699d7722e77113ef8cadbd92109022100d4ab233e070070eb8e0e62e3d2d2eb9474a5bf135c9eda32755acb0875a6c20601', 'hex');
      const script = pqccore.Script.fromBuffer(scriptBuffer);
      script.isPublicKeyIn().should.equal(true);
    });
  });

  describe('#isPublicKeyHashIn', () => {
    it('should identify this known pubkeyhashin (uncompressed pubkey version)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 65 0x04e365859b3c78a8b7c202412b949ebca58e147dba297be29eee53cd3e1d300a6419bc780cc9aec0dc94ed194e91c8f6433f1b781ee00eac0ead2aae1e8e0712c6').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known pubkeyhashin (hybrid pubkey version w/06)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 65 0x06e365859b3c78a8b7c202412b949ebca58e147dba297be29eee53cd3e1d300a6419bc780cc9aec0dc94ed194e91c8f6433f1b781ee00eac0ead2aae1e8e0712c6').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known pubkeyhashin (hybrid pubkey version w/07)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 65 0x07e365859b3c78a8b7c202412b949ebca58e147dba297be29eee53cd3e1d300a6419bc780cc9aec0dc94ed194e91c8f6433f1b781ee00eac0ead2aae1e8e0712c6').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known pubkeyhashin (compressed pubkey w/ 0x02)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 21 0x02aec6b86621e7fef63747fbfd6a6e7d54c8e1052044ef2dd2c5e46656ef1194d4').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known pubkeyhashin (compressed pubkey w/ 0x03)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 21 0x03e724d93c4fda5f1236c525de7ffac6c5f1f72b0f5cdd1fc4b4f5642b6d055fcc').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known non-pubkeyhashin (bad ops length)', () => {
      Script('73 0x3046022100bb3c194a30e460d81d34be0a230179c043a656f67e3c5c8bf47eceae7c4042ee0221008bf54ca11b2985285be0fd7a212873d243e6e73f5fad57e8eb14c4f39728b8c601 65 0x04e365859b3c78a8b7c202412b949ebca58e147dba297be29eee53cd3e1d300a6419bc780cc9aec0dc94ed194e91c8f6433f1b781ee00eac0ead2aae1e8e0712c6 OP_CHECKSIG').isPublicKeyHashIn().should.equal(false);
    });

    it('should identify this known pubkey', () => {
      Script('70 0x3043021f336721e4343f67c835cbfd465477db09073dc38a936f9c445d573c1c8a7fdf022064b0e3cb6892a9ecf870030e3066bc259e1f24841c9471d97f9be08b73f6530701 33 0x0370b2e1dcaa8f51cb0ead1221dd8cb31721502b3b5b7d4b374d263dfec63a4369').isPublicKeyHashIn().should.equal(true);
    });

    it('should identify this known non-pubkeyhashin (bad version)', () => {
      Script('70 0x3043021f336721e4343f67c835cbfd465477db09073dc38a936f9c445d573c1c8a7fdf022064b0e3cb6892a9ecf870030e3066bc259e1f24841c9471d97f9be08b73f6530701 33 0x1270b2e1dcaa8f51cb0ead1221dd8cb31721502b3b5b7d4b374d263dfec63a4369').isPublicKeyHashIn().should.equal(false);
    });

    it('should identify this known non-pubkeyhashin (bad signature version)', () => {
      Script('70 0x4043021f336721e4343f67c835cbfd465477db09073dc38a936f9c445d573c1c8a7fdf022064b0e3cb6892a9ecf870030e3066bc259e1f24841c9471d97f9be08b73f6530701 33 0x0370b2e1dcaa8f51cb0ead1221dd8cb31721502b3b5b7d4b374d263dfec63a4369').isPublicKeyHashIn().should.equal(false);
    });

    it('should identify this known non-pubkeyhashin (no public key)', () => {
      Script('70 0x3043021f336721e4343f67c835cbfd465477db09073dc38a936f9c445d573c1c8a7fdf022064b0e3cb6892a9ecf870030e3066bc259e1f24841c9471d97f9be08b73f6530701 OP_CHECKSIG').isPublicKeyHashIn().should.equal(false);
    });

    it('should identify this known non-pubkeyhashin (no signature)', () => {
      Script('OP_DROP OP_CHECKSIG').isPublicKeyHashIn().should.equal(false);
    });
  });

  describe('#isPublicKeyHashOut', () => {
    it('should identify this known pubkeyhashout as pubkeyhashout', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG').isPublicKeyHashOut().should.equal(true);
    });

    it('should identify this known non-pubkeyhashout as not pubkeyhashout 1', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000').isPublicKeyHashOut().should.equal(false);
    });

    it('should identify this known non-pubkeyhashout as not pubkeyhashout 2', () => {
      Script('OP_DUP OP_HASH160 2 0x0000 OP_EQUALVERIFY OP_CHECKSIG').isPublicKeyHashOut().should.equal(false);
    });
  });

  describe('#isMultisigOut', () => {
    it('should identify known multisig out 1', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG').isMultisigOut().should.equal(true);
    });
    it('should identify known multisig out 2', () => {
      Script('OP_1 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG').isMultisigOut().should.equal(true);
    });
    it('should identify known multisig out 3', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x03363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640 OP_3 OP_CHECKMULTISIG').isMultisigOut().should.equal(true);
    });

    it('should identify non-multisig out 1', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG OP_EQUAL').isMultisigOut().should.equal(false);
    });
    it('should identify non-multisig out 2', () => {
      Script('OP_2').isMultisigOut().should.equal(false);
    });
  });

  describe('#isMultisigIn', () => {
    it('should identify multisig in 1', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01').isMultisigIn().should.equal(true);
    });
    it('should identify multisig in 2', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01 0x48 0x30450220357011fd3b3ad2b8f2f2d01e05dc6108b51d2a245b4ef40c112d6004596f0475022100a8208c93a39e0c366b983f9a80bfaf89237fcd64ca543568badd2d18ee2e1d7501').isMultisigIn().should.equal(true);
    });
    it('should identify non-multisig in 1', () => {
      Script('0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01').isMultisigIn().should.equal(false);
    });
    it('should identify non-multisig in 2', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01 OP_0').isMultisigIn().should.equal(false);
    });
  });

  describe('#isScriptHashIn', () => {
    it('should identify this known scripthashin', () => {
      const sstr = 'OP_0 73 0x30460221008ca148504190c10eea7f5f9c283c719a37be58c3ad617928011a1bb9570901d2022100ced371a23e86af6f55ff4ce705c57d2721a09c4d192ca39d82c4239825f75a9801 72 0x30450220357011fd3b3ad2b8f2f2d01e05dc6108b51d2a245b4ef40c112d6004596f0475022100a8208c93a39e0c366b983f9a80bfaf89237fcd64ca543568badd2d18ee2e1d7501 OP_PUSHDATA1 105 0x5221024c02dff2f0b8263a562a69ec875b2c95ffad860f428acf2f9e8c6492bd067d362103546324a1351a6b601c623b463e33b6103ca444707d5b278ece1692f1aa7724a42103b1ad3b328429450069cc3f9fa80d537ee66ba1120e93f3f185a5bf686fb51e0a53ae';
      const s = Script(sstr);
      s.toString().should.equal(sstr);
      s.isScriptHashIn().should.equal(true);
    });

    it('should identify this known non-scripthashin', () => {
      Script('20 0000000000000000000000000000000000000000 OP_CHECKSIG').isScriptHashIn().should.equal(false);
    });

    it('should identify this problematic non-scripthashin scripts', () => {
      const s = new Script('71 0x3044022017053dad84aa06213749df50a03330cfd24d6' +
        'b8e7ddbb6de66c03697b78a752a022053bc0faca8b4049fb3944a05fcf7c93b2861' +
        '734d39a89b73108f605f70f5ed3401 33 0x0225386e988b84248dc9c30f784b06e' +
        '02fdec57bbdbd443768eb5744a75ce44a4c');
      const s2 = new Script('OP_RETURN 32 0x19fdb20634911b6459e6086658b3a6ad2dc6576bd6826c73ee86a5f9aec14ed9');
      s.isScriptHashIn().should.equal(false);
      s2.isScriptHashIn().should.equal(false);
    });
    it('identifies this other problematic non-p2sh in', () => {
      const s = Script.fromString('73 0x3046022100dc7a0a812de14acc479d98ae209402cc9b5e0692bc74b9fe0a2f083e2f9964b002210087caf04a711bebe5339fd7554c4f7940dc37be216a3ae082424a5e164faf549401');
      s.isScriptHashIn().should.equal(false);
    });
  });

  describe('#isScripthashOut', () => {
    it('should identify this known p2shout as p2shout', () => {
      Script('OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUAL').isScriptHashOut().should.equal(true);
    });

    it('should identify result of .isScriptHashOut() as p2sh', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG')
        .toScriptHashOut().isScriptHashOut().should.equal(true);
    });

    it('should identify these known non-p2shout as not p2shout', () => {
      Script('OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUAL OP_EQUAL').isScriptHashOut().should.equal(false);
      Script('OP_HASH160 21 0x000000000000000000000000000000000000000000 OP_EQUAL').isScriptHashOut().should.equal(false);
    });
  });

  describe('#isPushOnly', () => {
    it('should know these scripts are or aren\'t push only', () => {
      Script('OP_NOP 1 0x01').isPushOnly().should.equal(false);
      Script('OP_0').isPushOnly().should.equal(true);
      Script('OP_0 OP_RETURN').isPushOnly().should.equal(false);
      Script('OP_PUSHDATA1 5 0x1010101010').isPushOnly().should.equal(true);
      // like pqcoind, we regard OP_RESERVED as being "push only"
      Script('OP_RESERVED').isPushOnly().should.equal(true);
    });
  });

  describe('#classifyInput', () => {
    it('shouldn\'t classify public key hash out', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify public key hash in', () => {
      Script('47 0x3044022077a8d81e656c4a1c1721e68ce35fa0b27f13c342998e75854858c12396a15ffa02206378a8c6959283c008c87a14a9c0ada5cf3934ac5ee29f1fef9cac6969783e9801 21 0x03993c230da7dabb956292851ae755f971c50532efc095a16bee07f83ab9d262df').classifyInput().should.equal(Script.types.PUBKEYHASH_IN);
    });
    it('shouldn\'t classify script hash out', () => {
      Script('OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUAL').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify script hash in', () => {
      Script('OP_0 73 0x30460221008ca148504190c10eea7f5f9c283c719a37be58c3ad617928011a1bb9570901d2022100ced371a23e86af6f55ff4ce705c57d2721a09c4d192ca39d82c4239825f75a9801 72 0x30450220357011fd3b3ad2b8f2f2d01e05dc6108b51d2a245b4ef40c112d6004596f0475022100a8208c93a39e0c366b983f9a80bfaf89237fcd64ca543568badd2d18ee2e1d7501 OP_PUSHDATA1 105 0x5221024c02dff2f0b8263a562a69ec875b2c95ffad860f428acf2f9e8c6492bd067d362103546324a1351a6b601c623b463e33b6103ca444707d5b278ece1692f1aa7724a42103b1ad3b328429450069cc3f9fa80d537ee66ba1120e93f3f185a5bf686fb51e0a53ae').classifyInput().should.equal(Script.types.SCRIPTHASH_IN);
    });
    it('shouldn\'t classify MULTISIG out', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify MULTISIG in', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01').classifyInput().should.equal(Script.types.MULTISIG_IN);
    });
    it('shouldn\'t classify OP_RETURN data out', () => {
      Script('OP_RETURN 1 0x01').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('shouldn\'t classify public key out', () => {
      Script('41 0x0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8 OP_CHECKSIG').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify public key in', () => {
      Script('47 0x3044022007415aa37ce7eaa6146001ac8bdefca0ddcba0e37c5dc08c4ac99392124ebac802207d382307fd53f65778b07b9c63b6e196edeadf0be719130c5db21ff1e700d67501').classifyInput().should.equal(Script.types.PUBKEY_IN);
    });
    it('should classify unknown', () => {
      Script('OP_TRUE OP_FALSE').classifyInput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify scriptHashIn, eventhough it\'s opreturn', () => {
      Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba').classifyInput().should.equal(Script.types.SCRIPTHASH_IN);
    });
  });

  describe('#classifyOutput', () => {
    it('should classify public key hash out', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG').classifyOutput().should.equal(Script.types.PUBKEYHASH_OUT);
    });
    it('shouldn\'t classify public key hash in', () => {
      Script('47 0x3044022077a8d81e656c4a1c1721e68ce35fa0b27f13c342998e75854858c12396a15ffa02206378a8c6959283c008c87a14a9c0ada5cf3934ac5ee29f1fef9cac6969783e9801 21 0x03993c230da7dabb956292851ae755f971c50532efc095a16bee07f83ab9d262df').classifyOutput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify script hash out', () => {
      Script('OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUAL').classifyOutput().should.equal(Script.types.SCRIPTHASH_OUT);
    });
    it('shouldn\'t classify script hash in', () => {
      Script('OP_0 73 0x30460221008ca148504190c10eea7f5f9c283c719a37be58c3ad617928011a1bb9570901d2022100ced371a23e86af6f55ff4ce705c57d2721a09c4d192ca39d82c4239825f75a9801 72 0x30450220357011fd3b3ad2b8f2f2d01e05dc6108b51d2a245b4ef40c112d6004596f0475022100a8208c93a39e0c366b983f9a80bfaf89237fcd64ca543568badd2d18ee2e1d7501 OP_PUSHDATA1 105 0x5221024c02dff2f0b8263a562a69ec875b2c95ffad860f428acf2f9e8c6492bd067d362103546324a1351a6b601c623b463e33b6103ca444707d5b278ece1692f1aa7724a42103b1ad3b328429450069cc3f9fa80d537ee66ba1120e93f3f185a5bf686fb51e0a53ae').classifyOutput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify MULTISIG out', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG').classifyOutput().should.equal(Script.types.MULTISIG_OUT);
    });
    it('shouldn\'t classify MULTISIG in', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01').classifyOutput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify OP_RETURN data out', () => {
      Script('OP_RETURN 1 0x01').classifyOutput().should.equal(Script.types.DATA_OUT);
    });
    it('should classify public key out', () => {
      Script('41 0x0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8 OP_CHECKSIG').classifyOutput().should.equal(Script.types.PUBKEY_OUT);
    });
    it('shouldn\'t classify public key in', () => {
      Script('47 0x3044022007415aa37ce7eaa6146001ac8bdefca0ddcba0e37c5dc08c4ac99392124ebac802207d382307fd53f65778b07b9c63b6e196edeadf0be719130c5db21ff1e700d67501').classifyOutput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify unknown', () => {
      Script('OP_TRUE OP_FALSE').classifyOutput().should.equal(Script.types.UNKNOWN);
    });
    it('should classify opreturn eventhough it also looks like a scriptHashIn', () => {
      Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba').classifyOutput().should.equal(Script.types.DATA_OUT);
    });
  });

  describe('#classify', () => {
    it('should classify public key hash out', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG').classify().should.equal(Script.types.PUBKEYHASH_OUT);
    });
    it('should classify public key hash in', () => {
      Script('47 0x3044022077a8d81e656c4a1c1721e68ce35fa0b27f13c342998e75854858c12396a15ffa02206378a8c6959283c008c87a14a9c0ada5cf3934ac5ee29f1fef9cac6969783e9801 21 0x03993c230da7dabb956292851ae755f971c50532efc095a16bee07f83ab9d262df').classify().should.equal(Script.types.PUBKEYHASH_IN);
    });
    it('should classify script hash out', () => {
      Script('OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUAL').classify().should.equal(Script.types.SCRIPTHASH_OUT);
    });
    it('should classify script hash in', () => {
      Script('OP_0 73 0x30460221008ca148504190c10eea7f5f9c283c719a37be58c3ad617928011a1bb9570901d2022100ced371a23e86af6f55ff4ce705c57d2721a09c4d192ca39d82c4239825f75a9801 72 0x30450220357011fd3b3ad2b8f2f2d01e05dc6108b51d2a245b4ef40c112d6004596f0475022100a8208c93a39e0c366b983f9a80bfaf89237fcd64ca543568badd2d18ee2e1d7501 OP_PUSHDATA1 105 0x5221024c02dff2f0b8263a562a69ec875b2c95ffad860f428acf2f9e8c6492bd067d362103546324a1351a6b601c623b463e33b6103ca444707d5b278ece1692f1aa7724a42103b1ad3b328429450069cc3f9fa80d537ee66ba1120e93f3f185a5bf686fb51e0a53ae').classify().should.equal(Script.types.SCRIPTHASH_IN);
    });
    it('should classify MULTISIG out', () => {
      Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG').classify().should.equal(Script.types.MULTISIG_OUT);
    });
    it('should classify MULTISIG in', () => {
      Script('OP_0 0x47 0x3044022002a27769ee33db258bdf7a3792e7da4143ec4001b551f73e6a190b8d1bde449d02206742c56ccd94a7a2e16ca52fc1ae4a0aa122b0014a867a80de104f9cb18e472c01').classify().should.equal(Script.types.MULTISIG_IN);
    });
    it('should classify OP_RETURN data out', () => {
      Script('OP_RETURN 1 0x01').classify().should.equal(Script.types.DATA_OUT);
    });
    it('should classify public key out', () => {
      Script('41 0x0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8 OP_CHECKSIG').classify().should.equal(Script.types.PUBKEY_OUT);
    });
    it('should classify public key in', () => {
      Script('47 0x3044022007415aa37ce7eaa6146001ac8bdefca0ddcba0e37c5dc08c4ac99392124ebac802207d382307fd53f65778b07b9c63b6e196edeadf0be719130c5db21ff1e700d67501').classify().should.equal(Script.types.PUBKEY_IN);
    });
    it('should classify unknown', () => {
      Script('OP_TRUE OP_FALSE').classify().should.equal(Script.types.UNKNOWN);
    });
    it('should classify opreturn eventhough it also looks like a scriptHashIn', () => {
      Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba').classifyInput().should.equal(Script.types.SCRIPTHASH_IN);
      Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba').classify().should.equal(Script.types.DATA_OUT);
    });
    it('should classify scriptHashIn eventhough it is opreturn when script is marked is input', () => {
      Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba').classify().should.equal(Script.types.DATA_OUT);
      const s = Script('6a1c3630fd3792f7e847ae5e27985dfb127542ef37ac2a5147c3b9cec7ba');
      s._isInput = true; // this is normally set by when Script is initiated as part if Input or Output objects
      s.classify().should.equal(Script.types.SCRIPTHASH_IN);
    });
    it('should classify unknown eventhough it is public key hash when marked as input', () => {
      Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG').classify().should.equal(Script.types.PUBKEYHASH_OUT);
      const s = Script('OP_DUP OP_HASH160 20 0x0000000000000000000000000000000000000000 OP_EQUALVERIFY OP_CHECKSIG');
      s._isInput = true; // this is normally set by when Script is initiated as part if Input or Output objects
      s.classify().should.equal(Script.types.UNKNOWN);
    });
    it('should classify unknown eventhough it is public key hash in when marked as output', () => {
      const s = Script('47 0x3044022077a8d81e656c4a1c1721e68ce35fa0b27f13c342998e75854858c12396a15ffa02206378a8c6959283c008c87a14a9c0ada5cf3934ac5ee29f1fef9cac6969783e9801 21 0x03993c230da7dabb956292851ae755f971c50532efc095a16bee07f83ab9d262df');
      s.classify().should.equal(Script.types.PUBKEYHASH_IN);
      s._isOutput = true; // this is normally set by when Script is initiated as part if Input or Output objects
      s.classify().should.equal(Script.types.UNKNOWN);
    });
  });

  describe('#add and #prepend', () => {
    it('should add these ops', () => {
      Script().add(1).add(10).add(186)
        .toString().should.equal('0x01 0x0a 0xba');
      Script().add(1000).toString().should.equal('0x03e8');
      Script().add('OP_CHECKMULTISIG').toString().should.equal('OP_CHECKMULTISIG');
      Script().add('OP_1').add('OP_2').toString().should.equal('OP_1 OP_2');
      Script().add(Opcode.OP_CHECKMULTISIG).toString().should.equal('OP_CHECKMULTISIG');
      Script().add(Opcode.map.OP_CHECKMULTISIG).toString().should.equal('OP_CHECKMULTISIG');
    });

    it('should prepend these ops', () => {
      Script().prepend('OP_CHECKMULTISIG').toString().should.equal('OP_CHECKMULTISIG');
      Script().prepend('OP_1').prepend('OP_2').toString().should.equal('OP_2 OP_1');
    });

    it('should add and prepend correctly', () => {
      Script().add('OP_1').prepend('OP_2').add('OP_3')
        .prepend('OP_4')
        .toString()
        .should.equal('OP_4 OP_2 OP_1 OP_3');
    });

    it('should add these push data', () => {
      let buf = new Buffer(1);
      buf.fill(0);
      Script().add(buf).toString().should.equal('1 0x00');
      buf = new Buffer(255);
      buf.fill(0);
      Script().add(buf).toString().should.equal(`OP_PUSHDATA1 255 0x${buf.toString('hex')}`);
      buf = new Buffer(256);
      buf.fill(0);
      Script().add(buf).toString().should.equal(`OP_PUSHDATA2 256 0x${buf.toString('hex')}`);
      buf = new Buffer(Math.pow(2, 16));
      buf.fill(0);
      Script().add(buf).toString().should.equal(`OP_PUSHDATA4 ${Math.pow(2, 16)} 0x${buf.toString('hex')}`);
    });

    it('should add both pushdata and non-pushdata chunks', () => {
      Script().add('OP_CHECKMULTISIG').toString().should.equal('OP_CHECKMULTISIG');
      Script().add(Opcode.map.OP_CHECKMULTISIG).toString().should.equal('OP_CHECKMULTISIG');
      const buf = new Buffer(1);
      buf.fill(0);
      Script().add(buf).toString().should.equal('1 0x00');
    });

    it('should work for no data OP_RETURN', () => {
      Script().add(Opcode.OP_RETURN).add(new Buffer('')).toString().should.equal('OP_RETURN');
    });
    it('works with objects', () => {
      Script().add({
        opcodenum: 106
      }).toString().should.equal('OP_RETURN');
    });
    it('works with another script', () => {
      const someScript = Script('OP_2 21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 ' +
        '21 0x038282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508 OP_2 OP_CHECKMULTISIG');
      const s = new Script().add(someScript);
      s.toString()
        .should.equal(someScript.toString());
    });
    it('fails with wrong type', () => {
      const fails = function () {
        return new Script().add(true);
      };
      fails.should.throw('Invalid script chunk');
    });
  });

  describe('#isStandard', () => {
    it('should classify correctly standard script', () => {
      Script('OP_RETURN 1 0x00').isStandard().should.equal(true);
    });
    it('should classify correctly non standard script', () => {
      Script('OP_TRUE OP_FALSE').isStandard().should.equal(false);
    });
  });

  describe('#buildMultisigOut', () => {
    const pubKeyHexes = [
      '044400000001e38ff92912fdacd0a03e9f8e49db95efb5196e8338c26ce8c02706f8f79e391ef08de2ecea8ec14b261526f44dea1d337aba557c2a15c6ebb783220e7f3cbca601030006105b8e3677cfbf7d926ea88f7c20b9e08081973b4e729154eb9eb7c4d1f8cbef099e98248ff9bd21a0bdf6423a1a11188f00432ee4464e2922d4f45b164ba4140232912b90002da8e33b1419d3026568af56ee64dd6bf41e14cfc02cf1f16b6796c2b4ced35e8849d8175307ec9889c4ce3be96db46c7f05222dcc1301e55429156f711df8a5853b95b7f79b902c214acef4aea0031df897f8f3339e954c4062ee215aa68e5d85e75449b2beab4e6a3bdb2e557c1003014bce867e82d2efe27d8bd3f4eb395399ac6150e68f5d87dd09e4b532fdeae92083ed6271d6ed3a8ec4c8a781df7d8b5a4cc6765af0e6e723fba92f49c9d3fa12f02fc74c0c19a6b3fc98542ef00699a92b82867378f0cb3c064f521f13bbd9aa5b93d32f0026a55b2d6edb6ba6dd572819a29d4b73756fa05f87100aa508ae4e30b34207df423bda41e8b383670265aadc4427bfaeb1ce41c460244fd224622596fa778336345942d1121656fb746171da94d2dfc1b731337b16e424aab76f7c1dc0a2b900882ebec14cfdaa6d24eb8e4c98b73c29f8f9e3979024e8f9e152f64982fa98eb0ed6d56c3edfdaa4d490f9f4886a1a45f0d114c98655445ac26c9b358a5b554cd5dbd364917a9bee5cd7587db540eb1e83993873a8467ffcbe4e8fff90e2de39d7e6db211b206ddd32c8b73fa73b7c41370a949b12e1d935f65dced6509f3ef16dbc1368437a06549774771f6b6f5b13574161b7333aa028530d8fb24346e2f6e9719290feaa247a9d19ab8a8e8b1c955db17a5f71176bc50be0bb664d563c48e8a84f4b1c7b6d31317f1fbae43c540bb01c7372d4c2ea02a72d7874078a60e8db81a0e8ef41e417a42c962abec51a3d0e41756ebc80044657ef2edb9e5726bbbad223fe3535d5ae41b178a69388fed162eef631e475abf9dca7544aee52f3d4d30a174d6c49230865d9934e5fe664965fa329a8d409da0a31a17dd89b4fae51ac2c931bb8e42f0a5d1dd328047a28d009c9d83f11bac9c7015c247429f7cc8aa70ce19795dc159b1ef4b4b6743696763305c8daf0fe6afa1b6df6a87fae24c3b1af16ede838fe87e8de82c9286c585d52c0cdba890a455268d9aa967d0ddd80ea9322e3869ec95fe54afe07d46b72273fd5552c63ab6d2d9c2d8aec1c7266ef8e986dc9e951f8eb370a986f83dc383c841b203e5e5d3c2d34f92e45b0edde23802811a62c8b3aa023e2b2381a005210a00c1269ee542e54c5d35bb18d8f8e0b90c6681a040e325c0f0a2335a5295ad830fed56c45fa2f7bfb964316d6bafeea5f8a473f0dd1c066ec8e85e89d9f35477ce22e5574c2d25b3a315a12f56cda52a328408745be77ff527d20426bc958e88261a05e466afdeed8e372b2a4aeb1ebc6db3beb9d334bfc60e3c7a21f34eee1eca349050621dab298b9a41ac47b9287313a20',
      '0444000000019d730da08151aeed8c1a7eac5b699e4ee3245c8e0eef689e9b88bdfaea54ca709322e9e616b2718eaaaa3011c9dd645be7a7aac7b29e6ce67ce04ddefb19e89701030006107b60776d58bded0f587216d4c0a3fc5b54f9cbc856da76effcbc9f92e3ddd8d0f43bf6659020293567ae9f4feb3eab9437fa5ae57a93a90f59ca8ef1e58171fa32a5a67de4ae01df1bfef424631427260e445fafd4799174da82b0974741622f56ac82babd572693308f0671182c283dd04bbdfc263e3550ece3f2445ab2b56d38c273e7ce6784d09cf2989740ead485591e4d677b5addbac9e35b816b315aa9f4fe07b728c38f295252e95d39a6ad13953fadc2f3796c426b71089fab5b131d68d32f42a975abc8b1efca125216fe93f3c8dec226675cdf2fa313a0cfc5dbcf3ce5ca7ff318e6b2dd24b7a1d9b9b725bac7483695c583277994824d105d4284ad7e2960de01cec5ba8b56f0d2a0a2c61a751d7e2b5ae169265e4396830889aff21f158b96a5c89e9a38b954f7925a8352ed2e9a470cdd648b3d6f41ee8f6b5e732cc2c873ac5a1d2b95e9daf4051a99bf6075a937cd6d5f17862243b14616937e1c3d90e5da51d95bfe15583ca83ffafa4b4547e1d303f471f60ef1793f36f34a2a0abf6aec1ecb181725bbc5e0952e4b4fed8704f450c337332fb768f9753b15fff992e0991dc6591f87cf1610c55830fee7dcefde9f9018592109b7ac2e87a3a81ad5045e052b4e66b299d32c0eb1902423840132aa18fbd4eded02cc76cf47870961c8752aae2de036edb9b2a585c2af35a6729ef4b3f1151c056b4bb7d73cfd13fff085132db3e97f7162fb13e7e1695d8d0496796497e531077f4c5b3301f556b31d070f59be16c315abcf782341f7445d771b781f85e4cf5c55ae320ca061f33483b9d7ba4da9350e32ac342e5a8fb953bec3055f20f82de9240a9116c040d4d84d09168400878ffb4bcb383b2e7e32ec3b545f56b371391ee4f8bc3ec0e2fd93824cc0f0add9ae15255e6400fc1638fa9f5a19b2e5019769df3487ea418f2034889e6c43bbb82335f070187174b4665848bc511b0f55ccc39cdda7ad45da6f46fc95ebafdf2888ee592640150ec83a459b12f59e026a4415bbe989fecc5e68713ea1d0c1c133399f26b191d5ab6d27f8e48520087c1788b7445a780b358dba900d79f0147ec2358022fef6c26061b22e4ba964dcd483f7a7e0d6606f39e1a1b8a3654387a4f36f3c796492890f90e7871ab7e84dd3480b6f54d90a0133da4c330852d4615ceedd498275bd074d2b4a519c0f6fa3b9b0a64ce46d6b61c88121087695b57c3aab487a209a6be334f396e314bd575a61bcb685358375ccf219c7447dca25a6e81e152eacd83a67154cea6af58d47a702d9366b09d0b0763cc80f76f0a04edebb88893272a5d54463b8f65c58abd2ed7fa9c4dfe613a43e57611cd6972d852e35cbdca30c81d73d2947078f49ddd2851702f083732a8152946cbdf0a4e67620cdf7fbc1b5acd2710cd5d8996d0ee0a55c3e4e8120d0',
      '0444000000018186f68f5d068f98ff995c49e70b5b78ec18b686f5c9519f9493f2d66034f1d39e1d77172fb4098285595194aa6a36708a56664a60e3f03b5c6db5b6353afa2d01030006106b5a641d2e855100354d4ace22afc958b0e5baa22e01fd68db0f065d9ec7d466e54982a8c4d128abd825922b5fde77eba909f53f125bffafee4921f28a0cffe5e9fef6689c83d9043be96b2a9d5732124e03660cee7069234de15573cb39df5b19d4cc34ef7d2ea4ec9ba5a6b79513b28a6b53925955649e72c9a5373a9fbb218425a558c3ff47b00fd42de5e73efbce16331bfed3affc4b2d3a1e60fa189c430a017860d00c6968e934f88e00a8bb3f083959d5fea6b1d027155c4b83c5b7351b589b87377be6de5e525090497b1be96989802e4f6a96523dd5eb71e48b379ac1d3d8ceaf7e4ec47e9fd4381126f1963071a56a2ada7e0dacf169b67fe0e5558ca803f688e36cc70726715e9318a57bc7b4cbe8eb77aab80125fc4972f0c17608d7a095d7f340b87ac750445005e552d58f7355a5a8c48fee375d4de061f99a2fa6a4b10f17e6e1dbb3f5b92ccb30268f6963ffb7ead12ef1c77355d967fe74b9a3f0c395f96168ed71e63ca518a2411bbe783f12f0376e806fb2a46f0fc4cd7387e8e6b954dca91afb29e0585ea47b60d27a4320db828cf3f830dbf284c154393eb4a589f4932048bbb9d881938cf2ba5db0fd6c80e7964bfb1162b3d47af2cf4334d9e9d01a70e6c0e52af670f15a4ea7c1fac8d0c9fd7dead8dc049e0a8a8e254cf56d31143d2251d2dfb475fb694cfa3f601db40acf1e8eb2d13e03e9a024f232baf879ba0b6284552614fc2d9d391e162b1df08772f680450efffd600fd3d88c7ca08c7755a64c1063df1469a1fbd34984f7d3ecf8991007f3ab04facfad6ea10e950aefd87d5c47ad64053b426791eb2df01619e8b8079d47dee1fafde6b5c6ad82fb2cfe6ed9cf0027d13ece77e468eeed0842a9714669ff87b03341cad4827d251e20566cd0f2f2dcf1feaeed70a91bbee2ef4b1c892b7bc68d4b28d827441390ec2ae346ce097ea3b72bb02cc0a70cb05d9f98a88422c6e6cdebc552c7cc8f48d5e5f5c9a90bfb6d546f7256c7798e793c5335b3f35f2dacc9ad68e33324bc29e4ec2627862a77b093726a1c24abb5499ea2ada96987ee14c6ea00fe3676e0e52776d59db91d3979fcc05021a43e41f9cd1855c74a96205c2e68c9320fbd7a5b2c1f136e15249e5f308fb315a8fa8ff53d71b527db701a948420f6b3098718f5f100a3916466469f165ad5c52ab5897eaa7a163435bc5cf2b0bb2ade3af3861a5915d7e82a4310dbc2e0fbe37fed256d1409e2faae7ea8ef217f290ecce992356a21939c471121c968002c5a293d82f82ef0812f4c94f2e2ecb8201f9bf0a24d5daea3ca8ac173529a0e531c33b37e0a9c6606af930f5f7fefa0f0eed9f00f4c548e8e723264d7c71ce6cf5944951d4a038be5dc49a127b8b22b241041130eccf06a871d1886b6d98c96d1c46077faf8d192388ee2dc28c768',
      '0444000000016514f5c552229bc6e2db4d29bc1bed79936ac5ce4dbfdf807f8f797dd8b5e9573c194f40f17af6d0c7d23586551a90651a4f912ec4bee4145dff37dd3124c1d50103000610db729aa17e50d7fa13d0d1161dafbdd0204eda55bcc16eff65ad506253e10abbf9cb8d2dd3b4cce10d801aba8adf3ff3f8ab5246e76459afbc142b599155312c3e4b897232126f9dda5f4c9662959bb843f1775634a8aa5e7b268360d9a26be32f5af1e59a053e03698a118ba896c10b52ffef7cb9e112eae7b78d5dbdc361a5646e7de532412406546c26cbcd498e15ee86ff85d81148c7d3db364228861459244d22bd74ed33efc547123fcd2dcf318565a6497bfc5909adbba870354f342b8f138234ee0189b1717d1440c77b427478749b92333609e362689214eabc5b9e488a0d2269103a5f69522d4ad4b46509c2b940c3db01c5ea57aedaa2d0e5c01fac618ee0e0b1f83283e0876cd9ce88b63980754e2de2708ccef42686a23a279a5b77e0e5fbd31b605397e09d449935b77f8586331ab3538892db7c4129817298c290f2e15e4dcbc984c3936540ca091ef3a30b0be567d06a00eca73140b870477b6d1da82c28ccf055fa4437a610350b6f185e9f73e9c4094afc753206298d7d8e579dddf52918fdab9aa33f71eceeaa38c5bcef92cdd591dbfa074b5487d5a44929464ecbf285dbee23384a3fcbae55fa29dd31f229b229b811e12e730d3f7e935e8d08be5e74a2ea932523353561bc895bf603e112e430356b47e5ed9c9eb5801046486d25752b7e29a4b004163dc29f85302f389d29c1c0d69112b3979fc70706d05b3b1902771e5606c979382d1312bc7cfaf6847dd27e48874c10ccc9da848fb94d941dfb55f5b2cfeda647b082159dd6abe06c591fbb180993d6b7d4b6a0e75cac1744f266755dcc150001da9fb410525b8be2624b572878741bc48f3906bd31bbb4cf4982303b9486806b306fd491686626a1e4455102b0c35a6b6b04ef0633199cb4043c309b45fed4c674d0c8d0821b83d4a6ff416be232d79514dce778fc4738b9d5d8de9fa36ca5e600d99e190cbe5857e582316a60a8a0ef00695a95a0531352c30d37f166df3cc99e9278ec410f3aad8f9f89572290645b7cf9b55f018e3c9ea221bc75f824e3021be73c9916fcc3e767a6e14a0bc1537aa8666dd78beffc053ab4efb2491be5f9d9e5465d1ca6825d22306f254a4f37fcdb7c0ba542fe26f84f26ce1da2abf286b355c42aecee6d762416a4292091888aa865aaa549d6050d5e89ad31690ee8234f0b25437a24afc9d430b7f43affaaf2e7af20f990a606d7e9e5cee03b96074309a4308c920f0bb3f3ef0f36592eec7ff0aebd4006cc90fe2b1214e64b7b99e68029a50e7222eb335fd09f4bd43651ba77b5dd19c19960b247e2ba84bf7cd9d7686798a7e095ef95dbcc8b566b3b5f0af8e103e1297b162f2f68831fce4c403568cd6e245302fa1ec2b2a5012c01bb1cf790a1054c4b18ef7085dc236494421eb497cf7fb9c2fa92ab7d537b14b03170',
    ];
    const sortkeys = pubKeyHexes.slice(0, 3).map(looper => new PublicKey(looper));
    it('should create sorted script by default', () => {
      const s = Script.buildMultisigOut(sortkeys, 2);
      s.toString().should.equal('OP_2 OP_PUSHDATA2 1097 0x0444000000018186f68f5d068f98ff995c49e70b5b78ec18b686f5c9519f9493f2d66034f1d39e1d77172fb4098285595194aa6a36708a56664a60e3f03b5c6db5b6353afa2d01030006106b5a641d2e855100354d4ace22afc958b0e5baa22e01fd68db0f065d9ec7d466e54982a8c4d128abd825922b5fde77eba909f53f125bffafee4921f28a0cffe5e9fef6689c83d9043be96b2a9d5732124e03660cee7069234de15573cb39df5b19d4cc34ef7d2ea4ec9ba5a6b79513b28a6b53925955649e72c9a5373a9fbb218425a558c3ff47b00fd42de5e73efbce16331bfed3affc4b2d3a1e60fa189c430a017860d00c6968e934f88e00a8bb3f083959d5fea6b1d027155c4b83c5b7351b589b87377be6de5e525090497b1be96989802e4f6a96523dd5eb71e48b379ac1d3d8ceaf7e4ec47e9fd4381126f1963071a56a2ada7e0dacf169b67fe0e5558ca803f688e36cc70726715e9318a57bc7b4cbe8eb77aab80125fc4972f0c17608d7a095d7f340b87ac750445005e552d58f7355a5a8c48fee375d4de061f99a2fa6a4b10f17e6e1dbb3f5b92ccb30268f6963ffb7ead12ef1c77355d967fe74b9a3f0c395f96168ed71e63ca518a2411bbe783f12f0376e806fb2a46f0fc4cd7387e8e6b954dca91afb29e0585ea47b60d27a4320db828cf3f830dbf284c154393eb4a589f4932048bbb9d881938cf2ba5db0fd6c80e7964bfb1162b3d47af2cf4334d9e9d01a70e6c0e52af670f15a4ea7c1fac8d0c9fd7dead8dc049e0a8a8e254cf56d31143d2251d2dfb475fb694cfa3f601db40acf1e8eb2d13e03e9a024f232baf879ba0b6284552614fc2d9d391e162b1df08772f680450efffd600fd3d88c7ca08c7755a64c1063df1469a1fbd34984f7d3ecf8991007f3ab04facfad6ea10e950aefd87d5c47ad64053b426791eb2df01619e8b8079d47dee1fafde6b5c6ad82fb2cfe6ed9cf0027d13ece77e468eeed0842a9714669ff87b03341cad4827d251e20566cd0f2f2dcf1feaeed70a91bbee2ef4b1c892b7bc68d4b28d827441390ec2ae346ce097ea3b72bb02cc0a70cb05d9f98a88422c6e6cdebc552c7cc8f48d5e5f5c9a90bfb6d546f7256c7798e793c5335b3f35f2dacc9ad68e33324bc29e4ec2627862a77b093726a1c24abb5499ea2ada96987ee14c6ea00fe3676e0e52776d59db91d3979fcc05021a43e41f9cd1855c74a96205c2e68c9320fbd7a5b2c1f136e15249e5f308fb315a8fa8ff53d71b527db701a948420f6b3098718f5f100a3916466469f165ad5c52ab5897eaa7a163435bc5cf2b0bb2ade3af3861a5915d7e82a4310dbc2e0fbe37fed256d1409e2faae7ea8ef217f290ecce992356a21939c471121c968002c5a293d82f82ef0812f4c94f2e2ecb8201f9bf0a24d5daea3ca8ac173529a0e531c33b37e0a9c6606af930f5f7fefa0f0eed9f00f4c548e8e723264d7c71ce6cf5944951d4a038be5dc49a127b8b22b241041130eccf06a871d1886b6d98c96d1c46077faf8d192388ee2dc28c768 OP_PUSHDATA2 1097 0x0444000000019d730da08151aeed8c1a7eac5b699e4ee3245c8e0eef689e9b88bdfaea54ca709322e9e616b2718eaaaa3011c9dd645be7a7aac7b29e6ce67ce04ddefb19e89701030006107b60776d58bded0f587216d4c0a3fc5b54f9cbc856da76effcbc9f92e3ddd8d0f43bf6659020293567ae9f4feb3eab9437fa5ae57a93a90f59ca8ef1e58171fa32a5a67de4ae01df1bfef424631427260e445fafd4799174da82b0974741622f56ac82babd572693308f0671182c283dd04bbdfc263e3550ece3f2445ab2b56d38c273e7ce6784d09cf2989740ead485591e4d677b5addbac9e35b816b315aa9f4fe07b728c38f295252e95d39a6ad13953fadc2f3796c426b71089fab5b131d68d32f42a975abc8b1efca125216fe93f3c8dec226675cdf2fa313a0cfc5dbcf3ce5ca7ff318e6b2dd24b7a1d9b9b725bac7483695c583277994824d105d4284ad7e2960de01cec5ba8b56f0d2a0a2c61a751d7e2b5ae169265e4396830889aff21f158b96a5c89e9a38b954f7925a8352ed2e9a470cdd648b3d6f41ee8f6b5e732cc2c873ac5a1d2b95e9daf4051a99bf6075a937cd6d5f17862243b14616937e1c3d90e5da51d95bfe15583ca83ffafa4b4547e1d303f471f60ef1793f36f34a2a0abf6aec1ecb181725bbc5e0952e4b4fed8704f450c337332fb768f9753b15fff992e0991dc6591f87cf1610c55830fee7dcefde9f9018592109b7ac2e87a3a81ad5045e052b4e66b299d32c0eb1902423840132aa18fbd4eded02cc76cf47870961c8752aae2de036edb9b2a585c2af35a6729ef4b3f1151c056b4bb7d73cfd13fff085132db3e97f7162fb13e7e1695d8d0496796497e531077f4c5b3301f556b31d070f59be16c315abcf782341f7445d771b781f85e4cf5c55ae320ca061f33483b9d7ba4da9350e32ac342e5a8fb953bec3055f20f82de9240a9116c040d4d84d09168400878ffb4bcb383b2e7e32ec3b545f56b371391ee4f8bc3ec0e2fd93824cc0f0add9ae15255e6400fc1638fa9f5a19b2e5019769df3487ea418f2034889e6c43bbb82335f070187174b4665848bc511b0f55ccc39cdda7ad45da6f46fc95ebafdf2888ee592640150ec83a459b12f59e026a4415bbe989fecc5e68713ea1d0c1c133399f26b191d5ab6d27f8e48520087c1788b7445a780b358dba900d79f0147ec2358022fef6c26061b22e4ba964dcd483f7a7e0d6606f39e1a1b8a3654387a4f36f3c796492890f90e7871ab7e84dd3480b6f54d90a0133da4c330852d4615ceedd498275bd074d2b4a519c0f6fa3b9b0a64ce46d6b61c88121087695b57c3aab487a209a6be334f396e314bd575a61bcb685358375ccf219c7447dca25a6e81e152eacd83a67154cea6af58d47a702d9366b09d0b0763cc80f76f0a04edebb88893272a5d54463b8f65c58abd2ed7fa9c4dfe613a43e57611cd6972d852e35cbdca30c81d73d2947078f49ddd2851702f083732a8152946cbdf0a4e67620cdf7fbc1b5acd2710cd5d8996d0ee0a55c3e4e8120d0 OP_PUSHDATA2 1097 0x044400000001e38ff92912fdacd0a03e9f8e49db95efb5196e8338c26ce8c02706f8f79e391ef08de2ecea8ec14b261526f44dea1d337aba557c2a15c6ebb783220e7f3cbca601030006105b8e3677cfbf7d926ea88f7c20b9e08081973b4e729154eb9eb7c4d1f8cbef099e98248ff9bd21a0bdf6423a1a11188f00432ee4464e2922d4f45b164ba4140232912b90002da8e33b1419d3026568af56ee64dd6bf41e14cfc02cf1f16b6796c2b4ced35e8849d8175307ec9889c4ce3be96db46c7f05222dcc1301e55429156f711df8a5853b95b7f79b902c214acef4aea0031df897f8f3339e954c4062ee215aa68e5d85e75449b2beab4e6a3bdb2e557c1003014bce867e82d2efe27d8bd3f4eb395399ac6150e68f5d87dd09e4b532fdeae92083ed6271d6ed3a8ec4c8a781df7d8b5a4cc6765af0e6e723fba92f49c9d3fa12f02fc74c0c19a6b3fc98542ef00699a92b82867378f0cb3c064f521f13bbd9aa5b93d32f0026a55b2d6edb6ba6dd572819a29d4b73756fa05f87100aa508ae4e30b34207df423bda41e8b383670265aadc4427bfaeb1ce41c460244fd224622596fa778336345942d1121656fb746171da94d2dfc1b731337b16e424aab76f7c1dc0a2b900882ebec14cfdaa6d24eb8e4c98b73c29f8f9e3979024e8f9e152f64982fa98eb0ed6d56c3edfdaa4d490f9f4886a1a45f0d114c98655445ac26c9b358a5b554cd5dbd364917a9bee5cd7587db540eb1e83993873a8467ffcbe4e8fff90e2de39d7e6db211b206ddd32c8b73fa73b7c41370a949b12e1d935f65dced6509f3ef16dbc1368437a06549774771f6b6f5b13574161b7333aa028530d8fb24346e2f6e9719290feaa247a9d19ab8a8e8b1c955db17a5f71176bc50be0bb664d563c48e8a84f4b1c7b6d31317f1fbae43c540bb01c7372d4c2ea02a72d7874078a60e8db81a0e8ef41e417a42c962abec51a3d0e41756ebc80044657ef2edb9e5726bbbad223fe3535d5ae41b178a69388fed162eef631e475abf9dca7544aee52f3d4d30a174d6c49230865d9934e5fe664965fa329a8d409da0a31a17dd89b4fae51ac2c931bb8e42f0a5d1dd328047a28d009c9d83f11bac9c7015c247429f7cc8aa70ce19795dc159b1ef4b4b6743696763305c8daf0fe6afa1b6df6a87fae24c3b1af16ede838fe87e8de82c9286c585d52c0cdba890a455268d9aa967d0ddd80ea9322e3869ec95fe54afe07d46b72273fd5552c63ab6d2d9c2d8aec1c7266ef8e986dc9e951f8eb370a986f83dc383c841b203e5e5d3c2d34f92e45b0edde23802811a62c8b3aa023e2b2381a005210a00c1269ee542e54c5d35bb18d8f8e0b90c6681a040e325c0f0a2335a5295ad830fed56c45fa2f7bfb964316d6bafeea5f8a473f0dd1c066ec8e85e89d9f35477ce22e5574c2d25b3a315a12f56cda52a328408745be77ff527d20426bc958e88261a05e466afdeed8e372b2a4aeb1ebc6db3beb9d334bfc60e3c7a21f34eee1eca349050621dab298b9a41ac47b9287313a20 OP_3 OP_CHECKMULTISIG');
      s.isMultisigOut().should.equal(true);
    });
    it('should fail when number of required signatures is greater than number of pubkeys', () => {
      expect(sortkeys.length).to.equal(3);
      expect(() => {
        return Script.buildMultisigOut(sortkeys, 4);
      }).to.throw('Number of required signatures must be less than or equal to the number of public keys');
    });
    it('should create unsorted script if specified', () => {
      const s = Script.buildMultisigOut(sortkeys, 2);
      const u = Script.buildMultisigOut(sortkeys, 2, {
        noSorting: true
      });
      s.toString().should.not.equal(u.toString());
      u.toString().should.equal('OP_2 OP_PUSHDATA2 1097 0x044400000001e38ff92912fdacd0a03e9f8e49db95efb5196e8338c26ce8c02706f8f79e391ef08de2ecea8ec14b261526f44dea1d337aba557c2a15c6ebb783220e7f3cbca601030006105b8e3677cfbf7d926ea88f7c20b9e08081973b4e729154eb9eb7c4d1f8cbef099e98248ff9bd21a0bdf6423a1a11188f00432ee4464e2922d4f45b164ba4140232912b90002da8e33b1419d3026568af56ee64dd6bf41e14cfc02cf1f16b6796c2b4ced35e8849d8175307ec9889c4ce3be96db46c7f05222dcc1301e55429156f711df8a5853b95b7f79b902c214acef4aea0031df897f8f3339e954c4062ee215aa68e5d85e75449b2beab4e6a3bdb2e557c1003014bce867e82d2efe27d8bd3f4eb395399ac6150e68f5d87dd09e4b532fdeae92083ed6271d6ed3a8ec4c8a781df7d8b5a4cc6765af0e6e723fba92f49c9d3fa12f02fc74c0c19a6b3fc98542ef00699a92b82867378f0cb3c064f521f13bbd9aa5b93d32f0026a55b2d6edb6ba6dd572819a29d4b73756fa05f87100aa508ae4e30b34207df423bda41e8b383670265aadc4427bfaeb1ce41c460244fd224622596fa778336345942d1121656fb746171da94d2dfc1b731337b16e424aab76f7c1dc0a2b900882ebec14cfdaa6d24eb8e4c98b73c29f8f9e3979024e8f9e152f64982fa98eb0ed6d56c3edfdaa4d490f9f4886a1a45f0d114c98655445ac26c9b358a5b554cd5dbd364917a9bee5cd7587db540eb1e83993873a8467ffcbe4e8fff90e2de39d7e6db211b206ddd32c8b73fa73b7c41370a949b12e1d935f65dced6509f3ef16dbc1368437a06549774771f6b6f5b13574161b7333aa028530d8fb24346e2f6e9719290feaa247a9d19ab8a8e8b1c955db17a5f71176bc50be0bb664d563c48e8a84f4b1c7b6d31317f1fbae43c540bb01c7372d4c2ea02a72d7874078a60e8db81a0e8ef41e417a42c962abec51a3d0e41756ebc80044657ef2edb9e5726bbbad223fe3535d5ae41b178a69388fed162eef631e475abf9dca7544aee52f3d4d30a174d6c49230865d9934e5fe664965fa329a8d409da0a31a17dd89b4fae51ac2c931bb8e42f0a5d1dd328047a28d009c9d83f11bac9c7015c247429f7cc8aa70ce19795dc159b1ef4b4b6743696763305c8daf0fe6afa1b6df6a87fae24c3b1af16ede838fe87e8de82c9286c585d52c0cdba890a455268d9aa967d0ddd80ea9322e3869ec95fe54afe07d46b72273fd5552c63ab6d2d9c2d8aec1c7266ef8e986dc9e951f8eb370a986f83dc383c841b203e5e5d3c2d34f92e45b0edde23802811a62c8b3aa023e2b2381a005210a00c1269ee542e54c5d35bb18d8f8e0b90c6681a040e325c0f0a2335a5295ad830fed56c45fa2f7bfb964316d6bafeea5f8a473f0dd1c066ec8e85e89d9f35477ce22e5574c2d25b3a315a12f56cda52a328408745be77ff527d20426bc958e88261a05e466afdeed8e372b2a4aeb1ebc6db3beb9d334bfc60e3c7a21f34eee1eca349050621dab298b9a41ac47b9287313a20 OP_PUSHDATA2 1097 0x0444000000019d730da08151aeed8c1a7eac5b699e4ee3245c8e0eef689e9b88bdfaea54ca709322e9e616b2718eaaaa3011c9dd645be7a7aac7b29e6ce67ce04ddefb19e89701030006107b60776d58bded0f587216d4c0a3fc5b54f9cbc856da76effcbc9f92e3ddd8d0f43bf6659020293567ae9f4feb3eab9437fa5ae57a93a90f59ca8ef1e58171fa32a5a67de4ae01df1bfef424631427260e445fafd4799174da82b0974741622f56ac82babd572693308f0671182c283dd04bbdfc263e3550ece3f2445ab2b56d38c273e7ce6784d09cf2989740ead485591e4d677b5addbac9e35b816b315aa9f4fe07b728c38f295252e95d39a6ad13953fadc2f3796c426b71089fab5b131d68d32f42a975abc8b1efca125216fe93f3c8dec226675cdf2fa313a0cfc5dbcf3ce5ca7ff318e6b2dd24b7a1d9b9b725bac7483695c583277994824d105d4284ad7e2960de01cec5ba8b56f0d2a0a2c61a751d7e2b5ae169265e4396830889aff21f158b96a5c89e9a38b954f7925a8352ed2e9a470cdd648b3d6f41ee8f6b5e732cc2c873ac5a1d2b95e9daf4051a99bf6075a937cd6d5f17862243b14616937e1c3d90e5da51d95bfe15583ca83ffafa4b4547e1d303f471f60ef1793f36f34a2a0abf6aec1ecb181725bbc5e0952e4b4fed8704f450c337332fb768f9753b15fff992e0991dc6591f87cf1610c55830fee7dcefde9f9018592109b7ac2e87a3a81ad5045e052b4e66b299d32c0eb1902423840132aa18fbd4eded02cc76cf47870961c8752aae2de036edb9b2a585c2af35a6729ef4b3f1151c056b4bb7d73cfd13fff085132db3e97f7162fb13e7e1695d8d0496796497e531077f4c5b3301f556b31d070f59be16c315abcf782341f7445d771b781f85e4cf5c55ae320ca061f33483b9d7ba4da9350e32ac342e5a8fb953bec3055f20f82de9240a9116c040d4d84d09168400878ffb4bcb383b2e7e32ec3b545f56b371391ee4f8bc3ec0e2fd93824cc0f0add9ae15255e6400fc1638fa9f5a19b2e5019769df3487ea418f2034889e6c43bbb82335f070187174b4665848bc511b0f55ccc39cdda7ad45da6f46fc95ebafdf2888ee592640150ec83a459b12f59e026a4415bbe989fecc5e68713ea1d0c1c133399f26b191d5ab6d27f8e48520087c1788b7445a780b358dba900d79f0147ec2358022fef6c26061b22e4ba964dcd483f7a7e0d6606f39e1a1b8a3654387a4f36f3c796492890f90e7871ab7e84dd3480b6f54d90a0133da4c330852d4615ceedd498275bd074d2b4a519c0f6fa3b9b0a64ce46d6b61c88121087695b57c3aab487a209a6be334f396e314bd575a61bcb685358375ccf219c7447dca25a6e81e152eacd83a67154cea6af58d47a702d9366b09d0b0763cc80f76f0a04edebb88893272a5d54463b8f65c58abd2ed7fa9c4dfe613a43e57611cd6972d852e35cbdca30c81d73d2947078f49ddd2851702f083732a8152946cbdf0a4e67620cdf7fbc1b5acd2710cd5d8996d0ee0a55c3e4e8120d0 OP_PUSHDATA2 1097 0x0444000000018186f68f5d068f98ff995c49e70b5b78ec18b686f5c9519f9493f2d66034f1d39e1d77172fb4098285595194aa6a36708a56664a60e3f03b5c6db5b6353afa2d01030006106b5a641d2e855100354d4ace22afc958b0e5baa22e01fd68db0f065d9ec7d466e54982a8c4d128abd825922b5fde77eba909f53f125bffafee4921f28a0cffe5e9fef6689c83d9043be96b2a9d5732124e03660cee7069234de15573cb39df5b19d4cc34ef7d2ea4ec9ba5a6b79513b28a6b53925955649e72c9a5373a9fbb218425a558c3ff47b00fd42de5e73efbce16331bfed3affc4b2d3a1e60fa189c430a017860d00c6968e934f88e00a8bb3f083959d5fea6b1d027155c4b83c5b7351b589b87377be6de5e525090497b1be96989802e4f6a96523dd5eb71e48b379ac1d3d8ceaf7e4ec47e9fd4381126f1963071a56a2ada7e0dacf169b67fe0e5558ca803f688e36cc70726715e9318a57bc7b4cbe8eb77aab80125fc4972f0c17608d7a095d7f340b87ac750445005e552d58f7355a5a8c48fee375d4de061f99a2fa6a4b10f17e6e1dbb3f5b92ccb30268f6963ffb7ead12ef1c77355d967fe74b9a3f0c395f96168ed71e63ca518a2411bbe783f12f0376e806fb2a46f0fc4cd7387e8e6b954dca91afb29e0585ea47b60d27a4320db828cf3f830dbf284c154393eb4a589f4932048bbb9d881938cf2ba5db0fd6c80e7964bfb1162b3d47af2cf4334d9e9d01a70e6c0e52af670f15a4ea7c1fac8d0c9fd7dead8dc049e0a8a8e254cf56d31143d2251d2dfb475fb694cfa3f601db40acf1e8eb2d13e03e9a024f232baf879ba0b6284552614fc2d9d391e162b1df08772f680450efffd600fd3d88c7ca08c7755a64c1063df1469a1fbd34984f7d3ecf8991007f3ab04facfad6ea10e950aefd87d5c47ad64053b426791eb2df01619e8b8079d47dee1fafde6b5c6ad82fb2cfe6ed9cf0027d13ece77e468eeed0842a9714669ff87b03341cad4827d251e20566cd0f2f2dcf1feaeed70a91bbee2ef4b1c892b7bc68d4b28d827441390ec2ae346ce097ea3b72bb02cc0a70cb05d9f98a88422c6e6cdebc552c7cc8f48d5e5f5c9a90bfb6d546f7256c7798e793c5335b3f35f2dacc9ad68e33324bc29e4ec2627862a77b093726a1c24abb5499ea2ada96987ee14c6ea00fe3676e0e52776d59db91d3979fcc05021a43e41f9cd1855c74a96205c2e68c9320fbd7a5b2c1f136e15249e5f308fb315a8fa8ff53d71b527db701a948420f6b3098718f5f100a3916466469f165ad5c52ab5897eaa7a163435bc5cf2b0bb2ade3af3861a5915d7e82a4310dbc2e0fbe37fed256d1409e2faae7ea8ef217f290ecce992356a21939c471121c968002c5a293d82f82ef0812f4c94f2e2ecb8201f9bf0a24d5daea3ca8ac173529a0e531c33b37e0a9c6606af930f5f7fefa0f0eed9f00f4c548e8e723264d7c71ce6cf5944951d4a038be5dc49a127b8b22b241041130eccf06a871d1886b6d98c96d1c46077faf8d192388ee2dc28c768 OP_3 OP_CHECKMULTISIG');
      s.isMultisigOut().should.equal(true);
    });
    const test_mn = function (m, n) {
      const pubkeys = pubKeyHexes.slice(0, n).map(looper => new PublicKey(looper));
      const s = Script.buildMultisigOut(pubkeys, m);
      s.isMultisigOut().should.equal(true);
    };
    for (let n = 1; n < 5; n++) {
      for (let m = 1; m <= n; m++) {
        it(`should create ${m}-of-${n}`, test_mn.bind(null, m, n));
      }
    }
  });
  describe('#buildPublicKeyHashOut', () => {
    it('should create script from livenet address', () => {
      const address = Address.fromString('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
      const s = Script.buildPublicKeyHashOut(address);
      should.exist(s);
      s.toString().should.equal('OP_DUP OP_HASH160 20 0xdce0c5e6f4816997eab327c099755db4ced49f9f OP_EQUALVERIFY OP_CHECKSIG');
      s.isPublicKeyHashOut().should.equal(true);
      s.toAddress().toString().should.equal('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
    });
    it('should create script from testnet address', () => {
      const address = Address.fromString('LMedLCb4ogwHjENTdXv3Z66iXyBUNXdAJ9');
      const s = Script.buildPublicKeyHashOut(address);
      should.exist(s);
      s.toString().should.equal('OP_DUP OP_HASH160 20 0x1a9ad8fc6f4677ae6aa84f7f2dd34b28c0b2b04f OP_EQUALVERIFY OP_CHECKSIG');
      s.isPublicKeyHashOut().should.equal(true);
      s.toAddress().toString().should.equal('LMedLCb4ogwHjENTdXv3Z66iXyBUNXdAJ9');
    });
    it('should create script from public key', () => {
      const pubkey = new PublicKey('0482040803820404000103000610e4a03db09d7b64efe102ffd77118dbdea2355ab7e9f38891d82c10741c30c480df20b25897b23258eb6b7b58c3f6aa7d8c3aa0b20881dbf3da84522b34106cc4d75a520ec0382aea2a350bf8af64464c67c4c1ed8ca5a378d196fc7635ddc949dfa0b0a577385ae6f0bc5650ee091aac3ef609b1d32c2a2702a0aecaebdb3e83b93a551216b4fdf602b32acdbc032bbf739825451b4eff00d066ef49d0441f7b7578a9926334ec66ceef2cbe0263c5f4704c2cc4e5d13f0680abbfc5b447ef4c013f7fd943589d298bacedfc0631a3a41e9989e3976a3420a4452433a3bec9d22dcae8d288eaa24bf15bd5a64c390c400d5e6b54f1c9ecff46c19e2cb47856ac1401e78a81a2215531a2b8623cd371d92973f069e7df9ffe0dd446878e32681f448a07a3d036827346f41c011b70551c4038c736d9e36eea6d0598fad0c559dda3f9959e7afc9397bd426169f785b26cf54a0d556c01e7ec1c540a1aaeda341201cc964140b475e37e572213dcd2ab9e679a987810df160cc1399081f9c1aa2ff79c987d5d657363cf3850132290fe34500d96f25917daffed2528ebedafb25511105360a7a4956e5216cbf207d7df60ce062d72e3692b995c0fcd1059e06c213dd729ba76d92c6f00aa8b4c7992f48015f6d8f85faed8d0ac4ce88ea02d79671ab8bd3a99a1744a0a474b0e625f4a4a67aeeacffce1594e462afbf4b47c99c6daa3c68bd4052f729f0b071f643ba602cc414db0b6c84a0d63c67ecd93ecbe20bfa57e99159284fbc541a197c6113e43ebc1b4a64dbbcaee9d02231d138e4cffad7c42fd982d1c3ab9465cec82da54ea46f541a2e13d6fd08ac9a96d9cebc8ab61c44646d05a8f0d0351bdc62c9f832d7f49c23d82d15279948df20be509fcaaa90dc21e3403e7b66e06da2547b1f4b5bcca2e8b8fcfe5d82aa67324f6caef22cb059ba6cf92955b34010b6837b0fc88c18b615062995af9decff3cf2cec5f2240b89ddbcdcfc6245bb8619ec0400e0cf22edb4139cf0232445ae42b7542df7baf2c32ae1e3e7b5bb03e015b58cf53605882f0141a6afe6ed84e8a94f3ddf504ffdf787a4a560c18a5f9d2245aa0afbb261d41b2f2feab32ca8e3de8b667606931f20d7703529fb51e0ed74ba602f3869f60fd4574a4c0b5fa0c881453096f53e651d77afa433cfb09338ce0dbd9ca8e9975666ba4cf65365908704ae84d4f0a2b61fde73b8101c6f60cc237ce36710a886e71d7b79c6dcf4115696acd0c45022e64be53c6d5cfb07dfb8641281a06d5796b02105739ecc06e45083b72ad6e71d7bb0e065797b9a7b5ac5473fd2d2fb5a2eedfc58f73f2333d1128c8df1f4f31a43ef9f755056f9352e5fb1671e478ab0035ce94aabec60b845cf488d237bb71689d26adbd79afb85f5b85cad50cd81b88d421c03ef6a42878105202e688');
      const s = Script.buildPublicKeyHashOut(pubkey);
      should.exist(s);
      s.toString().should.equal('OP_DUP OP_HASH160 20 0xa6add4efa8868dff54b6703ad42dc8f3587b1785 OP_EQUALVERIFY OP_CHECKSIG');
      s.isPublicKeyHashOut().should.equal(true);
      should.exist(s._network);
      s._network.should.equal(pubkey.network);
    });
  });
  describe('#buildPublicKeyOut', () => {
    it('should create script from public key', () => {
      const pubkey = new PublicKey('0482040803820404000103000610e4a03db09d7b64efe102ffd77118dbdea2355ab7e9f38891d82c10741c30c480df20b25897b23258eb6b7b58c3f6aa7d8c3aa0b20881dbf3da84522b34106cc4d75a520ec0382aea2a350bf8af64464c67c4c1ed8ca5a378d196fc7635ddc949dfa0b0a577385ae6f0bc5650ee091aac3ef609b1d32c2a2702a0aecaebdb3e83b93a551216b4fdf602b32acdbc032bbf739825451b4eff00d066ef49d0441f7b7578a9926334ec66ceef2cbe0263c5f4704c2cc4e5d13f0680abbfc5b447ef4c013f7fd943589d298bacedfc0631a3a41e9989e3976a3420a4452433a3bec9d22dcae8d288eaa24bf15bd5a64c390c400d5e6b54f1c9ecff46c19e2cb47856ac1401e78a81a2215531a2b8623cd371d92973f069e7df9ffe0dd446878e32681f448a07a3d036827346f41c011b70551c4038c736d9e36eea6d0598fad0c559dda3f9959e7afc9397bd426169f785b26cf54a0d556c01e7ec1c540a1aaeda341201cc964140b475e37e572213dcd2ab9e679a987810df160cc1399081f9c1aa2ff79c987d5d657363cf3850132290fe34500d96f25917daffed2528ebedafb25511105360a7a4956e5216cbf207d7df60ce062d72e3692b995c0fcd1059e06c213dd729ba76d92c6f00aa8b4c7992f48015f6d8f85faed8d0ac4ce88ea02d79671ab8bd3a99a1744a0a474b0e625f4a4a67aeeacffce1594e462afbf4b47c99c6daa3c68bd4052f729f0b071f643ba602cc414db0b6c84a0d63c67ecd93ecbe20bfa57e99159284fbc541a197c6113e43ebc1b4a64dbbcaee9d02231d138e4cffad7c42fd982d1c3ab9465cec82da54ea46f541a2e13d6fd08ac9a96d9cebc8ab61c44646d05a8f0d0351bdc62c9f832d7f49c23d82d15279948df20be509fcaaa90dc21e3403e7b66e06da2547b1f4b5bcca2e8b8fcfe5d82aa67324f6caef22cb059ba6cf92955b34010b6837b0fc88c18b615062995af9decff3cf2cec5f2240b89ddbcdcfc6245bb8619ec0400e0cf22edb4139cf0232445ae42b7542df7baf2c32ae1e3e7b5bb03e015b58cf53605882f0141a6afe6ed84e8a94f3ddf504ffdf787a4a560c18a5f9d2245aa0afbb261d41b2f2feab32ca8e3de8b667606931f20d7703529fb51e0ed74ba602f3869f60fd4574a4c0b5fa0c881453096f53e651d77afa433cfb09338ce0dbd9ca8e9975666ba4cf65365908704ae84d4f0a2b61fde73b8101c6f60cc237ce36710a886e71d7b79c6dcf4115696acd0c45022e64be53c6d5cfb07dfb8641281a06d5796b02105739ecc06e45083b72ad6e71d7bb0e065797b9a7b5ac5473fd2d2fb5a2eedfc58f73f2333d1128c8df1f4f31a43ef9f755056f9352e5fb1671e478ab0035ce94aabec60b845cf488d237bb71689d26adbd79afb85f5b85cad50cd81b88d421c03ef6a42878105202e688');
      const s = Script.buildPublicKeyOut(pubkey);
      should.exist(s);
      s.toString().should.equal('OP_PUSHDATA2 1036 0x0482040803820404000103000610e4a03db09d7b64efe102ffd77118dbdea2355ab7e9f38891d82c10741c30c480df20b25897b23258eb6b7b58c3f6aa7d8c3aa0b20881dbf3da84522b34106cc4d75a520ec0382aea2a350bf8af64464c67c4c1ed8ca5a378d196fc7635ddc949dfa0b0a577385ae6f0bc5650ee091aac3ef609b1d32c2a2702a0aecaebdb3e83b93a551216b4fdf602b32acdbc032bbf739825451b4eff00d066ef49d0441f7b7578a9926334ec66ceef2cbe0263c5f4704c2cc4e5d13f0680abbfc5b447ef4c013f7fd943589d298bacedfc0631a3a41e9989e3976a3420a4452433a3bec9d22dcae8d288eaa24bf15bd5a64c390c400d5e6b54f1c9ecff46c19e2cb47856ac1401e78a81a2215531a2b8623cd371d92973f069e7df9ffe0dd446878e32681f448a07a3d036827346f41c011b70551c4038c736d9e36eea6d0598fad0c559dda3f9959e7afc9397bd426169f785b26cf54a0d556c01e7ec1c540a1aaeda341201cc964140b475e37e572213dcd2ab9e679a987810df160cc1399081f9c1aa2ff79c987d5d657363cf3850132290fe34500d96f25917daffed2528ebedafb25511105360a7a4956e5216cbf207d7df60ce062d72e3692b995c0fcd1059e06c213dd729ba76d92c6f00aa8b4c7992f48015f6d8f85faed8d0ac4ce88ea02d79671ab8bd3a99a1744a0a474b0e625f4a4a67aeeacffce1594e462afbf4b47c99c6daa3c68bd4052f729f0b071f643ba602cc414db0b6c84a0d63c67ecd93ecbe20bfa57e99159284fbc541a197c6113e43ebc1b4a64dbbcaee9d02231d138e4cffad7c42fd982d1c3ab9465cec82da54ea46f541a2e13d6fd08ac9a96d9cebc8ab61c44646d05a8f0d0351bdc62c9f832d7f49c23d82d15279948df20be509fcaaa90dc21e3403e7b66e06da2547b1f4b5bcca2e8b8fcfe5d82aa67324f6caef22cb059ba6cf92955b34010b6837b0fc88c18b615062995af9decff3cf2cec5f2240b89ddbcdcfc6245bb8619ec0400e0cf22edb4139cf0232445ae42b7542df7baf2c32ae1e3e7b5bb03e015b58cf53605882f0141a6afe6ed84e8a94f3ddf504ffdf787a4a560c18a5f9d2245aa0afbb261d41b2f2feab32ca8e3de8b667606931f20d7703529fb51e0ed74ba602f3869f60fd4574a4c0b5fa0c881453096f53e651d77afa433cfb09338ce0dbd9ca8e9975666ba4cf65365908704ae84d4f0a2b61fde73b8101c6f60cc237ce36710a886e71d7b79c6dcf4115696acd0c45022e64be53c6d5cfb07dfb8641281a06d5796b02105739ecc06e45083b72ad6e71d7bb0e065797b9a7b5ac5473fd2d2fb5a2eedfc58f73f2333d1128c8df1f4f31a43ef9f755056f9352e5fb1671e478ab0035ce94aabec60b845cf488d237bb71689d26adbd79afb85f5b85cad50cd81b88d421c03ef6a42878105202e688 OP_CHECKSIG');
      s.isPublicKeyOut().should.equal(true);
    });
  });
  describe('#buildDataOut', () => {
    it('should create script from no data', () => {
      const s = Script.buildDataOut();
      should.exist(s);
      s.toString().should.equal('OP_RETURN');
      s.isDataOut().should.equal(true);
    });
    it('should create script from empty data', () => {
      const data = new Buffer('');
      const s = Script.buildDataOut(data);
      should.exist(s);
      s.toString().should.equal('OP_RETURN');
      s.isDataOut().should.equal(true);
    });
    it('should create script from some data', () => {
      const data = new Buffer('bacacafe0102030405', 'hex');
      const s = Script.buildDataOut(data);
      should.exist(s);
      s.toString().should.equal('OP_RETURN 9 0xbacacafe0102030405');
      s.isDataOut().should.equal(true);
    });
    it('should create script from string', () => {
      const data = 'hello world!!!';
      const s = Script.buildDataOut(data);
      should.exist(s);
      s.toString().should.equal('OP_RETURN 14 0x68656c6c6f20776f726c64212121');
      s.isDataOut().should.equal(true);
    });
    it('should create script from a hex string', () => {
      const hexString = 'abcdef0123456789';
      const s = Script.buildDataOut(hexString, 'hex');
      should.exist(s);
      s.toString().should.equal('OP_RETURN 8 0xabcdef0123456789');
      s.isDataOut().should.equal(true);
    });
  });
  describe('#buildScriptHashOut', () => {
    it('should create script from another script', () => {
      const inner = new Script('OP_DUP OP_HASH160 20 0x06c06f6d931d7bfba2b5bd5ad0d19a8f257af3e3 OP_EQUALVERIFY OP_CHECKSIG');
      const s = Script.buildScriptHashOut(inner);
      should.exist(s);
      s.toString().should.equal('OP_HASH160 20 0x45ea3f9133e7b1cef30ba606f8433f993e41e159 OP_EQUAL');
      s.isScriptHashOut().should.equal(true);
    });

    it('inherits network property from other script', () => {
      const s1 = new Script.fromAddress(new Address('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC'));
      const s2 = Script.buildScriptHashOut(s1);
      should.exist(s1._network);
      s1._network.should.equal(s2._network);
    });

    it('inherits network property form an address', () => {
      const address = new Address('MU34A8zNBEgJhweh92pj1ByedFTTN8AuAa');
      const script = Script.buildScriptHashOut(address);
      should.exist(script._network);
      script._network.should.equal(address.network);
    });
  });
  describe('#toScriptHashOut', () => {
    it('should create script from another script', () => {
      const s = new Script('OP_DUP OP_HASH160 20 0x06c06f6d931d7bfba2b5bd5ad0d19a8f257af3e3 OP_EQUALVERIFY OP_CHECKSIG');
      const sho = s.toScriptHashOut();
      sho.toString().should.equal('OP_HASH160 20 0x45ea3f9133e7b1cef30ba606f8433f993e41e159 OP_EQUAL');
      sho.isScriptHashOut().should.equal(true);
    });
  });

  describe('#removeCodeseparators', () => {
    it('should remove any OP_CODESEPARATORs', () => {
      Script('OP_CODESEPARATOR OP_0 OP_CODESEPARATOR').removeCodeseparators().toString().should.equal('OP_0');
    });
  });


  describe('#findAndDelete', () => {
    it('should find and delete this buffer', () => {
      Script('OP_RETURN 2 0xf0f0')
        .findAndDelete(Script('2 0xf0f0'))
        .toString()
        .should.equal('OP_RETURN');
    });
    it('should do nothing', () => {
      Script('OP_RETURN 2 0xf0f0')
        .findAndDelete(Script('2 0xffff'))
        .toString()
        .should.equal('OP_RETURN 2 0xf0f0');
    });
  });


  describe('#checkMinimalPush', () => {
    it('should check these minimal pushes', () => {
      Script().add(1).checkMinimalPush(0).should.equal(true);
      Script().add(0).checkMinimalPush(0).should.equal(true);
      Script().add(-1).checkMinimalPush(0).should.equal(true);
      Script().add(1000).checkMinimalPush(0).should.equal(true);
      Script().add(0xffffffff).checkMinimalPush(0).should.equal(true);
      Script().add(0xffffffffffffffff).checkMinimalPush(0).should.equal(true);
      Script().add(Buffer.from([0])).checkMinimalPush(0).should.equal(true);

      let buf = new Buffer(75);
      buf.fill(1);
      Script().add(buf).checkMinimalPush(0).should.equal(true);

      buf = new Buffer(76);
      buf.fill(1);
      Script().add(buf).checkMinimalPush(0).should.equal(true);

      buf = new Buffer(256);
      buf.fill(1);
      Script().add(buf).checkMinimalPush(0).should.equal(true);
    });
  });

  describe('getData returns associated data', () => {
    it('works with this testnet transaction', () => {
      // testnet block: 00000000a36400fc06440512354515964bc36ecb0020bd0b0fd48ae201965f54
      // txhash: e362e21ff1d2ef78379d401d89b42ce3e0ce3e245f74b1f4cb624a8baa5d53ad (output 0);
      const script = Script.fromBuffer(new Buffer('6a', 'hex'));
      const dataout = script.isDataOut();
      dataout.should.equal(true);
      const data = script.getData();
      data.should.deep.equal(new Buffer(0));
    });
    it('for a P2PKH address', () => {
      const address = Address.fromString('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
      const script = Script.buildPublicKeyHashOut(address)
      assert.equal(BufferUtil.equal(script.getData(), address.hashBuffer), true)
    });
    it('for a P2SH address', () => {
      // TODO need a P2SH address
      const address = Address.fromString('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
      const script = new Script(address);
      assert.equal(BufferUtil.equal(script.getData(), address.hashBuffer), true);
    });
    it('for a standard opreturn output', () => {
      assert.equal(BufferUtil.equal(Script('OP_RETURN 1 0xFF').getData(), Buffer.from([255])), true);
    });
    it('fails if content is not recognized', () => {
      expect(() => {
        return Script('1 0xFF').getData();
      }).to.throw();
    });
  });

  describe('toAddress', () => {
    const pubkey = new PublicKey('3082040803820404000103000610bb763843d40e19fa54241428324e048c9d90c5a5b10c209ba58ea2b94bca59f287226f54e9dd2db916ab5d41f0d801b1410ebee537ddf1cfa35056f4bca6f1ebfd96034cacc926d233a463788545c919c51d2183c0c2d3b05bbeed91fe82f451697d14f83d92cb3877a861925b21ffac63e228222a43fb6238fd186bb6534f172f383e08c8b77e2d7cdddde019bc9d26f4a8076d6dd0a02ae77f545a2b93a80103dd5686d998b5ed9e6310b88d200574e1a7889f460e5cf6f95026e4dbe4381e3dc567b02b135022e8a98c9d630ce23c09bb1f1f3198566ba0741bfdb2121f9dbd47f5446db748c9f60861df63d9d738d358a1920b4c1c6b7838d9d86aa9e3333bd0507071f95bf34ed693e07b487d33a695ccca53a4503f2ab55ccb29be06226cde1a18a981eca249bbdbdf8349c15924bbea7ef92b232b0573d61701237719b78c4ba06129361e79fd562232aee75d84671ae9c3a6a4e57e2a5e1a9efaf505557704bc9d0d8436efd1041b6584c108016c49bc4dd606eda4b8c9756fb9584ef09a9a2541194dbe628250d464367199fd853819a4a20d8c044db45cc2e1e939bf954bb05d47f5c5246463c21398b31313bf29f4e4d884f1cc5d194b60684edd9eb456009bc8c8188650fda69cd846bb3114a7bdc0fe2ea8df530ee904d923c185118ca0b8fa8042c5c096f09cd7d0d4dec1353ba3e990e4ceba7adddd6677c0aace691dbb1a4281f6240c285c419d48cc23c75e450a1c76c0226f150250e2844a59a12b73cfc122400dea2e9e65543fd59ff64e81ae2c118a4bccd115ac568f3990e6dddce603652016adcbc92bae172f90c160340325337ce41f68492167ec0540ce127b33c645fd61c967173fdb4e3aa71c9d65d93621fbe77f7c5c8847244c4e67e532bf1933500331253e81bafa0ac670d662762c393cf27b1322cc1716ae0b698b46feff946ce6ea6b75f7152bae0f727d601e9a58307e535b34ca02fbeb03d8e97552110be9cf2abc7eb0b818e6a44eaa1614b5bec1ee64d7b4be62f14e9c9b0134ab523d3b90899329d9187a6290e407c42fb85379ead17edc16b29b5970142c97e51ea9ffb1c13ce5ef8151578a76d5fde4abda48a11f5f7163792f0be7425da267bfbf6dc0ea0d6c17e8f2b964ec64a43fe8dbe5343f365c70e31f4f4f5092aa137c24b4b8c0917daf6f539d51829c54a7694410283987bf3487834ef2094f76d5194c60c333e08acaeeb322eff6212f8b4a3d0b5fd656410c36e780c6a28ba489a1f8ed649bc74fb1c46d79e9179ad2257a1ac9cc682773e703c23c8ce3626a547ebb2f1cefa22d99554f05e8ac7c94f1c0843f2988a967e10468a4d9ad4e610ad84f3ca71fc79e8fc6215eed4a03e74646012b5749d21fdc42488455e91452a52136829bc9a2541e0bc479109ad48ec8bb12336dbf7da448');
    const liveAddress = pubkey.toAddress(Networks.livenet);
    const testAddress = pubkey.toAddress(Networks.testnet);

    it('priorize the network argument', () => {
      const script = new Script(liveAddress);
      script.toAddress(Networks.testnet).toString().should.equal(testAddress.toString());
      script.toAddress(Networks.testnet).network.should.equal(Networks.testnet);
    });
    it('use the inherited network', () => {
      let script = new Script(liveAddress);
      script.toAddress().toString().should.equal(liveAddress.toString());
      script = new Script(testAddress);
      script.toAddress().toString().should.equal(testAddress.toString());
    });
    it('uses default network', () => {
      const script = new Script('OP_DUP OP_HASH160 20 ' +
        '0x06c06f6d931d7bfba2b5bd5ad0d19a8f257af3e3 OP_EQUALVERIFY OP_CHECKSIG');
      script.toAddress().network.should.equal(Networks.defaultNetwork);
    });
    it('for a P2PKH address', () => {
      const stringAddress = 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC';
      const address = new Address(stringAddress);
      const script = new Script(address);
      script.toAddress().toString().should.equal(stringAddress);
    });
    it('for a P2SH address', () => {
      // TODO need P2SH address
      const stringAddress = 'LMedLCb4ogwHjENTdXv3Z66iXyBUNXdAJ9';
      const address = new Address(stringAddress);
      const script = new Script(address);
      script.toAddress().toString().should.equal(stringAddress);
    });
    it('fails if content is not recognized', () => {
      Script().toAddress(Networks.livenet).should.equal(false);
    });

    it('works for p2pkh output', () => {
      // taken from tx 7e519caca256423320b92e3e17be5701f87afecbdb3f53af598032bfd8d164f5
      const script = new Script('OP_DUP OP_HASH160 20 ' +
        '0xc8e11b0eb0d2ad5362d894f048908341fa61b6e1 OP_EQUALVERIFY OP_CHECKSIG');
      script.toAddress().toString().should.equal('GcA5E7PYE8ju6MPdhfLoiM9L9SjtPrC4cz');
    });
    it('works for p2pkh input', () => {
      // taken from tx 7e519caca256423320b92e3e17be5701f87afecbdb3f53af598032bfd8d164f5
      const script = new Script('72 0x3045022100eff96230ca0f55b1e8c7a63e014f48611ff1af40875ecd33dee9062d7a6f5e2002206320405b5f6992c756e03e66b21a05a812b60996464ac6af815c2638b930dd7a01 65 0x04150defa035a2c7d826d7d5fc8ab2154bd1bb832f1a5c8ecb338f436362ad232e428b57db44677c5a8bd42c5ed9e2d7e04e742c59bee1b40080cfd57dec64b23a');
      script.toAddress().toString().should.equal('GcA5E7PYE8ju6MPdhfLoiM9L9SjtPrC4cz');
      // taken from tx 7f8f95752a59d715dae9e0008a42e7968d2736741591bbfc6685f6e1649c21ed
      const s2 = new Script('71 0x3044022017053dad84aa06213749df50a03330cfd24d6b8e7ddbb6de66c03697b78a752a022053bc0faca8b4049fb3944a05fcf7c93b2861734d39a89b73108f605f70f5ed3401 33 0x0225386e988b84248dc9c30f784b06e02fdec57bbdbd443768eb5744a75ce44a4c');
      s2.toAddress().toString().should.equal('GQL6GeRDQ5i1ApoAY88gEJHc1YVdEj3pKh');
    });

    it('works for p2sh output', () => {
      // taken from tx fe1f764299dc7f3b5a8fae912050df2b633bf99554c68bf1c456edb9c2b63585
      const script = new Script('OP_HASH160 20 0x99d29051af0c29adcb9040034752bba7dde33e35 OP_EQUAL');
      script.toAddress().toString().should.equal('MMvVs1HrYn8TJmMCVzC4je6f7ongktNnds');
    });
    it('works for p2sh input', () => {
      // taken from tx fe1f764299dc7f3b5a8fae912050df2b633bf99554c68bf1c456edb9c2b63585
      const script = new Script('OP_FALSE 72 0x3045022100e824fbe979fac5834d0062dd5a4e82a898e00ac454bd254cd708ad28530816f202206251ff0fa4dd70c0524c690d4e4deb2bd167297e7bbdf6743b4a8050d681555001 37 0x512102ff3ae0aaa4679ea156d5581dbe6695cc0c311df0aa42af76670d0debbd8f672951ae');
      script.toAddress().toString().should.equal('MNkrvHNAszBMPp3TU4AzLPSSw3ViHHZLZe');
    });

    // no address scripts
    it('works for OP_RETURN script', () => {
      const script = new Script('OP_RETURN 20 0x99d29051af0c29adcb9040034752bba7dde33e35');
      script.toAddress().should.equal(false);
    });
  });
  describe('equals', () => {
    it('returns true for same script', () => {
      Script('OP_TRUE').equals(Script('OP_TRUE')).should.equal(true);
    });
    it('returns false for different chunks sizes', () => {
      Script('OP_TRUE').equals(Script('OP_TRUE OP_TRUE')).should.equal(false);
    });
    it('returns false for different opcodes', () => {
      Script('OP_TRUE OP_TRUE').equals(Script('OP_TRUE OP_FALSE')).should.equal(false);
    });
    it('returns false for different data', () => {
      Script().add(new Buffer('a')).equals(Script('OP_TRUE')).should.equal(false);
    });
    it('returns false for different data', () => {
      Script().add(new Buffer('a')).equals(Script().add(new Buffer('b'))).should.equal(false);
    });
  });

  describe('#getSignatureOperationsCount', () => {
    // comes from pqcoind src/test/sigopcount_tests
    // only test calls to function with boolean param, not signature ref param
    const pubKeyHexes = [
      '3082040803820404000103000610cb6b8aff60be6b06e796b74c99fee72676ab60268d6cc5214e2275edfb4b1a388d18c5d2a60fe9ddd39b271b27c273e6a05cc6471fa10721f2d6ece5a53d5a7890a309c02766cb72d74c93a2979f1ba60eb427a8bd3e1a934d3b0c096c660165f1d3c87807f40248a4201430f13f58ccb21a600a643669d5f8bd5b6c330877d6221cd9e5cb161f325d63a5e30f0102a7dfd3842c9736481ceab8a58f5c3a53b26b3b4d362d1f7b3b71211602d0ba85e220415db2126beda29f30f1e04eb3d6f7d9828c2367b8fd0db0ee2ac934f91433112114b7c099343d6618eee9fc394c4da7aba9a7d24aaedb112af6c0af0be2943dec95e1260a0e1f604fc0dec0420cbb714faaffded994972e4905e2d7f5466b29647ba4aee75eb658b24e8a53831655ea219e1ba7db943e6782f3e9e1e1c393be6d9af5aac585ac48e317554beba55766f21ef22a657682f2eeef8288ef62095ca733548ea1fc6e77f1b5b06a4d49026b66be4db3bf47725262d61e0656fcb9b2e24f2a9174840a82201638f2c070212e5e2b7edaae175e1cd40e4638552ffd1ff3c92939dcc4288552616ca38e117a517f3a6ea0666a25be8293b69e956e6281aa69d4e49fcd3a9d1c27741599a422a4fe9a76ebc01dd36debf166500efb41be3cca17577fb2f025146f36b915edb5a8d457400fbcea424f3ceecf295dbc5c0e32ec4d0d04045a936f3943c2af425ec4dc6e93a80e44e2f03ef4ca0c50453bf8fa0bcc1532e00d07f1cb6a90d1c3a116e311b9a1b10d00f9a1ea489ff8ba7cb8806a28b4e5e8c12bbcf2c76503fb5c9eba6bef8b135dc3f008f20233fe14ef6e2d97908235e4dd089ca3cf4855d8e4cefa9ba7146a5a370cb4c984cfc83f33dbace2b8f8593d7b2d7f55dbfc430d77fa361a99ec26571e4deab6b2227042e6870cd9bc115dc3e205dbeac580b3cd0fb1abf1d8e3492d142b754cab6eac4d741401a8be8791dc086eb719394db6125ec83613e2e04ec281be43c9918d8712173dd78501948a1747d63bf014715ca7ad8118be6f6e3724c47edf2abb168fe8134b05552c41103969c1aeb1a89b7595de38b0de63df13c053e6b83b75e45220a2b5762766b5e3940591dbd21a25bb110ad2796856c960baeef54486afb311a846708fbd57c063a81648a0e72e46e991976ad844ff3a60b09d67f6a7fde2d44f688fdf6e6ef431dad086930c57ebdfbaf065c8705d924ef66352e96f4a5e55e878cbfd2de86c12eda5ea768af72b4f3bfa3cb2caec1fb8a6530646ed8a2e4ce0120c50b00ce4dd7b672ebf5ea4cf9b3c5bd387dd03042e71e5740c48cca995a026ef9517a5178030364f3e9f5a8dcd379e4cbbd2b3277bc2d785576ee36f02535d6d7710d8ff33facd3a18809fd50131292a601bdd1f52a7cb0bccd928a3895b429436bca286f4f31429756d24af48',
      '3082040803820404000103000610136ea636ef3b08e1c870cdbc465fa1d06910d0bef258fa2c9b9188be44728bc653fecd01996d7983ff1b08e7dbef575827a1dfba426bca85ca2ce92be43bbdf129ecd6baaa124d880033e67f2d17b6518d1f2ab2a842d7d0d6afdde1f8154ae55793136dae0e1c4329d22f65c90113d46f039e59ad7ab1fee39017dfcfa682c58cdab25e2c988233714d3c6a4471d80c83ce93fa709711cb2cf3abdee2747bb7c5d3da98aa7116557f772edcf0b54ac28d31fa3fac1f9505233e24cefee93e3620ffed26e3ad783ba4efea6c7a0a60711b7c55b4d6e171b21a05e28afc433115c5ba505564da03303ce6a25d7b086e558241bc2489c7ec1b5de13268ad42245dce4b9bcdf2b1afed1d28abf31d40aebf67cf6a5c9c1d7c51f799bc33282585f8b48207317a647ebdb3d5778f5ef021f8063ddc1eabb122d9a039c248b9eb785947337e610cf88c5af72adf4e06807c01153f10151eb4a413b2d49c59c3e0373fecf33c744d390e389ada0079f4651205cae6272ab1aba2cb9882183b817ab04420fc840c305bda4e119c3784679fbcc1f68091c7237428390752ec1c9f873c9aa860bbfaf471224812d3c4abc86b5d066c578a661303dc1ba00dd45487181a056a19a3c69d43cb43e0b8c8de143099d2350487656d448007d6cb992d5d930ea804b711bfe6d70c4adff2aa8e8f3c68970dfdb90d11d5a05ab612259e2008ea0fe845dad4fcba5788661b3e031e06ff3b1964e67ed8ebdca6f693decfc4333a60411af0fb8dc2fabd2289d42418dcbf991b38a6c17186c9d4b59d84a7cb177dadafbc506baf3fbf37f2145b680da36f4c03a0c46691a170a95cf7a576d43c9f3c327d7f73e6d96d9f3f356b8ce6f1afe092d266c02c06d1621ffbb6f7eaec4ed18a78d8e0cbd8278ee85a3dda155c7512c6c4783bc3767b14c8467d2580645c57c072ed0bda8116d65fdf9113a34e31a44726a4899c3b551b4f6f572c09930411e90c736c301301ecfcb20cfae6a46b87fc63a123ce8957e409e1c66463c5e1d9012c259ff532789d5898227e5c0b7e49868a040327b63975bccda0e23dce1b6427b0a4c087c62b01a2142d5930999415aa56d4541807ba12e025f1178debf7d2891483f344f6d8bd7f1df4a76064f647c9f78761a303d7070e8bb7b1d15a982dd63ba19551b785ad2b8c40095810628b3596d3a94724eb152adeeda876c48f52f7f7aaea92ba9906434525ece707d979444da8672a65dc03d381a46cab202aca9b1694f9caaf019f0e3455da2cf3ba4616acd0613a21ad6c25a7cb7c398cafdafb3eddd3a0290dd39bb9447c4f46e7b81427537ecb50905c676ed6e553bbf6a753207e71f9367d0bff6432e44f33f269ea085d35a90a914e90bb55e7ba05eceb5a7efda8c712f0051df0cd2027928e805e874bb4bba1c0d6b2c0f5eedca8',
      '30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106',
    ];
    it('should return zero for empty scripts', () => {
      Script().getSignatureOperationsCount(false).should.equal(0);
      Script().getSignatureOperationsCount(true).should.equal(0);
    });
    it('should handle multi-sig multisig scripts from string', () => {
      let s1 = 'OP_1 01 FF OP_2 OP_CHECKMULTISIG';
      Script(s1).getSignatureOperationsCount(true).should.equal(2);
      s1 += ' OP_IF OP_CHECKSIG OP_ENDIF';
      Script(s1).getSignatureOperationsCount(true).should.equal(3);
      Script(s1).getSignatureOperationsCount(false).should.equal(21);
    });
    it('should handle multi-sig-out scripts from utility function', () => {
      const sortKeys = pubKeyHexes.slice(0, 3).map(looper => new PublicKey(looper));
      const s2 = Script.buildMultisigOut(sortKeys, 1);
      Script(s2).getSignatureOperationsCount(true).should.equal(3);
      Script(s2).getSignatureOperationsCount(false).should.equal(20);
    });
    it('should handle P2SH-multisig-in scripts from utility', () => {
      // create a well-formed signature, does not need to match pubkeys
      const signature = pqccore.crypto.Signature.fromString('30060201FF0201FF');
      const signatures = [signature.toBuffer()];
      const p2sh = Script.buildP2SHMultisigIn(pubKeyHexes, 1, signatures, {});
      p2sh.getSignatureOperationsCount(true).should.equal(0);
      p2sh.getSignatureOperationsCount(false).should.equal(0);
    });
    it('should default the one and only argument to true', () => {
      const s1 = 'OP_1 01 FF OP_2 OP_CHECKMULTISIG';
      const trueCount = Script(s1).getSignatureOperationsCount(true);
      const falseCount = Script(s1).getSignatureOperationsCount(false);
      const defaultCount = Script(s1).getSignatureOperationsCount();
      trueCount.should.not.equal(falseCount);
      trueCount.should.equal(defaultCount);
    });
  });
});
