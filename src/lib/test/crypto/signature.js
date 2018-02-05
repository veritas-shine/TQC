import assert from 'assert'
const _ = require('lodash')
const should = require('chai').should()
import Signature from '../../crypto/signature'

describe('Signature', () => {
  it('should make a blank signature', () => {
    const sig = new Signature();
    should.exist(sig);
  });

  it('should work with conveniently setting buffer', () => {
    const buffer = Buffer.from([0x30, 1, 2, 3])
    const sig = new Signature({buffer})
    should.exist(sig)
    assert.deepEqual(sig.buffer, buffer.slice(1))
  })

  describe('#set', () => {
    it('should set compressed', () => {
      should.exist(new Signature().set({
        compressed: true
      }))
    })

    it('should set nhashtype', () => {
      const sig = new Signature().set({
        nhashtype: Signature.SIGHASH_ALL
      });
      sig.nhashtype.should.equal(Signature.SIGHASH_ALL);
      sig.set({
        nhashtype: Signature.SIGHASH_ALL | Signature.SIGHASH_ANYONECANPAY
      })
      sig.nhashtype.should.equal(Signature.SIGHASH_ALL | Signature.SIGHASH_ANYONECANPAY);
    })
  })

  describe('#fromCompact', () => {
    it('should create a signature from a compressed signature', () => {
      const blank = new Buffer(32);
      blank.fill(0);
      const compressed = Buffer.concat([
        Buffer.from([0 + 27 + 4]),
        blank,
        blank
      ]);
      const sig = Signature.fromCompact(compressed)
      sig.compressed.should.equal(true)
    });

    it('should create a signature from an uncompressed signature', () => {
      const sigHexaStr = '1cd5e61ab5bfd0d1450997894cb1a53e917f89d82eb43f06fa96f32c96e061aec12fc1188e8b' +
        '0dc553a2588be2b5b68dbbd7f092894aa3397786e9c769c5348dc6';
      const sig = Signature.fromCompact(Buffer.from(sigHexaStr, 'hex'))
      sig.compressed.should.equal(false);
    });
  });

  describe('#fromDER', () => {
    const buf = Buffer.from('3044022075fc517e541bd54769c080b64397e32161c850f6c1b2b67a5c433affbb3e62770220729e85cc46ffab881065ec07694220e71d4df9b2b8c8fd12c3122cf3a5efbcf2', 'hex');

    it('should parse this DER format signature', () => {
      const sig = Signature.fromDER(buf);
      console.log(sig)
    });
  })

  describe('#toTxFormat', () => {
    it('should parse this known signature and rebuild it with updated zero-padded sighash types', () => {
      const original = '30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e7201';
      const buf = Buffer.from(original, 'hex');
      const sig = Signature.fromTxFormat(buf);
      sig.nhashtype.should.equal(Signature.SIGHASH_ALL);
      sig.set({
        nhashtype: Signature.SIGHASH_ALL | Signature.SIGHASH_ANYONECANPAY
      });
      sig.toTxFormat().toString('hex').should.equal(`${original.slice(0, -2)}81`);
      sig.set({
        nhashtype: Signature.SIGHASH_SINGLE
      });
      sig.toTxFormat().toString('hex').should.equal(`${original.slice(0, -2)}03`);
    });
  });

  describe('#fromTxFormat', () => {
    it('should convert from this known tx-format buffer', () => {
      const buf = Buffer.from('30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e7201', 'hex');
      const sig = Signature.fromTxFormat(buf);
      sig.nhashtype.should.equal(Signature.SIGHASH_ALL);
    });

    it('should parse this known signature and rebuild it', () => {
      const hex = '3044022007415aa37ce7eaa6146001ac8bdefca0ddcba0e37c5dc08c4ac99392124ebac802207d382307fd53f65778b07b9c63b6e196edeadf0be719130c5db21ff1e700d67501';
      const buf = Buffer.from(hex, 'hex');
      const sig = Signature.fromTxFormat(buf);
      sig.toTxFormat().toString('hex').should.equal(hex);
    });
  });

  describe('#parseDER', () => {
    it('should parse this 69 byte signature', () => {
      const sighex = '3043021f59e4705959cc78acbfcf8bd0114e9cc1b389a4287fb33152b73a38c319b50302202f7428a27284c757e409bf41506183e9e49dfb54d5063796dfa0d403a4deccfa';
      const sig = Buffer.from(sighex, 'hex');
      const parsed = Signature.parseDER(sig);
      parsed.header.should.equal(0x30);
      assert.deepEqual(parsed.buffer, sig.slice(1))
    });

    it('should parse this 68 byte signature', () => {
      const sighex = '3042021e17cfe77536c3fb0526bd1a72d7a8e0973f463add210be14063c8a9c37632022061bfa677f825ded82ba0863fb0c46ca1388dd3e647f6a93c038168b59d131a51';
      const sig = Buffer.from(sighex, 'hex');
      const parsed = Signature.parseDER(sig);
      parsed.header.should.equal(0x30);
      assert.deepEqual(parsed.buffer, Buffer.from('42021e17cfe77536c3fb0526bd1a72d7a8e0973f463add210be14063c8a9c37632022061bfa677f825ded82ba0863fb0c46ca1388dd3e647f6a93c038168b59d131a51', 'hex'))
    });

    it('should parse this signature from script_valid.json', () => {
      const sighex = '304502203e4516da7253cf068effec6b95c41221c0cf3a8e6ccb8cbf1725b562e9afde2c022100ab1e3da73d67e32045a20e0b999e049978ea8d6ee5480d485fcf2ce0d03b2ef051';
      const sig = Buffer.from(sighex, 'hex');
      const parsed = Signature.parseDER(sig, false);
      should.exist(parsed);
    });
  });

  describe('#toDER', () => {
    it('should convert these known r and s values into a known signature', () => {
      const r = Buffer.from('30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e72', 'hex');
      const sig = new Signature({
        buffer: r
      });
      const der = sig.toDER(r)
      der.toString('hex').should.equal('30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e72');
    });
  });

  describe('#toString', () => {
    it('should convert this signature in to hex DER', () => {
      const buf = Buffer.from('30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e72', 'hex')
      const sig = new Signature({
        buffer: buf
      })
      const hex = sig.toString()
      hex.should.equal('30450221008bab1f0a2ff2f9cb8992173d8ad73c229d31ea8e10b0f4d4ae1a0d8ed76021fa02200993a6ec81755b9111762fc2cf8e3ede73047515622792110867d12654275e72')
    });
  });


  describe('@isTxDER', () => {
    it('should know this is a DER signature', () => {
      const sighex = '3042021e17cfe77536c3fb0526bd1a72d7a8e0973f463add210be14063c8a9c37632022061bfa677f825ded82ba0863fb0c46ca1388dd3e647f6a93c038168b59d131a5101';
      const sigbuf = Buffer.from(sighex, 'hex');
      Signature.isTxDER(sigbuf).should.equal(true);
    });

    it('should know this is not a DER signature', () => {
      // for more extensive tests, see the script interpreter
      const sighex = '3042021e17cfe77536c3fb0526bd1a72d7a8e0973f463add210be14063c8a9c37632022061bfa677f825ded82ba0863fb0c46ca1388dd3e647f6a93c038168b59d131a5101';
      const sigbuf = Buffer.from(sighex, 'hex');
      sigbuf[0] = 0x31;
      Signature.isTxDER(sigbuf).should.equal(false);
    });
  });

  describe('#hasDefinedHashtype', () => {
    it('should reject invalid sighash types and accept valid ones', () => {
      const sig = new Signature();
      sig.hasDefinedHashtype().should.equal(false);
      const testCases = [
        [undefined, false],
        [null, false],
        [0, false],
        [1.1, false],
        [-1, false],
        [-1.1, false],
        ['', false],
        ['1', false],
        [Signature.SIGHASH_ANYONECANPAY, false],
        [Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_ALL, true],
        [Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_NONE, true],
        [Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_SINGLE, true],
        [Signature.SIGHASH_ALL, true],
        [Signature.SIGHASH_NONE, true],
        [Signature.SIGHASH_SINGLE, true],
        [Signature.SIGHASH_SINGLE + 1, false],
        [(Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_SINGLE) + 1, false],
        [(Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_ALL) - 1, false],
      ];
      _.each(testCases, (testCase) => {
        sig.nhashtype = testCase[0];
        sig.hasDefinedHashtype().should.equal(testCase[1]);
      });
    });
  });
});
