/* Global Includes */
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

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

/* Test Specific Includes */
var zb = new (require('../src/zigbee'))();
var join_duration = 0x3C; //60 sec
var zb_device_type = []; //get zigbee type
var input_lenght = process.argv.length;

testCase('Zigbee', function() {

	pre(function() {
		for(i=2;i<input_lenght;i++){
  			switch(process.argv[i]){
  				case 'ON_OFF_SWITCH' :
				zb_device_type.push(zb.ON_OFF_SWITCH);
				break;
				case 'LEVEL_CONTROL_SWITCH' :
				zb_device_type.push(zb.LEVEL_CONTROL_SWITCH);
				break;
  				case 'ON_OFF_LIGHT' :
				zb_device_type.push(zb.ON_OFF_LIGHT);
				break;
				case 'DIMMABLE_LIGHT' :
				zb_device_type.push(zb.DIMMABLE_LIGHT);
				break;
				default:
				zb_device_type.push(zb.ON_OFF_LIGHT);
				break
  			}
		}
		console.log("Usage");
		console.log("h : usage");
		console.log("1 : Easy network form");
		console.log("2 : Network leave");
		console.log("3 : Network find & join");
		console.log("4 : Get my network status");
		console.log("5 : On/Off");
		console.log("6 : Manual form");
		console.log("Ctrl+C : quit\n");
	});

	testCase('easy_device_onoff', function() {

		assertions('Easy device onoff functionality verification', function(done) {
			var data = zb.device_find_by_cluster(zb.ZCL_ON_OFF_CLUSTER_ID);
			var result =JSON.parse(data);
			assert.isNotNull(result,"Result is null");
			var count = result.length;
			for(i=0;i<count;i++){
				var array = [];
				var endpoint = result[i];
				array = array.concat(endpoint.endpoint_id);
				array = array.concat(endpoint.device_id);
				array = array.concat(endpoint.server_cluster);
				array = array.concat(endpoint.client_cluster);
				console.log('on_off send :' + zb.onoff_command(array, zb.ZIGBEE_ONOFF_TOGGLE));
	    		}
		});
	});

	testCase('manual_form_request', function() {

		assertions('Return callback event when the bluetooth scan request is performed', function(done) {
			var channel = 25;
			var tx_power = zb.ZIGBEE_TX_POWER_8;
			var pan_id = 0x1234;
			var network =[channel, tx_power, pan_id];
			assert.isNotNull(zb.network_form_manually(network),"network form manually");
			console.log(zb.network_form_manually(network));
			assert.isNotNull(zb.network_permitjoin(join_duration),"Join duration set ");
			console.log('Join duration set is :' + zb.network_permitjoin(join_duration));			
		});

	});

	testCase('started', function() {

		assertions('Zigbee initialization', function(done) {		    

			this.timeout(10000);
			zb.on('initialize', function(zb_device_type) {
				console.log('initialized');
				done();
			});
			zb.network_start();
		});

	});

	post(function() {
	});

});
