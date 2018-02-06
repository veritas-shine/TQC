

const should = require('chai').should();

const errors = require('../../errors')
import $ from '../../util/preconditions'

describe('preconditions', () => {
  it('can be used to assert state', () => {
    (function () {
      $.checkState(false, 'testing');
    }).should.throw(errors.InvalidState);
  });
  it('throws no false negative', () => {
    (function () {
      $.checkState(true, 'testing');
    }).should.not.throw();
  });

  it('can be used to check an argument', () => {
    (function () {
      $.checkArgument(false, 'testing');
    }).should.throw(errors.InvalidArgument);

    (function () {
      $.checkArgument(true, 'testing');
    }).should.not.throw(errors.InvalidArgument);
  });

  it('can be used to check an argument type', () => {
    let error;
    try {
      $.checkArgumentType(1, 'string', 'argumentName');
    } catch (e) {
      error = e;
      e.message.should.equal('Invalid Argument for argumentName, expected string but got number');
    }
    should.exist(error);
  });
  it('has no false negatives when used to check an argument type', () => {
    (function () {
      $.checkArgumentType('a String', 'string', 'argumentName');
    }).should.not.throw();
  });

  it('formats correctly a message on InvalidArgument()', () => {
    const error = new errors.InvalidArgument();
    error.message.should.equal('Invalid Argument');
  });

  it('formats correctly a message on checkArgument', () => {
    let error;
    try {
      $.checkArgument(null, 'parameter must be provided');
    } catch (e) {
      error = e;
    }
    error.message.should.equal('Invalid Argument: parameter must be provided');
  });
});
