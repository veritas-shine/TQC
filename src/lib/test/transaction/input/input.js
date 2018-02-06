const should = require('chai').should();
const expect = require('chai').expect;
const _ = require('lodash');

const pqccore = require('../../..');

const errors = pqccore.errors;
const PrivateKey = pqccore.PrivateKey;
const Address = pqccore.Address;
const Script = pqccore.Script;
const Networks = pqccore.Networks;
const Input = pqccore.Transaction.Input;

describe('Transaction.Input', () => {
  const privateKey = new PrivateKey('2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct');
  const publicKey = privateKey.publicKey;
  const address = new Address(publicKey, Networks.livenet);
  const output = {
    address: 'Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX',
    prevTxId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script(address),
    glv: 1000000
  };
  const coinbase = {
    prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
    outputIndex: 0xFFFFFFFF,
    script: new Script(),
    glv: 1000000
  };

  const coinbaseJSON = JSON.stringify({
    prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
    outputIndex: 4294967295,
    script: ''
  });

  const otherJSON = JSON.stringify({
    txidbuf: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
    txoutnum: 0,
    seqnum: 4294967295,
    script: '71 0x3044022006553276ec5b885ddf5cc1d79e1e3dadbb404b60ad4cc00318e21565' +
      '4f13242102200757c17b36e3d0492fb9cf597032e5afbea67a59274e64af5a05d12e5ea2303901 ' +
      '33 0x0223078d2942df62c45621d209fab84ea9a7a23346201b7727b9b45a29c4e76f5e',
    output: {
      'glv': 100000,
      'script': 'OP_DUP OP_HASH160 20 0x88d9931ea73d60eaf7e5671efc0552b912911f2a ' +
        'OP_EQUALVERIFY OP_CHECKSIG'
    }
  });

  it('has abstract methods: "getSignatures", "isFullySigned", "addSignature", "clearSignatures"', () => {
    const input = new Input(output);
    _.each(['getSignatures', 'isFullySigned', 'addSignature', 'clearSignatures'], (method) => {
      expect(() => {
        return input[method]();
      }).to.throw(errors.AbstractMethodInvoked);
    });
  });
  it('detects coinbase transactions', () => {
    new Input(output).isNull().should.equal(false);
    const ci = new Input(coinbase);
    ci.isNull().should.equal(true);
  });

  describe('instantiation', () => {
    it('works without new', () => {
      const input = Input();
      should.exist(input);
    });
    it('fails with no script info', () => {
      expect(() => {
        const input = new Input({});
        input.toString();
      }).to.throw('Need a script to create an input');
    });
    it('fromObject should work', () => {
      const jsonData = JSON.parse(coinbaseJSON);
      const input = Input.fromObject(jsonData);
      should.exist(input);
      input.prevTxId.toString('hex').should.equal(jsonData.prevTxId);
      input.outputIndex.should.equal(jsonData.outputIndex);
    });
    it('fromObject should work', () => {
      const input = Input.fromObject(JSON.parse(coinbaseJSON));
      const obj = input.toObject();
      Input.fromObject(obj).should.deep.equal(input);
      obj.script = 42;
      Input.fromObject.bind(null, obj).should.throw('Invalid argument type: script');
    });
  });

  it('_estimateSize returns correct size', () => {
    const input = new Input(output);
    input._estimateSize().should.equal(66);
  });
});
