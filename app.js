var path = require('path');
global.appRoot = path.resolve(__dirname);
var ConfigReader = require( appRoot + '/src/configReader.js');

var loadConfig = function (filePath, overrides=[]) {
  var reader = new ConfigReader();
  return reader.configToDictionary(filePath, overrides);
}

module.exports = {
  loadConfig: loadConfig
};
