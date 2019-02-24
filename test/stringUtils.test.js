var assert = require('assert');
var utils = require( appRoot + '/src/stringUtils.js');

describe('StringUtils', function() {
  it('should return true if isBoolean', function(){
    assert.equal(utils.isBoolean('yes'), true);
    assert.equal(utils.isBoolean('no'), true);
    assert.equal(utils.isBoolean('yes yes yes'), false);
    assert.equal(utils.isBoolean('no, no'), false);
  });

  it('should return true if isArray', function() {
    assert.equal(utils.isArray('this,is,delightful'), true);
    assert.equal(utils.isArray('"this,is,delightful"'), false);
  });

  it('should return true if isString', function() {
    assert.equal(utils.isString('"this,is,great"'), true);
    assert.equal(utils.isString('this,is,great'), false);
  });

  it('should return true if isNumber', function() {
    assert.equal(utils.isNumber('24567'), true);
    assert.equal(utils.isNumber('this2'), false);
  });

  it('should recognise content surrounded by [] as groups', function() {
    assert.equal(utils.isGroup('[text]'), true);
    assert.equal(utils.isGroup('text'), false);
    assert.equal(utils.isGroup('text]'), false);
    assert.equal(utils.isGroup('[text'), false);
  });

  it('should recognise key value pairs as options', function() {
    assert.equal(utils.isSetting('name = "hello there, ftp uploading"'), true);
    assert.equal(utils.isSetting('name "hello there, ftp uploading"'), false);
  });

  it('should recognise key value pairs with variables as special options', function() {
    assert.equal(utils.isSettingWithOverride('name<one> = "hello there, ftp uploading"'), true);
    assert.equal(utils.isSettingWithOverride('name = "hello there, ftp uploading"'), false);
  });
});
