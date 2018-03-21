import crypto from 'crypto'
import CubeHash from 'cubehash'
import NodeSchedule from 'node-schedule'
import Domain from 'domain'

function _hash(buf) {
  // Bitcoin hash
  // return crypto.createHash('sha256').update(crypto.createHash('sha256').update(buf).digest()).digest()
  //
  return crypto.createHash('sha256').update(CubeHash(256, buf)).digest()
}

/**
 *
 * @param str {String}
 * @return {Buffer}
 */
function reverseString(str) {
  if (str.length < 8) { // Make sure the HEX value from the integers fill 4 bytes when converted to buffer, so that they are reversed correctly
    str = '0'.repeat(8 - str.length) + str;
  }
  return Buffer.from(str, 'hex').reverse().toString('hex')
}

export default class Miner {
  /**
   *
   * @param block {Block}
   */
  constructor(block) {
    // Initialize local variables with Block data
    const prevBlockHash = Buffer.from(block.prev_hash, 'hex');
    const mrklRoot = Buffer.from(block.merkleroot, 'hex');
    const ver = block.version;
    const { time } = block

    // Calculate target based on block's "bits",
    // The "bits" variable is a packed representation of the Difficulty in 8 bytes, to unpack it:
    // First two bytes make the "exponent", and the following 4 bytes make the "mantissa":
    // https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty
    const {bits} = block
    const exponent = bits >>> 24;
    const mantissa = bits & 0xFFFFFF;
    const target = (mantissa * (2 ** (8 * (exponent - 3)))).toString('16');

    // Make target a Buffer object
    this.targetBuffer = Buffer.from('0'.repeat(64 - target.length) + target, 'hex');

    // Create little-endian long int (4 bytes) with the version (2) on the first byte
    this.versionBuffer = Buffer.alloc(4);
    this.versionBuffer.writeInt32LE(ver, 0);

    // Reverse the previous Block Hash and the merkle_root
    this.reversedPrevBlockHash = prevBlockHash.reverse();
    this.reversedMrklRoot = mrklRoot.reverse();

    // Buffer with time (4 Bytes), bits (4 Bytes) and nonce (4 Bytes) (later added and updated on each hash)
    this.timeBitsNonceBuffer = Buffer.alloc(12);
    this.timeBitsNonceBuffer.writeInt32LE(time, 0);
    this.timeBitsNonceBuffer.writeInt32LE(bits, 4)
  }

  getHash(nonce) {
    // Update nonce in header Buffer
    this.timeBitsNonceBuffer.writeInt32LE(nonce, 8);
    // Double sha256 hash the header
    const b = Buffer.concat([this.versionBuffer, this.reversedPrevBlockHash, this.reversedMrklRoot, this.timeBitsNonceBuffer]);
    return _hash(b).reverse();
  }

  verifyNonce(block, checknonce) {
    // This is a (maybe easier) way to build the header from scratch, it should generate the same hash:
    console.log(`\n[Verify Nonce ${checknonce}]`);
    const version = reverseString(block.version.toString(16));
    const prevhash = reverseString(block.prev_hash);
    const merkleroot = reverseString(block.merkleroot);
    const nbits = reverseString(block.bits.toString(16));
    const ntime = reverseString(block.time.toString(16));
    const nonce = reverseString(checknonce.toString(16));

    const header = version + prevhash + merkleroot + ntime + nbits + nonce;
    const hash = reverseString(_hash(Buffer.from(header, 'hex')));

    const isvalid = this.getTarget().toString('hex') > hash;
    const result = isvalid ? 'valid' : 'not a valid';
    console.log('Result: ', `${checknonce} is a ${result} nonce`);
    return isvalid;
  }

  getTarget() {
    return this.targetBuffer;
  }

  /**
   *
   * @param hash {Buffer}
   * @return {boolean}
   */
  checkHash(hash) {
    return Buffer.compare(this.getTarget(), hash) > 0;
  }

  static run(block, nonce = 0) {
    let found = false
    const miner = new Miner(block)
    const t = miner.getTarget()
    console.log('target', t.toString('hex'))
    while (nonce < 0xFFFFFFFF && !found) {
      const hash = miner.getHash(nonce)
      if (nonce % 100000 === 0) {
        console.log(`${nonce} ${hash.toString('hex')}`)
      }
      found = miner.checkHash(hash)
      if (found) {
        console.log(`found: ${nonce} ${hash.toString('hex')}`)
        miner.verifyNonce(block, nonce)
        return nonce
      }
      nonce++;
    }
    return nonce
  }

  static schedule() {
    const d = Domain.create()
    d.run(() => {
      NodeSchedule.scheduleJob('*/1 * * * *', () => {
        console.log('start mining at', new Date())
        const block = {
          version: 1,
          prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
          merkleroot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
          time: 1518511836,
          bits: 0x1d0000ff
        }
        const nonce = Miner.run(block)
        // post block
      })
    })
  }
}
