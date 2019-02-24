var GROUP_REGEX = /(?<=\[)([a-zA-Z 0-9]+)(?=\])/;
var SETTINGS_REGEX = /.+=.+/;
var SETTINGS_WITH_OVERRIDE_REGEX = /(.+)[<](.+)[>].+[=](.+)/;
var STRING_REGEX = /\".+\"/;
var NUMBER_REGEX = /^\d+$/;
var ARRAY_REGEX = /^[^\"].+,.+[^\"]$/;

var isGroup = function (string) {
  return string.match(GROUP_REGEX) !== null;
}

var isSetting = function (string) {
  return string.match(SETTINGS_REGEX) !== null;
}

var isSettingWithOverride = function (string) {
  return string.match(SETTINGS_WITH_OVERRIDE_REGEX) !== null;
}

var isString = function (string) {
  return string.match(STRING_REGEX) !== null;
}

var isArray = function (string) {
  return string.match(ARRAY_REGEX) !== null;
}

var isNumber = function (string) {
  return string.match(NUMBER_REGEX) !== null;
}

var isBoolean = function (string) {
  return string.toLowerCase() === 'yes' || string.toLowerCase() === 'no';
}

module.exports = {
  isGroup: isGroup,
  isSetting: isSetting,
  isSettingWithOverride: isSettingWithOverride,
  isString: isString,
  isArray: isArray,
  isNumber: isNumber,
  isBoolean: isBoolean,
  SETTINGS_WITH_OVERRIDE_REGEX: SETTINGS_WITH_OVERRIDE_REGEX,
  GROUP_REGEX: GROUP_REGEX
};
