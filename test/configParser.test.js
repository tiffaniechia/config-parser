var fs = require('fs');
var assert = require('assert');
var ConfigParser = require( appRoot + '/src/configParser.js');
var TEST_FILE = appRoot + '/test/resources/headerIdentification.conf';

describe('ConfigParser', function() {
  var parser;
  var contents = fs.readFileSync(TEST_FILE, 'utf8');
  var happyPathExpected =  {
    'header': {
      'basic_size_limit': 26214400,
      'path': '/tmp/'
    },
    'more header': {
      'name': "hello there, ftp uploading",
      'question': false
    },
    'numbers 0 9': {
      'params': ['array','of','values'],
      'path': '/srv/uploads/',
      'happy_path': '/usr/'
    }
  };

  it('should take in selectors', function() {
    parser = new ConfigParser(contents, ['one','two']);
    assert.deepEqual(parser.overrides, new Set(['one','two']));
  });

  it('should remove comments', function() {
    var text = 'key = value; This is another comment';
    var expected = 'key = value';
    parser = new ConfigParser(contents, []);
    assert.equal(parser.removeComments(text), expected);
  });

  it('should santise incoming values according to type', function() {
    var string = '"string"';
    var number = '2';
    var array = 'this,is,an,array';
    var booleanTruthy = 'yes';
    var booleanFalsey = 'no';
    assert.equal(parser.santiseValue(string), 'string');
    assert.equal(parser.santiseValue(number), 2);
    assert.equal(parser.santiseValue(booleanTruthy), true);
    assert.equal(parser.santiseValue(booleanFalsey), false);
    assert.deepEqual(parser.santiseValue(array), ['this','is','an','array']);
  });

  it('should get regular key value pairs from a line', function() {
    var text = 'key = value';
    var expected = {key: 'key', value: 'value'};
    parser = new ConfigParser(contents, []);
    assert.equal(parser.getKeyValuePairs(text).key, 'key');
    assert.equal(parser.getKeyValuePairs(text).value, 'value');
  });

  it('should get key value and override option from a line', function() {
    var text = 'key<override> = value';
    var expected = {key: 'key', override: 'override', value: 'value'};
    parser = new ConfigParser(contents, []);
    assert.equal(parser.getKeyValuePairsForVariedOption(text).key, 'key');
    assert.equal(parser.getKeyValuePairsForVariedOption(text).override, 'override');
    assert.equal(parser.getKeyValuePairsForVariedOption(text).value, 'value');
  });

  it('should pick out title from header enclosed in brackets', function() {
    assert.equal(parser.getGroupHeader('[header]'), 'header');
  });

  it('should put all [] headers as parent keys in dictionary without overrides', function() {
    parser = new ConfigParser(contents, []);

    assert.deepEqual(parser.parse(), happyPathExpected);
  });

  it('should put choose the key with the selected override', function() {
    parser = new ConfigParser(contents, ['production']);
    var expected = happyPathExpected;
    expected['numbers 0 9']['happy_path'] = '/srv/var/tmp/';

    assert.deepEqual(parser.parse(), expected);
  });

  it('should put choose the last one defined if multiple overrides', function() {
    parser = new ConfigParser(contents, ['ubuntu','production']);
    var expected = happyPathExpected;
    expected['numbers 0 9']['happy_path'] = '/etc/var/uploads';

    assert.deepEqual(parser.parse(), expected);
  });

});
