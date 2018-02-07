
/* jshint unused: false */

import Hash from '../../../crypto/hash'

const should = require('chai').should();
const expect = require('chai').expect;
const _ = require('lodash');

const bitcore = require('../../..');

const {Transaction, PrivateKey, Address, Script} = bitcore
const {Signature} = bitcore.crypto
const MultiSigScriptHashInput = Transaction.Input.MultiSigScriptHash;

describe('MultiSigScriptHashInput', () => {
  const privateKey1 = new PrivateKey('2ShLGGW7NPNdTJsYKkVxx8Wp5ThyASmpumDKkj5P8iCGia7s3yXY3AnhCQRs9kQeYEoHjGHgmDCLhynE2RZPfQYh8ej1YGK');
  const privateKey2 = new PrivateKey('2SV7QR25RCZAT6GeyhmTAw6Rrm4JSywAUKow9CWnY277c8BeHv7B2UNJPm3sG6zm8cSn2qNozy2yco6nVFMuy1q7ojNdsUB');
  const privateKey3 = new PrivateKey('2SWYiDzgzw1dmDh1SfZXi51kBUD6A1Qzncjf4Fgi1zm4LqxaM9qtRnLULeZjwMc97sfxwAka9j8Kz2d8VSwgFAKuj8AUgmg');
  const public1 = privateKey1.publicKey;
  const public2 = privateKey2.publicKey;
  const public3 = privateKey3.publicKey;
  const address = new Address('B4oLsYX5n4urZfMtkYxMjPgjpzpsg9G9yG');

  const output = {
    address: 'B4oLsYX5n4urZfMtkYxMjPgjpzpsg9G9yG',
    txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script(address),
    glv: 1000000
  };
  const add = Address.createMultisig([public1, public2, public3], 2, 'testnet')
  console.log(36, add.toString())

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
    input._estimateSize().should.equal(257);
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
    const roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('roundtrips to/from object when not signed', function() {
    this.timeout(20 * 1000)
    const transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    const input = transaction.inputs[0];
    const roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
});
