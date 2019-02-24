var utils = require( appRoot + '/src/stringUtils.js');

var ConfigParser = function(contents, overrides) {
  this.contents = contents;
  this.dictionary = {};
  this.overrides = new Set(overrides);
};

ConfigParser.prototype.removeComments = function (line) {
  return line.split(';')[0];
};

ConfigParser.prototype.getKeyValuePairsForVariedOption = function (line) {
  var result = {};
  var groups = utils.SETTINGS_WITH_OVERRIDE_REGEX.exec(line);
  result['key'] = groups[1].trim();
  result['override'] = groups[2].trim();
  result['value'] = groups[3].trim();

  return result;
};

ConfigParser.prototype.getKeyValuePairs = function(line) {
  var result = {};
  var pairs = line.split('=');
  result['key'] = pairs[0].trim();
  result['value'] = pairs[1].trim();

  return result;
};

ConfigParser.prototype.getGroupHeader = function(line) {
  return utils.GROUP_REGEX.exec(line)[1];
};

ConfigParser.prototype.santiseValue = function (value) {
  if (utils.isNumber(value)){
    value = parseInt(value);
  } else if (utils.isArray(value)){
    value = value.split(',');
  } else if(utils.isString(value)){
    value = value.replace(/"/g, "");
  } else if(utils.isBoolean(value)){
    value = value === 'yes' ? true : false;
  }

  return value;
};

ConfigParser.prototype.parse = function () {
  var currentGroup;

  this.contents.split('\n').forEach((line)=>{
    line = this.removeComments(line);
    if(utils.isGroup(line)){
      currentGroup = this.getGroupHeader(line);
      this.dictionary[currentGroup] = {};
    } else if (utils.isSettingWithOverride(line)) {
      var triplet = this.getKeyValuePairsForVariedOption(line);
      if(this.overrides.has(triplet.override)){
        this.dictionary[currentGroup][triplet.key] = triplet.value;
      }
    } else if (utils.isSetting(line)){
      var pair = this.getKeyValuePairs(line);
      this.dictionary[currentGroup][pair.key] = this.santiseValue(pair.value);
    }
  });

  return this.dictionary;
};

module.exports = ConfigParser;
