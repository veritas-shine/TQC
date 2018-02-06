'use strict';

var should = require('chai').should();
var expect = require('chai').expect;

var errors = require('../errors');
import Unit from '../unit'

describe('Unit', function() {

  it('can be created from a number and unit', function() {
    expect(function() {
      return new Unit(1.2, 'PQC');
    }).to.not.throw();
  });

  it('can be created from a number and exchange rate', function() {
    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('no "new" is required for creating an instance', function() {
    expect(function() {
      return new Unit(1.2, 'PQC');
    }).to.not.throw();

    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('has property accesors "PQC", "mPQC", "uPQC", "qbits", and "glv"', function() {
    var unit = new Unit(1.2, 'PQC');
    unit.PQC.should.equal(1.2);
    unit.mPQC.should.equal(1200);
    unit.uPQC.should.equal(1200000);
    unit.qbits.should.equal(1200000);
    unit.glv.should.equal(120000000);
  });

  it('a string amount is allowed', function() {
    var unit;

    unit = Unit.fromPQC('1.00001');
    unit.PQC.should.equal(1.00001);

    unit = Unit.fromMilis('1.00001');
    unit.mPQC.should.equal(1.00001);

    unit = Unit.fromMillis('1.00001');
    unit.mPQC.should.equal(1.00001);

    unit = Unit.fromBits('100');
    unit.qbits.should.equal(100);

    unit = Unit.fromFiat('43', 350);
    unit.PQC.should.equal(0.12285714);
  });

  it('should have constructor helpers', function() {
    var unit;

    unit = Unit.fromPQC(1.00001);
    unit.PQC.should.equal(1.00001);

    unit = Unit.fromMilis(1.00001);
    unit.mPQC.should.equal(1.00001);

    unit = Unit.fromBits(100);
    unit.qbits.should.equal(100);

    unit = Unit.fromGlv(8999);
    unit.glv.should.equal(8999);

    unit = Unit.fromFiat(43, 350);
    unit.PQC.should.equal(0.12285714);
  });

  it('converts to glv correctly', function() {
    /* jshint maxstatements: 25 */
    var unit;

    unit = Unit.fromPQC(1.3);
    unit.mPQC.should.equal(1300);
    unit.qbits.should.equal(1300000);
    unit.glv.should.equal(130000000);

    unit = Unit.fromMilis(1.3);
    unit.PQC.should.equal(0.0013);
    unit.qbits.should.equal(1300);
    unit.glv.should.equal(130000);

    unit = Unit.fromBits(1.3);
    unit.PQC.should.equal(0.0000013);
    unit.mPQC.should.equal(0.0013);
    unit.glv.should.equal(130);

    unit = Unit.fromGlv(3);
    unit.PQC.should.equal(0.00000003);
    unit.mPQC.should.equal(0.00003);
    unit.qbits.should.equal(0.03);
  });

  it('takes into account floating point problems', function() {
    var unit = Unit.fromPQC(0.00000003);
    unit.mPQC.should.equal(0.00003);
    unit.qbits.should.equal(0.03);
    unit.glv.should.equal(3);
  });

  it('exposes unit codes', function() {
    should.exist(Unit.PQC);
    Unit.PQC.should.equal('PQC');

    should.exist(Unit.mPQC);
    Unit.mPQC.should.equal('mPQC');

    should.exist(Unit.qbits);
    Unit.qbits.should.equal('qbits');

    should.exist(Unit.glv);
    Unit.glv.should.equal('glv');
  });

  it('exposes a method that converts to different units', function() {
    var unit = new Unit(1.3, 'PQC');
    unit.to(Unit.PQC).should.equal(unit.PQC);
    unit.to(Unit.mPQC).should.equal(unit.mPQC);
    unit.to(Unit.qbits).should.equal(unit.qbits);
    unit.to(Unit.glv).should.equal(unit.glv);
  });

  it('exposes shorthand conversion methods', function() {
    var unit = new Unit(1.3, 'PQC');
    unit.toPQC().should.equal(unit.PQC);
    unit.toMilis().should.equal(unit.mPQC);
    unit.toMillis().should.equal(unit.mPQC);
    unit.toBits().should.equal(unit.qbits);
    unit.toGlv().should.equal(unit.glv);
  });

  it('can convert to fiat', function() {
    var unit = new Unit(1.3, 350);
    unit.atRate(350).should.equal(1.3);
    unit.to(350).should.equal(1.3);

    unit = Unit.fromPQC(0.0123);
    unit.atRate(10).should.equal(0.12);
  });

  it('toString works as expected', function() {
    var unit = new Unit(1.3, 'PQC');
    should.exist(unit.toString);
    unit.toString().should.be.a('string');
  });

  it('can be imported and exported from/to JSON', function() {
    var json = JSON.stringify({amount:1.3, code:'PQC'});
    var unit = Unit.fromObject(JSON.parse(json));
    JSON.stringify(unit).should.deep.equal(json);
  });

  it('importing from invalid JSON fails quickly', function() {
    expect(function() {
      return Unit.fromJSON('¹');
    }).to.throw();
  });

  it('inspect method displays nicely', function() {
    var unit = new Unit(1.3, 'PQC');
    unit.inspect().should.equal('<Unit: 130000000 glv>');
  });

  it('fails when the unit is not recognized', function() {
    expect(function() {
      return new Unit(100, 'USD');
    }).to.throw(errors.Unit.UnknownCode);
    expect(function() {
      return new Unit(100, 'PQC').to('USD');
    }).to.throw(errors.Unit.UnknownCode);
  });

  it('fails when the exchange rate is invalid', function() {
    expect(function() {
      return new Unit(100, -123);
    }).to.throw(errors.Unit.InvalidRate);
    expect(function() {
      return new Unit(100, 'PQC').atRate(-123);
    }).to.throw(errors.Unit.InvalidRate);
  });

});
