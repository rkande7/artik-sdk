/* Global Includes */
var testCase   = require('mocha').describe;
var pre        = require('mocha').before;
var preEach    = require('mocha').beforeEach;
var post       = require('mocha').after;
var postEach   = require('mocha').afterEach;
var assertions = require('mocha').it;
var assert     = require('chai').assert;
var validator  = require('validator');
var process    = require('child_process').execSync;
var artik      = require('../lib/artik-sdk');

/*local includes */
var json = JSON.parse(artik.get_device_info());

testCase('Module', function() {

	pre(function() {
	});

	testCase('Module Details', function() {
		assertions('Getting Details of Module', function(done) {
			assert.isNotNull(json.name,"Module Name is null")
			for (i in json.modules)
				console.log('\t' + json.modules[i]);
		});
	});
	
	post(function() {
	});

});
