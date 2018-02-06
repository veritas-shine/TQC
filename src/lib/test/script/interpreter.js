
const should = require('chai').should();
const pqccore = require('../..');


const Interpreter = pqccore.Script.Interpreter;
const Transaction = pqccore.Transaction;
const PrivateKey = pqccore.PrivateKey;
const Script = pqccore.Script;
const BN = pqccore.crypto.BN;
const BufferWriter = pqccore.encoding.BufferWriter;
const Opcode = pqccore.Opcode;
const _ = require('lodash');

const script_valid = require('../data/pqcoind/script_valid');
const script_invalid = require('../data/pqcoind/script_invalid');
const tx_valid = require('../data/pqcoind/tx_valid');
const tx_invalid = require('../data/pqcoind/tx_invalid');

// the script string format used in pqcoind data tests
Script.frompqcoindString = function (str) {
  const bw = new BufferWriter();
  const tokens = str.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '') {
      continue;
    }

    var opstr;
    var opcodenum;
    var tbuf;
    if (token[0] === '0' && token[1] === 'x') {
      const hex = token.slice(2);
      bw.write(new Buffer(hex, 'hex'));
    } else if (token[0] === '\'') {
      const tstr = token.slice(1, token.length - 1);
      const cbuf = new Buffer(tstr);
      tbuf = new Script().add(cbuf).toBuffer();
      bw.write(tbuf);
    } else if (typeof Opcode[`OP_${token}`] !== 'undefined') {
      opstr = `OP_${token}`;
      opcodenum = Opcode[opstr];
      bw.writeUInt8(opcodenum);
    } else if (typeof Opcode[token] === 'number') {
      opstr = token;
      opcodenum = Opcode[opstr];
      bw.writeUInt8(opcodenum);
    } else if (!isNaN(parseInt(token))) {
      const script = new Script().add(new BN(token).toScriptNumBuffer());
      tbuf = script.toBuffer();
      bw.write(tbuf);
    } else {
      throw new Error('Could not determine type of script value');
    }
  }
  const buf = bw.concat();
  return this.fromBuffer(buf);
};

console.log(Interpreter)

describe('Interpreter', () => {
  it('should make a new interp', () => {
    const interp = new Interpreter();
    (interp instanceof Interpreter).should.equal(true);
    interp.stack.length.should.equal(0);
    interp.altstack.length.should.equal(0);
    interp.pc.should.equal(0);
    interp.pbegincodehash.should.equal(0);
    interp.nOpCount.should.equal(0);
    interp.vfExec.length.should.equal(0);
    interp.errstr.should.equal('');
    interp.flags.should.equal(0);
  });

  describe('@castToBool', () => {
    it('should cast these bufs to bool correctly', () => {
      Interpreter.castToBool(new BN(0).toSM({
        endian: 'little'
      })).should.equal(false);
      Interpreter.castToBool(new Buffer('0080', 'hex')).should.equal(false); // negative 0
      Interpreter.castToBool(new BN(1).toSM({
        endian: 'little'
      })).should.equal(true);
      Interpreter.castToBool(new BN(-1).toSM({
        endian: 'little'
      })).should.equal(true);

      const buf = new Buffer('00', 'hex');
      const bool = BN.fromSM(buf, {
        endian: 'little'
      }).cmp(BN.Zero) !== 0;
      Interpreter.castToBool(buf).should.equal(bool);
    });
  });

  describe('#verify', () => {
    it('should verify these trivial scripts', () => {
      let verified;
      const si = Interpreter();
      verified = si.verify(Script('OP_1'), Script('OP_1'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('OP_1'), Script('OP_0'));
      verified.should.equal(false);
      verified = Interpreter().verify(Script('OP_0'), Script('OP_1'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('OP_CODESEPARATOR'), Script('OP_1'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script(''), Script('OP_DEPTH OP_0 OP_EQUAL'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('OP_1 OP_2'), Script('OP_2 OP_EQUALVERIFY OP_1 OP_EQUAL'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('9 0x000000000000000010'), Script(''));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('OP_1'), Script('OP_15 OP_ADD OP_16 OP_EQUAL'));
      verified.should.equal(true);
      verified = Interpreter().verify(Script('OP_0'), Script('OP_IF OP_VER OP_ELSE OP_1 OP_ENDIF'));
      verified.should.equal(true);
    });

    it('should verify these simple transaction', () => {
      // first we create a transaction
      const privateKey = new PrivateKey('2SRLnpdFnpiqzeAbJXSBoLeCvG65m7ham4N7ZuFuSgRSAmAVQwKDVrJnui3gY4Ywv7ZFVeW5QuFC4oakVAxetMxGVnvEyct');
      const publicKey = privateKey.publicKey;
      const fromAddress = publicKey.toAddress();
      const toAddress = 'Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX';
      const scriptPubkey = Script.buildPublicKeyHashOut(fromAddress);
      const utxo = {
        address: fromAddress,
        txId: 'a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458',
        outputIndex: 0,
        script: scriptPubkey,
        glv: 100000
      };
      const tx = new Transaction()
        .from(utxo)
        .to(toAddress, 100000)
        .sign(privateKey);

      // we then extract the signature from the first input
      const inputIndex = 0;
      const signature = tx.getSignatures(privateKey)[inputIndex].signature;

      const scriptSig = Script.buildPublicKeyHashIn(publicKey, signature);
      const flags = Interpreter.SCRIPT_VERIFY_P2SH | Interpreter.SCRIPT_VERIFY_STRICTENC;
      const verified = Interpreter().verify(scriptSig, scriptPubkey, tx, inputIndex, flags);
      verified.should.equal(true);
    });
  });


  const getFlags = function getFlags(flagstr) {
    let flags = 0;
    if (flagstr.indexOf('NONE') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_NONE;
    }
    if (flagstr.indexOf('P2SH') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_P2SH;
    }
    if (flagstr.indexOf('STRICTENC') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_STRICTENC;
    }
    if (flagstr.indexOf('DERSIG') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_DERSIG;
    }
    if (flagstr.indexOf('LOW_S') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_LOW_S;
    }
    if (flagstr.indexOf('NULLDUMMY') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_NULLDUMMY;
    }
    if (flagstr.indexOf('SIGPUSHONLY') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_SIGPUSHONLY;
    }
    if (flagstr.indexOf('MINIMALDATA') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_MINIMALDATA;
    }
    if (flagstr.indexOf('DISCOURAGE_UPGRADABLE_NOPS') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_DISCOURAGE_UPGRADABLE_NOPS;
    }
    if (flagstr.indexOf('CHECKLOCKTIMEVERIFY') !== -1) {
      flags |= Interpreter.SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY;
    }
    return flags;
  };


  const testToFromString = function (script) {
    const s = script.toString();
    Script.fromString(s).toString().should.equal(s);
  };

  const testFixture = function (vector, expected) {
    const scriptSig = Script.frompqcoindString(vector[0]);
    const scriptPubkey = Script.frompqcoindString(vector[1]);
    const flags = getFlags(vector[2]);

    const hashbuf = new Buffer(32);
    hashbuf.fill(0);
    const credtx = new Transaction();
    credtx.uncheckedAddInput(new Transaction.Input({
      prevTxId: '0000000000000000000000000000000000000000000000000000000000000000',
      outputIndex: 0xffffffff,
      sequenceNumber: 0xffffffff,
      script: Script('OP_0 OP_0')
    }));
    credtx.addOutput(new Transaction.Output({
      script: scriptPubkey,
      glv: 0
    }));
    const idbuf = credtx.id;

    const spendtx = new Transaction();
    spendtx.uncheckedAddInput(new Transaction.Input({
      prevTxId: idbuf.toString('hex'),
      outputIndex: 0,
      sequenceNumber: 0xffffffff,
      script: scriptSig
    }));
    spendtx.addOutput(new Transaction.Output({
      script: new Script(),
      glv: 0
    }));

    const interp = new Interpreter();
    const verified = interp.verify(scriptSig, scriptPubkey, spendtx, 0, flags);
    verified.should.equal(expected);
  };
  describe('pqcoind script evaluation fixtures', () => {
    const testAllFixtures = function (set, expected) {
      let c = 0;
      set.forEach((vector) => {
        if (vector.length === 1) {
          return;
        }
        c++;
        const descstr = vector[3];
        const fullScriptString = `${vector[0]} ${vector[1]}`;
        const comment = descstr ? (` (${descstr})`) : '';
        it(
          `should pass script_${expected ? '' : 'in'}valid ` +
          `vector #${c}: ${fullScriptString}${comment}`,
          () => {
            testFixture(vector, expected);
          }
        );
      });
    };
    testAllFixtures(script_valid, true);
    testAllFixtures(script_invalid, false);
  });
  describe('pqcoind transaction evaluation fixtures', () => {
    const test_txs = function (set, expected) {
      let c = 0;
      set.forEach((vector) => {
        if (vector.length === 1) {
          return;
        }
        c++;
        const cc = c; // copy to local
        it(`should pass tx_${expected ? '' : 'in'}valid vector ${cc}`, () => {
          const inputs = vector[0];
          const txhex = vector[1];
          const flags = getFlags(vector[2]);

          const map = {};
          inputs.forEach((input) => {
            const txid = input[0];
            let txoutnum = input[1];
            const scriptPubKeyStr = input[2];
            if (txoutnum === -1) {
              txoutnum = 0xffffffff; // pqcoind casts -1 to an unsigned int
            }
            map[`${txid}:${txoutnum}`] = Script.frompqcoindString(scriptPubKeyStr);
          });

          const tx = new Transaction(txhex);
          let allInputsVerified = true;
          tx.inputs.forEach((txin, j) => {
            if (txin.isNull()) {
              return;
            }
            const scriptSig = txin.script;
            const txidhex = txin.prevTxId.toString('hex');
            const txoutnum = txin.outputIndex;
            const scriptPubkey = map[`${txidhex}:${txoutnum}`];
            should.exist(scriptPubkey);
            (scriptSig !== undefined).should.equal(true);
            const interp = new Interpreter();
            const verified = interp.verify(scriptSig, scriptPubkey, tx, j, flags);
            if (!verified) {
              allInputsVerified = false;
            }
          });
          let txVerified = tx.verify();
          txVerified = (txVerified === true);
          allInputsVerified = allInputsVerified && txVerified;
          allInputsVerified.should.equal(expected);
        });
      });
    };
    test_txs(tx_valid, true);
    test_txs(tx_invalid, false);
  });
});
