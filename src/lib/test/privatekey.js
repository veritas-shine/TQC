'use strict';

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var pqccore = require('..');
var BN = pqccore.crypto.BN;
var PrivateKey = pqccore.PrivateKey;
var Networks = pqccore.Networks;
var Base58Check = pqccore.encoding.Base58Check;

var validbase58 = require('./data/pqcoind/base58_keys_valid.json');
var invalidbase58 = require('./data/pqcoind/base58_keys_invalid.json');

describe('PrivateKey', function() {
  var hex = '96c132224121b509b7d0a16245e957d9192609c5637c6228311287b1be21627a';
  var hex2 = '8080808080808080808080808080808080808080808080808080808080808080';
  var buf = new Buffer(hex, 'hex');
  var wifTestnet = 'cSdkPxkAjA4HDr5VHgsebAPDEh9Gyub4HK8UJr2DFGGqKKy4K5sG';
  var wifTestnetUncompressed = '92jJzK4tbURm1C7udQXxeCBvXHoHJstDXRxAMouPG1k1XUaXdsu';
  var wifLivenet = 'L2Gkw3kKJ6N24QcDuH4XDqt9cTqsKTVNDGz1CRZhk9cq4auDUbJy';
  var wifLivenetUncompressed = '5JxgQaFM1FMd38cd14e3mbdxsdSa9iM2BV6DHBYsvGzxkTNQ7Un';
  var wifNamecoin = '74pxNKNpByQ2kMow4d9kF6Z77BYeKztQNLq3dSyU4ES1K5KLNiz';

  it('should create a new random private key', function() {
    var a = new PrivateKey();
    should.exist(a);
    should.exist(a.bn);
    var b = PrivateKey();
    should.exist(b);
    should.exist(b.bn);
  });

  it('should create a privatekey from hexa string', function() {
    var a = new PrivateKey(hex2);
    should.exist(a);
    should.exist(a.bn);
  });

  it('should create a new random testnet private key with only one argument', function() {
    var a = new PrivateKey(Networks.testnet);
    should.exist(a);
    should.exist(a.bn);
  });

  it('should create a private key from a custom network WIF string', function() {
    var nmc = {
      name: 'namecoin',
      alias: 'namecoin',
      pubkeyhash: 0x34,
      privatekey: 0xB4,
      // these below aren't the real NMC version numbers
      scripthash: 0x08,
      xpubkey: 0x0278b20e,
      xprivkey: 0x0278ade4,
      networkMagic: 0xf9beb4fe,
      port: 20001,
      dnsSeeds: [
        'localhost',
        'mynet.localhost'
      ]
    };
    Networks.add(nmc);
    var nmcNet = Networks.get('namecoin');
    var a = new PrivateKey(wifNamecoin, nmcNet);
    should.exist(a);
    should.exist(a.bn);
    Networks.remove(nmcNet);
  });

  it('should create a new random testnet private key with empty data', function() {
    var a = new PrivateKey(null, Networks.testnet);
    should.exist(a);
    should.exist(a.bn);
  });

  it('should create a private key from WIF string', function() {
    var a = new PrivateKey('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
    should.exist(a);
    should.exist(a.bn);
  });

  it('should create a private key from WIF buffer', function() {
    var a = new PrivateKey(Base58Check.decode('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m'));
    should.exist(a);
    should.exist(a.bn);
  });

  describe('pqcoind compliance', function() {
    validbase58.map(function(d){
      if (d[2].isPrivkey) {
        it('should instantiate WIF private key ' + d[0] + ' with correct properties', function() {
          var network = Networks.livenet;
          if (d[2].isTestnet) {
            network = Networks.testnet;
          }
          var key = new PrivateKey(d[0]);
          key.compressed.should.equal(d[2].isCompressed);
          key.network.should.equal(network);
        });
      }
    });
    invalidbase58.map(function(d){
      it('should describe input ' + d[0].slice(0,10) + '... as invalid', function() {
        expect(function() {
          return new PrivateKey(d[0]);
        }).to.throw(Error);
      });
    });
  });

  describe('instantiation', function() {

    it('should not be able to instantiate private key because of network mismatch', function() {
      expect(function() {
        return new PrivateKey('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m', 'testnet');
      }).to.throw('Private key network mismatch');
    });

    it('should not be able to instantiate private key WIF is too long', function() {
      expect(function() {
        var buf = Base58Check.decode('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
        var buf2 = Buffer.concat([buf, new Buffer(0x01)]);
        return new PrivateKey(buf2);
      }).to.throw('Length of buffer must be 33 (uncompressed) or 34 (compressed');
    });

    it('should not be able to instantiate private key WIF because of unknown network byte', function() {
      expect(function() {
        var buf = Base58Check.decode('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
        var buf2 = Buffer.concat([new Buffer('ff', 'hex'), buf.slice(1, 33)]);
        return new PrivateKey(buf2);
      }).to.throw('Invalid network');
    });

    it('should not be able to instantiate private key WIF because of network mismatch', function() {
      expect(function(){
        var a = new PrivateKey(wifNamecoin, 'testnet');
      }).to.throw('Invalid network');
    });

    it('can be instantiated from a hex string', function() {
      var privhex = '906977a061af29276e40bf377042ffbde414e496ae2260bbf1fa9d085637bfff';
      var pubhex = '010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60';
      var privkey = new PrivateKey(privhex);
      privkey.publicKey.toString().should.equal(pubhex);
    });

    it('should not be able to instantiate because of unrecognized data', function() {
      expect(function() {
        return new PrivateKey(new Error());
      }).to.throw('First argument is an unrecognized data type.');
    });

    it('should not be able to instantiate with unknown network', function() {
      expect(function() {
        return new PrivateKey(new BN(2), 'unknown');
      }).to.throw('Must specify the network ("livenet" or "testnet")');
    });

    it('should not create a zero private key', function() {
      expect(function() {
        var bn = new BN(0);
        return new PrivateKey(bn);
       }).to.throw(TypeError);
    });

    it('should create a livenet private key', function() {
      var privkey = new PrivateKey(BN.fromBuffer(buf), 'livenet');
      privkey.toWIF().should.equal(wifLivenet);
    });

    it('should create a default network private key', function() {
      // keep the original
      var network = Networks.defaultNetwork;
      Networks.defaultNetwork = Networks.livenet;
      var a = new PrivateKey(BN.fromBuffer(buf));
      a.network.should.equal(Networks.livenet);
      // change the default
      Networks.defaultNetwork = Networks.testnet;
      var b = new PrivateKey(BN.fromBuffer(buf));
      b.network.should.equal(Networks.testnet);
      // restore the default
      Networks.defaultNetwork = network;
    });

    it('returns the same instance if a PrivateKey is provided (immutable)', function() {
      var privkey = new PrivateKey();
      new PrivateKey(privkey).should.equal(privkey);
    });

  });

  describe('#json/object', function() {

    it('should input/output json', function() {
      var json = JSON.stringify({
        bn: '96c132224121b509b7d0a16245e957d9192609c5637c6228311287b1be21627a',
        compressed: false,
        network: 'livenet'
      });
      var key = PrivateKey.fromObject(JSON.parse(json));
      JSON.stringify(key).should.equal(json);
    });

    it('input json should correctly initialize network field', function() {
      ['livenet', 'testnet', 'mainnet'].forEach(function (net) {
        var pk = PrivateKey.fromObject({
          bn: '96c132224121b509b7d0a16245e957d9192609c5637c6228311287b1be21627a',
          compressed: false,
          network: net
        });
        pk.network.should.be.deep.equal(Networks.get(net));
      });
    });

    it('fails on invalid argument', function() {
      expect(function() {
        return PrivateKey.fromJSON('¹');
      }).to.throw();
    });

    it('also accepts an object as argument', function() {
      expect(function() {
        return PrivateKey.fromObject(new PrivateKey().toObject());
      }).to.not.throw();
    });
  });

  it('coverage: public key cache', function() {
    expect(function() {
      var privateKey = new PrivateKey();
      /* jshint unused: false */
      var publicKey = privateKey.publicKey;
      return privateKey.publicKey;
    }).to.not.throw();
  });

  describe('#toString', function() {

    it('should output this address correctly', function() {
      var privkey = PrivateKey.fromWIF(wifLivenetUncompressed);
      privkey.toWIF().should.equal(wifLivenetUncompressed);
    });

  });

  describe('#toAddress', function() {
    it('should output this known livenet address correctly', function() {
      var privkey = PrivateKey.fromWIF('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
      var address = privkey.toAddress();
      address.toString().should.equal('1C6LpKnREP9SrexXvqQBSofc82MTCsqH15');
    });

    it('should output this known testnet address correctly', function() {
      var privkey = PrivateKey.fromWIF('cR4qogdN9UxLZJXCNFNwDRRZNeLRWuds9TTSuLNweFVjiaE4gPaq');
      var address = privkey.toAddress();
      address.toString().should.equal('mrcJ7NsQ3QahdmS9eQNZGisvz1xA6zM1Kq');
    });

    it('creates network specific address', function() {
      var pk = PrivateKey.fromWIF('cR4qogdN9UxLZJXCNFNwDRRZNeLRWuds9TTSuLNweFVjiaE4gPaq');
      pk.toAddress(Networks.livenet).network.name.should.equal(Networks.livenet.name);
      pk.toAddress(Networks.testnet).network.name.should.equal(Networks.testnet.name);
    });

  });

  describe('#inspect', function() {
    it('should output known livenet address for console', function() {
      var privkey = PrivateKey.fromWIF('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
      privkey.inspect().should.equal(
        '<PrivateKey: b9de6e778fe92aa7edb69395556f843f1dce0448350112e14906efc2a80fa61a, network: livenet>'
      );
    });

    it('should output known testnet address for console', function() {
      var privkey = PrivateKey.fromWIF('cR4qogdN9UxLZJXCNFNwDRRZNeLRWuds9TTSuLNweFVjiaE4gPaq');
      privkey.inspect().should.equal(
        '<PrivateKey: 67fd2209ce4a95f6f1d421ab3fbea47ada13df11b73b30c4d9a9f78cc80651ac, network: testnet>'
      );
    });

    it('outputs "uncompressed" for uncompressed imported WIFs', function() {
      var privkey = PrivateKey.fromWIF(wifLivenetUncompressed);
      privkey.inspect().should.equal('<PrivateKey: 96c132224121b509b7d0a16245e957d9192609c5637c6228311287b1be21627a, network: livenet, uncompressed>');
    });
  });

  describe('#getValidationError', function(){

    it('should recognize that undefined is an invalid private key', function() {
      PrivateKey.isValid().should.equal(false);
    });

    it('should validate as true', function() {
      var a = PrivateKey.isValid('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
      a.should.equal(true);
    });

  });

  describe('buffer serialization', function() {
    it('returns an expected value when creating a PrivateKey from a buffer', function() {
      var privkey = new PrivateKey(BN.fromBuffer(buf), 'livenet');
      privkey.toString().should.equal(buf.toString('hex'));
    });

    it('roundtrips correctly when using toBuffer/fromBuffer', function() {
      var privkey = new PrivateKey(BN.fromBuffer(buf));
      var toBuffer = new PrivateKey(privkey.toBuffer());
      var fromBuffer = PrivateKey.fromBuffer(toBuffer.toBuffer());
      fromBuffer.toString().should.equal(privkey.toString());
    });

    it('will output a 31 byte buffer', function() {
      var bn = BN.fromBuffer(new Buffer('9b5a0e8fee1835e21170ce1431f9b6f19b487e67748ed70d8a4462bc031915', 'hex'));
      var privkey = new PrivateKey(bn);
      var buffer = privkey.toBufferNoPadding();
      buffer.length.should.equal(31);
    });

    // TODO: enable for v1.0.0 when toBuffer is changed to always be 32 bytes long
    // it('will output a 32 byte buffer', function() {
    //   var bn = BN.fromBuffer(new Buffer('9b5a0e8fee1835e21170ce1431f9b6f19b487e67748ed70d8a4462bc031915', 'hex'));
    //   var privkey = new PrivateKey(bn);
    //   var buffer = privkey.toBuffer();
    //   buffer.length.should.equal(32);
    // });

    // TODO: enable for v1.0.0 when toBuffer is changed to always be 32 bytes long
    // it('should return buffer with length equal 32', function() {
    //   var bn = BN.fromBuffer(buf.slice(0, 31));
    //   var privkey = new PrivateKey(bn, 'livenet');
    //   var expected = Buffer.concat([ new Buffer([0]), buf.slice(0, 31) ]);
    //   privkey.toBuffer().toString('hex').should.equal(expected.toString('hex'));
    // });
  });

  describe('#toBigNumber', function() {
    it('should output known BN', function() {
      var a = BN.fromBuffer(buf);
      var privkey = new PrivateKey(a, 'livenet');
      var b = privkey.toBigNumber();
      b.toString('hex').should.equal(a.toString('hex'));
    });
  });

  describe('#fromRandom', function() {

    it('should set bn gt 0 and lt n, and should be compressed', function() {
      var privkey = PrivateKey.fromRandom();
      privkey.bn.gt(new BN(0)).should.equal(true);
      privkey.compressed.should.equal(true);
    });

  });

  describe('#fromWIF', function() {

    it('should parse this compressed testnet address correctly', function() {
      var privkey = PrivateKey.fromWIF(wifLivenet);
      privkey.toWIF().should.equal(wifLivenet);
    });

  });

  describe('#toWIF', function() {

    it('should parse this compressed testnet address correctly', function() {
      var privkey = PrivateKey.fromWIF(wifTestnet);
      privkey.toWIF().should.equal(wifTestnet);
    });

  });

  describe('#fromString', function() {

    it('should parse this uncompressed testnet address correctly', function() {
      var privkey = PrivateKey.fromString(wifTestnetUncompressed);
      privkey.toWIF().should.equal(wifTestnetUncompressed);
    });

  });

  describe('#toString', function() {

    it('should parse this uncompressed livenet address correctly', function() {
      var privkey = PrivateKey.fromString(wifLivenetUncompressed);
      privkey.toString().should.equal("96c132224121b509b7d0a16245e957d9192609c5637c6228311287b1be21627a");
    });

  });

  describe('#toPublicKey', function() {

    it('should convert this known PrivateKey to known PublicKey', function() {
      var privhex = '906977a061af29276e40bf377042ffbde414e496ae2260bbf1fa9d085637bfff';
      var pubhex = '010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60';
      var privkey = new PrivateKey(new BN(new Buffer(privhex, 'hex')));
      var pubkey = privkey.toPublicKey();
      pubkey.toString().should.equal(pubhex);
    });

    it('should have a "publicKey" property', function() {
      var privhex = '906977a061af29276e40bf377042ffbde414e496ae2260bbf1fa9d085637bfff';
      var pubhex = '010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60';
      var privkey = new PrivateKey(new BN(new Buffer(privhex, 'hex')));
      privkey.publicKey.toString().should.equal(pubhex);
    });

    it('should convert this known PrivateKey to known PublicKey and preserve compressed=true', function() {
      var privwif = 'L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m';
      var privkey = new PrivateKey(privwif, 'livenet');
      var pubkey = privkey.toPublicKey();
      pubkey.compressed.should.equal(true);
    });

    it('should convert this known PrivateKey to known PublicKey and preserve compressed=false', function() {
      var privwif = '92jJzK4tbURm1C7udQXxeCBvXHoHJstDXRxAMouPG1k1XUaXdsu';
      var privkey = new PrivateKey(privwif, 'testnet');
      var pubkey = privkey.toPublicKey();
      pubkey.compressed.should.equal(false);
    });

  });

  it('creates an address as expected from WIF, livenet', function() {
    var privkey = new PrivateKey('5J2NYGstJg7aJQEqNwYp4enG5BSfFdKXVTtBLvHicnRGD5kjxi6');
    privkey.publicKey.toAddress().toString().should.equal('1C6LpKnREP9SrexXvqQBSofc82MTCsqH15');
  });

  it('creates an address as expected from WIF, testnet', function() {
    var privkey = new PrivateKey('92VYMmwFLXRwXn5688edGxYYgMFsc3fUXYhGp17WocQhU6zG1kd');
    privkey.publicKey.toAddress().toString().should.equal('mrcJ7NsQ3QahdmS9eQNZGisvz1xA6zM1Kq');
  });

});
