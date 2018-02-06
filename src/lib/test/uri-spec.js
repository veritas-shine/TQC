

var chai = chai || require('chai');
const pqccore = require('..');

const expect = chai.expect;
const Networks = pqccore.Networks;
const should = chai.should();
const URI = pqccore.URI;

describe('URI', () => {
  /* jshint maxstatements: 30 */

  // TODO: Split this and explain tests
  it('parses uri strings correctly (test vector)', () => {
    let uri;

    URI.parse.bind(URI, 'badURI').should.throw(TypeError);

    uri = URI.parse('pqcoin:')
    expect(uri.address).to.be.undefined;
    expect(uri.amount).to.be.undefined;
    expect(uri.otherParam).to.be.undefined;

    uri = URI.parse('pqcoin:1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj');
    uri.address.should.equal('1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj');
    expect(uri.amount).to.be.undefined;
    expect(uri.otherParam).to.be.undefined;

    uri = URI.parse('pqcoin:1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj?amount=123.22');
    uri.address.should.equal('1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj');
    uri.amount.should.equal('123.22');
    expect(uri.otherParam).to.be.undefined;

    uri = URI.parse('pqcoin:1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj?amount=123.22' +
                    '&other-param=something&req-extra=param');
    uri.address.should.equal('1DP69gMMvSuYhbnxsi4EJEFufUAbDrEQfj');
    uri.amount.should.equal('123.22');
    uri['other-param'].should.equal('something');
    uri['req-extra'].should.equal('param');
  });

  // TODO: Split this and explain tests
  it('URIs can be validated statically (test vector)', () => {
    URI.isValid('pqcoin:Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX').should.equal(true);
    URI.isValid('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC').should.equal(true);

    URI.isValid('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2')
      .should.equal(true);
    URI.isValid('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&other=param')
      .should.equal(true);
    URI.isValid(
      'pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&req-other=param',
      ['req-other']
    ).should.equal(true);
    URI.isValid('pqcoin:Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX?amount=0.1&' +
                'r=https%3A%2F%2Ftest.bitpay.com%2Fi%2F6DKgf8cnJC388irbXk5hHu').should.equal(true);

    URI.isValid('pqcoin:').should.equal(false);
    URI.isValid('pqcoin:badUri').should.equal(false);
    URI.isValid('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=bad').should.equal(false);
    URI.isValid('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&req-other=param')
      .should.equal(false);
    URI.isValid('pqcoin:?r=https%3A%2F%2Ftest.bitpay.com%2Fi%2F6DKgf8cnJC388irbXk5hHu')
      .should.equal(false);
  });

  it('fails on creation with no params', () => {
    (function () {
      return new URI();
    }).should.throw(TypeError);
  });

  it('do not need new keyword', () => {
    const uri = URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
    uri.should.be.instanceof(URI);
  });

  describe('instantiation from pqcoin uri', () => {
    /* jshint maxstatements: 25 */

    0

    let uri;

    it('parses address', () => {
      uri = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
      uri.address.should.be.instanceof(pqccore.Address);
      uri.network.should.equal(Networks.livenet);
    });

    it('parses amount', () => {
      uri = URI.fromString('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=123.22');
      uri.address.toString().should.equal('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
      uri.amount.should.equal(12322000000);
      expect(uri.otherParam).to.be.undefined;
    });

    it('parses a testnet address', () => {
      uri = new URI('pqcoin:Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX');
      uri.address.should.be.instanceof(pqccore.Address);
      uri.network.should.equal(Networks.testnet);
    });

    it('stores unknown parameters as "extras"', () => {
      uri = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&other=param');
      uri.address.should.be.instanceof(pqccore.Address);
      expect(uri.other).to.be.undefined;
      uri.extras.other.should.equal('param');
    });

    it('throws error when a required feature is not supported', () => {
      (function () {
        return new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&other=param&req-required=param');
      }).should.throw(Error);
    });

    it('has no false negative when checking supported features', () => {
      uri = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.2&other=param&' +
                    'req-required=param', ['req-required']);
      uri.address.should.be.instanceof(pqccore.Address);
      uri.amount.should.equal(120000000);
      uri.extras.other.should.equal('param');
      uri.extras['req-required'].should.equal('param');
    });
  });

  // TODO: Split this and explain tests
  it('should create instance from object', () => {
    /* jshint maxstatements: 25 */
    let uri;

    uri = new URI({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC'
    });
    uri.address.should.be.instanceof(pqccore.Address);
    uri.network.should.equal(Networks.livenet);

    uri = new URI({
      address: 'Lfci7ooSc31oNijNG9zDeHBBHJddxrPEKX'
    });
    uri.address.should.be.instanceof(pqccore.Address);
    uri.network.should.equal(Networks.testnet);

    uri = new URI({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
      amount: 120000000,
      other: 'param'
    });
    uri.address.should.be.instanceof(pqccore.Address);
    uri.amount.should.equal(120000000);
    expect(uri.other).to.be.undefined;
    uri.extras.other.should.equal('param');

    (function () {
      return new URI({
        address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
        'req-required': 'param'
      });
    }).should.throw(Error);

    uri = new URI({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
      amount: 120000000,
      other: 'param',
      'req-required': 'param'
    }, ['req-required']);
    uri.address.should.be.instanceof(pqccore.Address);
    uri.amount.should.equal(120000000);
    uri.extras.other.should.equal('param');
    uri.extras['req-required'].should.equal('param');
  });

  it('should support double slash scheme', () => {
    const uri = new URI('pqcoin://GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
    uri.address.toString().should.equal('GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
  });

  it('should input/output String', () => {
    const str = 'pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?' +
              'message=Donation%20for%20project%20xyz&label=myLabel&other=xD';
    URI.fromString(str).toString().should.equal(str);
  });

  it('should input/output JSON', () => {
    const json = JSON.stringify({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
      message: 'Donation for project xyz',
      label: 'myLabel',
      other: 'xD'
    });
    JSON.stringify(URI.fromObject(JSON.parse(json))).should.equal(json);
  });

  it('should support numeric amounts', () => {
    const uri = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=12.10001');
    expect(uri.amount).to.be.equal(1210001000);
  });

  it('should support extra arguments', () => {
    const uri = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?' +
                      'message=Donation%20for%20project%20xyz&label=myLabel&other=xD');

    should.exist(uri.message);
    uri.message.should.equal('Donation for project xyz');

    should.exist(uri.label);
    uri.label.should.equal('myLabel');

    should.exist(uri.extras.other);
    uri.extras.other.should.equal('xD');
  });

  it('should generate a valid URI', () => {
    new URI({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
    }).toString().should.equal('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');

    new URI({
      address: 'GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC',
      amount: 110001000,
      message: 'Hello World',
      something: 'else'
    }).toString().should.equal('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC?amount=1.10001&message=Hello%20World&something=else');
  });

  it('should be case insensitive to protocol', () => {
    const uri1 = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');
    const uri2 = new URI('pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC');

    uri1.address.toString().should.equal(uri2.address.toString());
  });

  it('writes correctly the "r" parameter on string serialization', () => {
    const originalString = 'pqcoin:LSqMfCvCHqDFWKp3xnKduMRYjw2Tqdn3JK?amount=0.1&' +
                         'r=https%3A%2F%2Ftest.bitpay.com%2Fi%2F6DKgf8cnJC388irbXk5hHu';
    const uri = new URI(originalString);
    uri.toString().should.equal(originalString);
  });

  it('displays nicely on the console (#inspect)', () => {
    const uri = 'pqcoin:GdypLqQuf57ntjyeqzpuBgiD5CN8oix4zC';
    const instance = new URI(uri);
    instance.inspect().should.equal(`<URI: ${uri}>`);
  });

  it('fails early when fromString isn\'t provided a string', () => {
    expect(() => {
      return URI.fromString(1);
    }).to.throw();
  });

  it('fails early when fromJSON isn\'t provided a valid JSON string', () => {
    expect(() => {
      return URI.fromJSON('¹');
    }).to.throw();
  });
});
