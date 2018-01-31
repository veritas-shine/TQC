import Base58Check from '../encoding/base58check'
import Address from '../address'
import PublicKey from'../publickey'
import Networks from '../networks'
import Script from '../script/script'
import errors from '../errors'
import chai from'chai'
const should = chai.should()
const expect = chai.expect

describe('Address', function() {

  var pubkeyhash = new Buffer('3082040803820404000103000610cb6b8aff60be6b06e796b74c99fee72676ab60268d6cc5214e2275edfb4b1a388d18c5d2a60fe9ddd39b271b27c273e6a05cc6471fa10721f2d6ece5a53d5a7890a309c02766cb72d74c93a2979f1ba60eb427a8bd3e1a934d3b0c096c660165f1d3c87807f40248a4201430f13f58ccb21a600a643669d5f8bd5b6c330877d6221cd9e5cb161f325d63a5e30f0102a7dfd3842c9736481ceab8a58f5c3a53b26b3b4d362d1f7b3b71211602d0ba85e220415db2126beda29f30f1e04eb3d6f7d9828c2367b8fd0db0ee2ac934f91433112114b7c099343d6618eee9fc394c4da7aba9a7d24aaedb112af6c0af0be2943dec95e1260a0e1f604fc0dec0420cbb714faaffded994972e4905e2d7f5466b29647ba4aee75eb658b24e8a53831655ea219e1ba7db943e6782f3e9e1e1c393be6d9af5aac585ac48e317554beba55766f21ef22a657682f2eeef8288ef62095ca733548ea1fc6e77f1b5b06a4d49026b66be4db3bf47725262d61e0656fcb9b2e24f2a9174840a82201638f2c070212e5e2b7edaae175e1cd40e4638552ffd1ff3c92939dcc4288552616ca38e117a517f3a6ea0666a25be8293b69e956e6281aa69d4e49fcd3a9d1c27741599a422a4fe9a76ebc01dd36debf166500efb41be3cca17577fb2f025146f36b915edb5a8d457400fbcea424f3ceecf295dbc5c0e32ec4d0d04045a936f3943c2af425ec4dc6e93a80e44e2f03ef4ca0c50453bf8fa0bcc1532e00d07f1cb6a90d1c3a116e311b9a1b10d00f9a1ea489ff8ba7cb8806a28b4e5e8c12bbcf2c76503fb5c9eba6bef8b135dc3f008f20233fe14ef6e2d97908235e4dd089ca3cf4855d8e4cefa9ba7146a5a370cb4c984cfc83f33dbace2b8f8593d7b2d7f55dbfc430d77fa361a99ec26571e4deab6b2227042e6870cd9bc115dc3e205dbeac580b3cd0fb1abf1d8e3492d142b754cab6eac4d741401a8be8791dc086eb719394db6125ec83613e2e04ec281be43c9918d8712173dd78501948a1747d63bf014715ca7ad8118be6f6e3724c47edf2abb168fe8134b05552c41103969c1aeb1a89b7595de38b0de63df13c053e6b83b75e45220a2b5762766b5e3940591dbd21a25bb110ad2796856c960baeef54486afb311a846708fbd57c063a81648a0e72e46e991976ad844ff3a60b09d67f6a7fde2d44f688fdf6e6ef431dad086930c57ebdfbaf065c8705d924ef66352e96f4a5e55e878cbfd2de86c12eda5ea768af72b4f3bfa3cb2caec1fb8a6530646ed8a2e4ce0120c50b00ce4dd7b672ebf5ea4cf9b3c5bd387dd03042e71e5740c48cca995a026ef9517a5178030364f3e9f5a8dcd379e4cbbd2b3277bc2d785576ee36f02535d6d7710d8ff33facd3a18809fd50131292a601bdd1f52a7cb0bccd928a3895b429436bca286f4f31429756d24af48', 'hex');
  var buf = Buffer.concat([new Buffer([0x26]), pubkeyhash])
  var str = 'GZzGyuvwB9kq5ZN914SJdjJW2kPqfsDy9W'
  var addressString =  'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC'
  var addressHash = Buffer.from('dce0c5e6f4816997eab327c099755db4ced49f9f', 'hex')
  var addrBuffer = Buffer.concat([new Buffer([0x26]), addressHash])

  it('can\'t build without data', function() {
    (function() {
      return new Address();
    }).should.throw('First argument is required, please include address data.');
  });

  it('should throw an error because of bad network param', function() {
    (function() {
      return new Address(PKHLivenet[0], 'main', 'pubkeyhash');
    }).should.throw('Second argument must be "livenet" or "testnet".');
  });

  it('should throw an error because of bad type param', function() {
    (function() {
      return new Address(PKHLivenet[0], 'livenet', 'pubkey');
    }).should.throw('Third argument must be "pubkeyhash" or "scripthash"');
  });

  // livenet valid
  var PKHLivenet = [
    'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
    'GPgYeos6wX3mEUEUt1gY214yYcj4f4ksrV',
    'GQXk4yFH6Ai9r4tmDkki45kVee42gp649i',
    'GW6G88uB1BPGbeaW1KeBhBT86M9Akachfw',
    '    GW6G88uB1BPGbeaW1KeBhBT86M9Akachfw   \t\n'
  ];

  // livenet p2sh
  var P2SHLivenet = [
    'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
    'GPgYeos6wX3mEUEUt1gY214yYcj4f4ksrV',
    'GQXk4yFH6Ai9r4tmDkki45kVee42gp649i',
    'GW6G88uB1BPGbeaW1KeBhBT86M9Akachfw',
    '\t \nGW6G88uB1BPGbeaW1KeBhBT86M9Akachfw \r'
  ];

  // testnet p2sh
  var P2SHTestnet = [
    'LMedLCb4ogwHjENTdXv3Z66iXyBUNXdAJ9',
    'LezoWDMEc46Hfowcs4LWzHkxpitMZSKLjY',
    'LY87oF7mxcGf1YWC71gMAkWeHNS3Lkkpfw',
    'LPHJVZARa3U3uNxv6A6cebUmHKS9QSMMHJ'
  ];

  //livenet bad checksums
  var badChecksums = [
    '15vkcKf7gB23wLAnZLmbVuMiiVDc3nq4a2',
    '1A6ut1tWnUq1SEQLMr4ttDh24wcbj4w2TT',
    '1BpbpfLdY7oBS9gK7aDXgvMgr1DpvNH3B2',
    '1Jz2yCRd5ST1p2gUqFB5wsSQfdmEJaffg7'
  ];

  //livenet non-base58
  var nonBase58 = [
    '15vkcKf7g#23wLAnZLmb$uMiiVDc3nq4a2',
    '1A601ttWnUq1SEQLMr4ttDh24wcbj4w2TT',
    '1BpbpfLdY7oBS9gK7aIXgvMgr1DpvNH3B2',
    '1Jz2yCRdOST1p2gUqFB5wsSQfdmEJaffg7'
  ];

  //testnet valid
  var PKHTestnet = [
    'Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX',
    'LSqMfCvCHqDFWKp3xnKduMRYjw2Tqdn3JK',
    'LSyQbWDAiWAX8N75zTDHjXsXgVMa44q7q4',
    'LXchYoUj65tkdR66isEcc8KxiFHkKhJFSz'
  ];

  describe('validation', function() {

    it('getValidationError detects network mismatchs', function() {
      var error = Address.getValidationError('37BahqRsFrAd3qLiNNwLNV3AWMRD7itxTo', 'testnet');
      should.exist(error);
    });

    it('isValid returns true on a valid address', function() {
      var valid = Address.isValid('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC', 'livenet');
      valid.should.equal(true);
    });

    it('isValid returns false on network mismatch', function() {
      var valid = Address.isValid('37BahqRsFrAd3qLiNNwLNV3AWMRD7itxTo', 'testnet');
      valid.should.equal(false);
    });

    it('validates correctly the P2PKH test vector', function() {
      for (var i = 0; i < PKHLivenet.length; i++) {
        var error = Address.getValidationError(PKHLivenet[i]);
        should.not.exist(error);
      }
    });

    it('validates correctly the P2SH test vector', function() {
      for (var i = 0; i < P2SHLivenet.length; i++) {
        var error = Address.getValidationError(P2SHLivenet[i]);
        should.not.exist(error);
      }
    });

    it('validates correctly the P2SH testnet test vector', function() {
      for (var i = 0; i < P2SHTestnet.length; i++) {
        var error = Address.getValidationError(P2SHTestnet[i], 'testnet');
        should.not.exist(error);
      }
    });

    it('rejects correctly the P2PKH livenet test vector with "testnet" parameter', function() {
      for (var i = 0; i < PKHLivenet.length; i++) {
        var error = Address.getValidationError(PKHLivenet[i], 'testnet');
        should.exist(error);
      }
    });

    it('validates correctly the P2PKH livenet test vector with "livenet" parameter', function() {
      for (var i = 0; i < PKHLivenet.length; i++) {
        var error = Address.getValidationError(PKHLivenet[i], 'livenet');
        should.not.exist(error);
      }
    });

    it('should not validate if checksum is invalid', function() {
      for (var i = 0; i < badChecksums.length; i++) {
        var error = Address.getValidationError(badChecksums[i], 'livenet', 'pubkeyhash');
        should.exist(error);
        error.message.should.equal('Checksum mismatch');
      }
    });

    it('should not validate on a network mismatch', function() {
      var error, i;
      for (i = 0; i < PKHLivenet.length; i++) {
        error = Address.getValidationError(PKHLivenet[i], 'testnet', 'pubkeyhash');
        should.exist(error);
        error.message.should.equal('Address has mismatched network type.');
      }
      for (i = 0; i < PKHTestnet.length; i++) {
        error = Address.getValidationError(PKHTestnet[i], 'livenet', 'pubkeyhash');
        should.exist(error);
        error.message.should.equal('Address has mismatched network type.');
      }
    });

    it('should not validate on a type mismatch', function() {
      for (var i = 0; i < PKHLivenet.length; i++) {
        var error = Address.getValidationError(PKHLivenet[i], 'livenet', 'scripthash');
        should.exist(error);
        error.message.should.equal('Address has mismatched type.');
      }
    });

    it('should not validate on non-base58 characters', function() {
      for (var i = 0; i < nonBase58.length; i++) {
        var error = Address.getValidationError(nonBase58[i], 'livenet', 'pubkeyhash');
        should.exist(error);
        error.message.should.equal('Non-base58 character');
      }
    });

    it('testnet addresses are validated correctly', function() {
      for (var i = 0; i < PKHTestnet.length; i++) {
        var error = Address.getValidationError(PKHTestnet[i], 'testnet');
        should.not.exist(error);
      }
    });

    it('addresses with whitespace are validated correctly', function() {
      var ws = '  \r \t    \n GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC \t \n            \r';
      var error = Address.getValidationError(ws);
      should.not.exist(error);
      Address.fromString(ws).toString().should.equal('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
    });
  });

  describe('instantiation', function() {
    it('can be instantiated from another address', function() {
      var address = Address.fromBuffer(addrBuffer)
      var address2 = new Address({
        hashBuffer: address.hashBuffer,
        network: address.network,
        type: address.type
      });
      address.toString().should.equal(address2.toString());
    });
  });

  describe('encodings', function() {

    it('should make an address from a buffer', function() {
      Address.fromBuffer(addrBuffer).toString().should.equal(addressString);
      new Address(addrBuffer).toString().should.equal(addressString);
      new Address(addrBuffer).toString().should.equal(addressString);
    });

    it('should make an address from a string', function() {
      Address.fromString(str).toString().should.equal(str);
      new Address(str).toString().should.equal(str);
    });

    it('should make an address using a non-string network', function() {
      Address.fromString(str, Networks.livenet).toString().should.equal(str);
    });

    it('should throw with bad network param', function() {
      (function(){
        Address.fromString(str, 'somenet');
      }).should.throw('Unknown network');
    });

    it('should error because of unrecognized data format', function() {
      (function() {
        return new Address(new Error());
      }).should.throw(errors.InvalidArgument);
    });

    it('should error because of incorrect format for pubkey hash', function() {
      (function() {
        return new Address.fromPublicKeyHash('notahash');
      }).should.throw('Address supplied is not a buffer.');
    });

    it('should error because of incorrect format for script hash', function() {
      (function() {
        return new Address.fromScriptHash('notascript');
      }).should.throw('Address supplied is not a buffer.');
    });

    it('should error because of incorrect type for transform buffer', function() {
      (function() {
        return Address._transformBuffer('notabuffer');
      }).should.throw('Address supplied is not a buffer.');
    });

    it('should error because of incorrect type for pubkey transform', function() {
      (function() {
        return Address._transformPublicKey(new Buffer(20));
      }).should.throw('Address must be an instance of PublicKey.');
    });

    it('should error because of incorrect type for script transform', function() {
      (function() {
        return Address._transformScript(new Buffer(20));
      }).should.throw('Invalid Argument: script must be a Script instance');
    });

    it('should error because of incorrect type for string transform', function() {
      (function() {
        return Address._transformString(new Buffer(20));
      }).should.throw('data parameter supplied is not a string.');
    });

    it('should make an address from a pubkey hash buffer', function() {
      var hash = pubkeyhash; //use the same hash
      var a = Address.fromPublicKeyHash(hash, 'livenet');
      console.log(275, a.toString(), str)
      a.network.should.equal(Networks.livenet);
      a.toString().should.equal(str);
      var b = Address.fromPublicKeyHash(hash, 'testnet');
      b.network.should.equal(Networks.testnet);
      b.type.should.equal('pubkeyhash');
      new Address(hash, 'livenet').toString().should.equal(str);
    });

    it('should make an address using the default network', function() {
      var hash = pubkeyhash; //use the same hash
      var network = Networks.defaultNetwork;
      Networks.defaultNetwork = Networks.livenet;
      var a = Address.fromPublicKeyHash(hash);
      a.network.should.equal(Networks.livenet);
      // change the default
      Networks.defaultNetwork = Networks.testnet;
      var b = Address.fromPublicKeyHash(hash);
      b.network.should.equal(Networks.testnet);
      // restore the default
      Networks.defaultNetwork = network;
    })

    it('should make this address from a compressed pubkey', function() {
      var pubkey = new PublicKey('30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106');
      var address = Address.fromPublicKey(pubkey, 'livenet');
      address.toString().should.equal('GUm8mcbJXd52rhQqkSMUq7rr4QDqgMRRdW');
    });

    it('should use the default network for pubkey', function() {
      var pubkey = new PublicKey('30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106');
      var address = Address.fromPublicKey(pubkey);
      address.network.should.equal(Networks.defaultNetwork);
    });

    it('should make this address from an uncompressed pubkey', function() {
      var pubkey = new PublicKey('30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106');
      var a = Address.fromPublicKey(pubkey, 'livenet');
      a.toString().should.equal('GUm8mcbJXd52rhQqkSMUq7rr4QDqgMRRdW');
      var b = new Address(pubkey, 'livenet', 'pubkeyhash');
      b.toString().should.equal('GUm8mcbJXd52rhQqkSMUq7rr4QDqgMRRdW');
    });

    it('should classify from a custom network', function() {
      var custom = {
        name: 'customnetwork',
        pubkeyhash: 0x1c,
        privatekey: 0x1e,
        scripthash: 0x28,
        xpubkey: 0x02e8de8f,
        xprivkey: 0x02e8da54,
        networkMagic: 0x0c110907,
        port: 7333
      };
      var addressString = 'CX4WePxBwq1Y6u7VyMJfmmitE7GiTgC9aE';
      Networks.add(custom);
      var network = Networks.get('customnetwork');
      var address = Address.fromString(addressString);
      address.type.should.equal(Address.PayToPublicKeyHash);
      address.network.should.equal(network);
      Networks.remove(network);
    });

    describe('from a script', function() {
      it('should fail to build address from a non p2sh,p2pkh script', function() {
        var s = new Script('OP_CHECKMULTISIG');
        (function() {
          return new Address(s);
        }).should.throw('needs to be p2pkh in, p2pkh out, p2sh in, or p2sh out');
      });
      it('should make this address from a p2pkh output script', function() {
        var s = new Script('OP_DUP OP_HASH160 20 ' +
          '0xc8e11b0eb0d2ad5362d894f048908341fa61b6e1 OP_EQUALVERIFY OP_CHECKSIG');
        var buf = s.toBuffer();
        var a = Address.fromScript(s, 'livenet');
        a.toString().should.equal('GcA5E7PYE8ju6MPdhfLoiM9L9SjtPrC4cz');
        var b = new Address(s, 'livenet');
        b.toString().should.equal('GcA5E7PYE8ju6MPdhfLoiM9L9SjtPrC4cz');
      });

      it('should make this address from a p2sh input script', function() {
        var s = Script.fromString('OP_HASH160 20 0xa6ed4af315271e657ee307828f54a4365fa5d20f OP_EQUAL');
        var a = Address.fromScript(s, 'livenet');
        a.toString().should.equal('MP7nffWprdM6CxdxdCAc4ESzb3XsQQPZMp');
        var b = new Address(s, 'livenet');
        b.toString().should.equal('MP7nffWprdM6CxdxdCAc4ESzb3XsQQPZMp');
      });

      it('returns the same address if the script is a pay to public key hash out', function() {
        var address = 'GUm8mcbJXd52rhQqkSMUq7rr4QDqgMRRdW';
        var script = Script.buildPublicKeyHashOut(new Address(address));
        Address(script, Networks.livenet).toString().should.equal(address);
      });
      it('returns the same address if the script is a pay to script hash out', function() {
        var address = '3BYmEwgV2vANrmfRymr1mFnHXgLjD6gAWm';
        var script = Script.buildScriptHashOut(new Address(address));
        Address(script, Networks.livenet).toString().should.equal(address);
      });
    });
    it('should derive from this known address string livenet', function() {
      var address = new Address(str);
      var buffer = address.toBuffer();
      var slice = buffer.slice(1);
      var sliceString = slice.toString('hex');
      sliceString.should.equal('b11681dc34303aaceff170be1351bf42b6da5efb');
    });

    it('should derive from this known address string testnet', function() {
      var a = new Address(PKHTestnet[0], 'testnet');
      var b = new Address(a.toString());
      b.toString().should.equal(PKHTestnet[0]);
      b.network.should.equal(Networks.testnet);
    });

    it('should derive from this known address string livenet scripthash', function() {
      var a = new Address(P2SHLivenet[0], 'livenet', 'scripthash');
      var b = new Address(a.toString());
      b.toString().should.equal(P2SHLivenet[0]);
    });

    it('should derive from this known address string testnet scripthash', function() {
      var address = new Address(P2SHTestnet[0], 'testnet', 'scripthash');
      address = new Address(address.toString());
      address.toString().should.equal(P2SHTestnet[0]);
    });

  });
  describe('#toBuffer', function() {

    it('b11681dc34303aaceff170be1351bf42b6da5efb corresponds to hash GZzGyuvwB9kq5ZN914SJdjJW2kPqfsDy9W', function() {
      var address = new Address(str);
      address.toBuffer().slice(1).toString('hex').should.equal('b11681dc34303aaceff170be1351bf42b6da5efb');
    });

  });

  describe('#object', function() {

    it('roundtrip to-from-to', function() {
      var obj = new Address(str).toObject();
      var address = Address.fromObject(obj);
      address.toString().should.equal(str);
    });

    it('will fail with invalid state', function() {
      expect(function() {
        return Address.fromObject('¹');
      }).to.throw(errors.InvalidState);
    });
  });

  describe('#toString', function() {

    it('livenet pubkeyhash address', function() {
      var address = new Address(str);
      address.toString().should.equal(str);
    });

    it('scripthash address', function() {
      var address = new Address(P2SHLivenet[0]);
      address.toString().should.equal(P2SHLivenet[0]);
    });

    it('testnet scripthash address', function() {
      var address = new Address(P2SHTestnet[0]);
      address.toString().should.equal(P2SHTestnet[0]);
    });

    it('testnet pubkeyhash address', function() {
      var address = new Address(PKHTestnet[0]);
      address.toString().should.equal(PKHTestnet[0]);
    });

  });

  describe('#inspect', function() {
    it('should output formatted output correctly', function() {
      var address = new Address(str);
      var output = '<Address: GZzGyuvwB9kq5ZN914SJdjJW2kPqfsDy9W, type: pubkeyhash, network: livenet>';
      address.inspect().should.equal(output);
    });
  });

  describe('questions about the address', function() {
    it('should detect a P2SH address', function() {
      new Address(P2SHLivenet[0]).isPayToScriptHash().should.equal(true);
      new Address(P2SHLivenet[0]).isPayToPublicKeyHash().should.equal(false);
      new Address(P2SHTestnet[0]).isPayToScriptHash().should.equal(true);
      new Address(P2SHTestnet[0]).isPayToPublicKeyHash().should.equal(false);
    });
    it('should detect a Pay To PubkeyHash address', function() {
      new Address(PKHLivenet[0]).isPayToPublicKeyHash().should.equal(true);
      new Address(PKHLivenet[0]).isPayToScriptHash().should.equal(false);
      new Address(PKHTestnet[0]).isPayToPublicKeyHash().should.equal(true);
      new Address(PKHTestnet[0]).isPayToScriptHash().should.equal(false);
    });
  });

  it('throws an error if it couldn\'t instantiate', function() {
    expect(function() {
      return new Address(1);
    }).to.throw(TypeError);
  });
  it('can roundtrip from/to a object', function() {
    var address = new Address(P2SHLivenet[0]);
    expect(new Address(address.toObject()).toString()).to.equal(P2SHLivenet[0]);
  });

  it('will use the default network for an object', function() {
    var obj = {
      hash: '19a7d869032368fd1f1e26e5e73a4ad0e474960e',
      type: 'scripthash'
    };
    var address = new Address(obj);
    address.network.should.equal(Networks.defaultNetwork);
  });

  describe('creating a P2SH address from public keys', function() {

    var public1 = '02da5798ed0c055e31339eb9b5cef0d3c0ccdec84a62e2e255eb5c006d4f3e7f5b';
    var public2 = '0272073bf0287c4469a2a011567361d42529cd1a72ab0d86aa104ecc89342ffeb0';
    var public3 = '02738a516a78355db138e8119e58934864ce222c553a5407cf92b9c1527e03c1a2';
    var publics = [public1, public2, public3];

    it('can create an address from a set of public keys', function() {
      var address = Address.createMultisig(publics, 2, Networks.livenet);
      address.toString().should.equal('3FtqPRirhPvrf7mVUSkygyZ5UuoAYrTW3y');
      address = new Address(publics, 2, Networks.livenet);
      address.toString().should.equal('3FtqPRirhPvrf7mVUSkygyZ5UuoAYrTW3y');
    });

    it('works on testnet also', function() {
      var address = Address.createMultisig(publics, 2, Networks.testnet);
      address.toString().should.equal('2N7T3TAetJrSCruQ39aNrJvYLhG1LJosujf');
    });

    it('can also be created by Address.createMultisig', function() {
      var address = Address.createMultisig(publics, 2);
      var address2 = Address.createMultisig(publics, 2);
      address.toString().should.equal(address2.toString());
    });

    it('fails if invalid array is provided', function() {
      expect(function() {
        return Address.createMultisig([], 3, 'testnet');
      }).to.throw('Number of required signatures must be less than or equal to the number of public keys');
    });
  });

});
