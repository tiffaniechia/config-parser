var assert = require('assert');
var ConfigReader = require( appRoot + '/src/configReader.js');
var TEST_FILE = appRoot + '/test/resources/headerIdentification.conf';
var INITIAL_TEST_FILE = appRoot + '/test/resources/initialTest.conf';

describe('ConfigReader', function() {
  var reader;

  before(function() {
    reader = new ConfigReader();
  });
  
  it('should read file', function() {
    assert.equal(reader.ingest(INITIAL_TEST_FILE, []), 'Hello World! :D\n');
  });

  it('should return error if not a valid filepath', function() {
    var wrongFilePath = appRoot + '/notAnActualFile';
    assert.throws(() => {reader.configToDictionary(wrongFilePath)}, Error, 'This is not a file, please check your path');
  });

  it('should load up config dictionary from file path', function() {
    var expected =  {
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

    assert.deepEqual(reader.configToDictionary(TEST_FILE, []), expected);
  });
});
