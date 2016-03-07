var APP_ID = undefined;

var OPEN_COMMANDS = ['open'];
var CLOSE_COMMANDS = ['close', 'shut'];

var AlexaSkill = require('./AlexaSkill');
var config = require('./config');
var http = require('http');

var HomeAutomation = function() {
	AlexaSkill.call(this, APP_ID);
};

HomeAutomation.prototype = Object.create(AlexaSkill.prototype);
HomeAutomation.prototype.constructor = HomeAutomation;

HomeAutomation.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
	console.log('HomeAutomation onSessionStarted requestId: ' + sessionStartedRequest.requestId + ', sessionId: ' + session.sessionId);
};

HomeAutomation.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
	console.log('HomeAutomation onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);
	var speechOutput = 'Welcome to Home Automation. What would you like to do?';
	response.ask(speechOutput);
};

HomeAutomation.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
	console.log('HomeAutomation onSessionEnded requestId: ' + sessionEndedRequest.requestId + ', sessionId: ' + session.sessionId);
};

HomeAutomation.prototype.intentHandlers = {
	BlindsIntent: function(intent, session, response) {
		var action = intent.slots.action.value;
		var payload = createBlindsPayload(action);
		submitPayload(payload, response, action);
	},
	HelpIntent: function(intent, session, response) {
		response.ask('What home automation task would you like to do?');
	}
};

function createBlindsPayload(action) {
	if (OPEN_COMMANDS.indexOf(action) !== -1) {
		return {
			open: true
		};
	} else if (CLOSE_COMMANDS.indexOf(action) !== -1) {
		return {
			open: false
		};
	}
}

function submitPayload(payload, response, action) {
	if (payload) {
		sendMessage(payload, function() {
			response.tell('Ok');
		});
	} else {
		response.tell('Sorry, ' + action + ' is not a valid command');
	}
}

function sendMessage(payload, fn) {
	var payloadString = JSON.stringify(payload);
	console.log('Sending payload: ' + payloadString);
	var options = {
		host: config.host,
		port: 3000,
		path: '/api/put?key=' + config.apiKey + '&clientId=' + config.clientId + '&payload=' + encodeURIComponent(payloadString)
	};
	http.get(options, function(res) {
		console.log(res.statusCode);
		fn();
	});
}

exports.handler = function(event, context) {
	var homeAutomation = new HomeAutomation();
	homeAutomation.execute(event, context);
};
