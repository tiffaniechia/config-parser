var assert = require('assert');
var sinon = require('sinon');
var app = require('../app.js');
var ConfigReader = require( appRoot + '/src/configReader.js');
var TEST_FILE = appRoot + '/test/resources/headerIdentification.conf';

describe('App', function() {
	it('should make call to configReader with correct params', function() {
		var configToDictionary = sinon.spy(ConfigReader.prototype, 'configToDictionary');

		app.loadConfig(TEST_FILE, ['override1']);

		assert.equal(configToDictionary.callCount, 1);
		assert.deepEqual(configToDictionary.args, [[TEST_FILE, ['override1']]]);

		configToDictionary.restore();
	});
});
