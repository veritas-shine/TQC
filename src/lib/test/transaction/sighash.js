const chai = require('chai');

const should = chai.should();
const pqccore = require('../../');

const Script = pqccore.Script;
const Transaction = pqccore.Transaction;
const sighash = Transaction.Sighash

const vectors_sighash = require('../data/sighash.json');

describe('sighash', () => {
  vectors_sighash.forEach((vector, i) => {
    if (i === 0) {
      // First element is just a row describing the next ones
      return;
    }
    it(`test vector from pqcoind #${i} (${vector[4].substring(0, 16)})`, () => {
      const txbuf = Buffer.from(vector[0], 'hex');
      const scriptbuf = Buffer.from(vector[1], 'hex');
      const subscript = Script(scriptbuf);
      const nin = vector[2];
      const nhashtype = vector[3];
      const sighashbuf = Buffer.from(vector[4], 'hex');
      const tx = new Transaction(txbuf);

      // make sure transacion to/from buffer is isomorphic
      tx.uncheckedSerialize().should.equal(txbuf.toString('hex'));

      // sighash ought to be correct
      sighash.sighash(tx, nhashtype, nin, subscript).toString('hex').should.equal(sighashbuf.toString('hex'));
    });
  });
});
