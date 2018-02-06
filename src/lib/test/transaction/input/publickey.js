import Address from '../../../address'

const should = require('chai').should();
const pqccore = require('../../..');
const {Transaction, PrivateKey, Script} = pqccore

describe('PublicKeyInput', () => {
  const utxo = {
    txid: '7f3b688cb224ed83e12d9454145c26ac913687086a0a62f2ae0bc10934a4030f',
    vout: 0,
    address: 'GSn1S1616tfDk3DzaWe5NJvtkPj4DKt7dN',
    scriptPubKey: '76a91461fba7935d468f52ae5545d6e0a308030d20d25688ac',
    amount: 50,
    confirmations: 104,
    spendable: true
  };
  const privateKey = PrivateKey.fromWIF('2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct');
  const address = privateKey.toAddress();
  utxo.address.should.equal(address.toString());

  const destKey = new PrivateKey();
  const fromAddress = new Address('GSn1S1616tfDk3DzaWe5NJvtkPj4DKt7dN')
  const scriptPubkey = Script.buildPublicKeyHashOut(fromAddress)
  console.log(26, scriptPubkey.toHex())

  it('will correctly sign a publickey out transaction', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    tx.sign(privateKey);
    tx.inputs[0].script.toBuffer().length.should.be.above(0);
  });

  it('count can count missing signatures', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    input.isFullySigned().should.equal(false);
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
  });

  it('it\'s size can be estimated', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    input._estimateSize().should.equal(73);
  });

  it('it\'s signature can be removed', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    tx.sign(privateKey);
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });

  it('returns an empty array if private key mismatches', function() {
    this.timeout(20 * 1000)
    const tx = new Transaction();
    tx.from(utxo);
    tx.to(destKey.toAddress(), 10000);
    const input = tx.inputs[0];
    const signatures = input.getSignatures(tx, new PrivateKey(), 0);
    signatures.length.should.equal(0);
  });
});
