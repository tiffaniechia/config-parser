var fs = require('fs');
var ConfigParser = require( appRoot + '/src/configParser.js');

var ConfigReader = function() {};

ConfigReader.prototype.ingest = function(filePath){
  return fs.readFileSync(filePath, 'utf8');
}

ConfigReader.prototype.configToDictionary = function (filePath, overrides) {
  try{
    fs.lstatSync(filePath).isFile();
  }catch(e){
    throw new Error('This is not a file, please check your path');
  }

  var contents = this.ingest(filePath);
  var file = new ConfigParser(contents, overrides);
  var results = '';

  try{
    results = file.parse();
  }catch(e){
    throw new Error('There was an error with the file');
  }

  return results;
}

module.exports = ConfigReader;
