const $ = require('../util/preconditions');
const BufferUtil = require('../util/buffer');
const JSUtil = require('../util/js');

export default class Signature {
  constructor(obj) {
    this.set(obj)
  }

  set(obj) {
    if (typeof obj !== 'undefined') {
      if (obj.buffer) {
        this.buffer = obj.buffer.slice(1)
      }
      this.compressed = obj.compressed
      this.nhashtype = obj.nhashtype
    }
    return this
  }

  static fromCompact(buf) {
    $.checkArgument(BufferUtil.isBuffer(buf), 'Argument is expected to be a Buffer');

    const sig = new Signature();

    let compressed = true;
    let i = buf.slice(0, 1)[0] - 27 - 4;
    if (i < 0) {
      compressed = false;
      i += 4;
    }

    $.checkArgument(i === 0 || i === 1 || i === 2 || i === 3, new Error('i must be 0, 1, 2, or 3'));

    sig.compressed = compressed
    sig.buffer = buf
    return sig;
  }

  static fromBuffer(buf, strict) {
    const obj = Signature.parseDER(buf, strict)
    const sig = new Signature()
    sig.header = obj.header
    sig.buffer = obj.buffer
    return sig
  }

  static fromDER = Signature.fromBuffer

  static fromTxFormat(buf) {
    const nhashtype = buf.readUInt8(buf.length - 1)
    const derbuf = buf.slice(0, buf.length - 1)
    const sig = Signature.fromDER(derbuf, false)
    sig.nhashtype = nhashtype
    return sig
  }

  static fromString(str) {
    const buf = Buffer.from(str, 'hex')
    return Signature.fromDER(buf)
  }

  static parseDER(buf) {
    $.checkArgument(BufferUtil.isBuffer(buf), new Error('DER formatted signature should be a buffer'))
    const header = buf[0]
    // $.checkArgument(header === 0x30, new Error('Header byte should be 0x30'));

    const obj = {
      header,
      buffer: buf.slice(1)
    }

    return obj
  }

  toDER() {
    const header = 0x30
    return Buffer.concat([Buffer.from([header]), this.buffer])
  }

  toBuffer = this.toDER

  toString() {
    const buf = this.toDER();
    return buf.toString('hex');
  }


  /**
   * This function is translated from pqcoind's IsDERSignature and is used in
   * the script interpreter.  This "DER" format actually includes an extra byte,
   * the nhashtype, at the end. It is really the tx format, not DER format.
   *
   * A canonical signature exists of: [30] [total len] [02] [len R] [R] [02] [len S] [S] [hashtype]
   * Where R and S are not negative (their first byte has its highest bit not set), and not
   * excessively padded (do not start with a 0 byte, unless an otherwise negative number follows,
   * in which case a single 0 byte is necessary and even required).
   *
   * See https://pqcointalk.org/index.php?topic=8392.msg127623#msg127623
   */
  static isTxDER(buf) {
    if (buf.length < 9) {
      //  Non-canonical signature: too short
      return false;
    }
    if (buf.length > 73) {
      // Non-canonical signature: too long
      return false;
    }
    if (buf[0] !== 0x30) {
      //  Non-canonical signature: wrong type
      return false;
    }
    if (buf[1] !== buf.length - 3) {
      //  Non-canonical signature: wrong length marker
      return false;
    }
    const nLenR = buf[3];
    if (5 + nLenR >= buf.length) {
      //  Non-canonical signature: S length misplaced
      return false;
    }
    const nLenS = buf[5 + nLenR];
    if ((nLenR + nLenS + 7) !== buf.length) {
      //  Non-canonical signature: R+S length mismatch
      return false;
    }

    const R = buf.slice(4);
    if (buf[4 - 2] !== 0x02) {
      //  Non-canonical signature: R value type mismatch
      return false;
    }
    if (nLenR === 0) {
      //  Non-canonical signature: R length is zero
      return false;
    }
    if (R[0] & 0x80) {
      //  Non-canonical signature: R value negative
      return false;
    }
    if (nLenR > 1 && (R[0] === 0x00) && !(R[1] & 0x80)) {
      //  Non-canonical signature: R value excessively padded
      return false;
    }

    const S = buf.slice(6 + nLenR);
    if (buf[6 + nLenR - 2] !== 0x02) {
      //  Non-canonical signature: S value type mismatch
      return false;
    }
    if (nLenS === 0) {
      //  Non-canonical signature: S length is zero
      return false;
    }
    if (S[0] & 0x80) {
      //  Non-canonical signature: S value negative
      return false;
    }
    if (nLenS > 1 && (S[0] === 0x00) && !(S[1] & 0x80)) {
      //  Non-canonical signature: S value excessively padded
      return false;
    }
    return true;
  }


  /**
   * Compares to pqcoind's IsLowDERSignature
   * See also ECDSA signature algorithm which enforces this.
   * See also BIP 62, "low S values in signatures"
   */
  hasLowS() {
    // FIXME
    return true
  }

  /**
   * @returns true if the nhashtype is exactly equal to one of the standard options or combinations thereof.
   * Translated from pqcoind's IsDefinedHashtypeSignature
   */
  hasDefinedHashtype() {
    if (!JSUtil.isNaturalNumber(this.nhashtype)) {
      return false;
    }
    // accept with or without Signature.SIGHASH_ANYONECANPAY by ignoring the bit
    const temp = this.nhashtype & ~Signature.SIGHASH_ANYONECANPAY;
    if (temp < Signature.SIGHASH_ALL || temp > Signature.SIGHASH_SINGLE) {
      return false;
    }
    return true;
  }

  toTxFormat() {
    const derbuf = this.toDER()
    const buf = Buffer.from([this.nhashtype])
    return Buffer.concat([derbuf, buf])
  }

  static SIGHASH_ALL = 0x01
  static SIGHASH_NONE = 0x02
  static SIGHASH_SINGLE = 0x03
  static SIGHASH_ANYONECANPAY = 0x80
}
