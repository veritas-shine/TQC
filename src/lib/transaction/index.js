module.exports = require('./transaction');
import Signature from './signature';
module.exports.Input = require('./input');
module.exports.Output = require('./output');
module.exports.UnspentOutput = require('./unspentoutput');
module.exports.Signature = Signature;
module.exports.Sighash = require('./sighash');
