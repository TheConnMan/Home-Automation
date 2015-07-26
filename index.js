var APP_ID = undefined;

var OPEN_COMMANDS = ['open'];
var CLOSE_COMMANDS = ['close', 'shut'];

var AlexaSkill = require('./AlexaSkill');
var config = require('./config');
var request = require('sync-request');

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
		sendMessage(payload);
		response.tell('Message sent');
	} else {
		response.tell('Sorry, ' + action + ' is not a valid command');
	}
}

function sendMessage(payload) {
	var payloadString = JSON.stringify(payload);
	console.log('Sending payload: ' + payloadString);
	var url = config.host + '/api/v1/put?key=' + config.apiKey + '&clientId=' + config.clientId + '&payload=' + encodeURIComponent(payloadString);
	var res = request('GET', url);
	console.log(res.getBody('utf8'));
}

exports.handler = function(event, context) {
	var homeAutomation = new HomeAutomation();
	homeAutomation.execute(event, context);
};
