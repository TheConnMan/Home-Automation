var APP_ID = undefined;

var OPEN_COMMANDS = ['open'];
var CLOSE_COMMANDS = ['close', 'shut'];

var AlexaSkill = require('./AlexaSkill');
var config = require('./config');
var request = require('sync-request');

var EchoBlinds = function() {
	AlexaSkill.call(this, APP_ID);
};

EchoBlinds.prototype = Object.create(AlexaSkill.prototype);
EchoBlinds.prototype.constructor = EchoBlinds;

EchoBlinds.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
	console.log('EchoBlinds onSessionStarted requestId: ' + sessionStartedRequest.requestId + ', sessionId: ' + session.sessionId);
};

EchoBlinds.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
	console.log('EchoBlinds onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId);
	var speechOutput = 'Welcome to Echo Blinds. What would you like to do?';
	response.ask(speechOutput);
};

EchoBlinds.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
	console.log('EchoBlinds onSessionEnded requestId: ' + sessionEndedRequest.requestId + ', sessionId: ' + session.sessionId);
};

EchoBlinds.prototype.intentHandlers = {
	EchoBlindsIntent: function(intent, session, response) {
		var action = intent.slots.action.value;
		var payload = createPayload(action);
		if (payload) {
			sendMessage(payload);
			response.tell('Message sent');
		} else {
			response.tell('Sorry, ' + action + ' is not a valid command');
		}
	},
	HelpIntent: function(intent, session, response) {
		response.ask('Would you like to open or close the blinds?');
	}
};

function createPayload(action) {
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

function sendMessage(payload) {
	var url = config.host + '/api/v1/put?key=' + config.apiKey + '&clientId=' + config.clientId + '&payload=' + encodeURIComponent(JSON.stringify(payload));
	var res = request('GET', url);
	console.log(res.getBody('utf8'));
}

exports.handler = function(event, context) {
	var echoBlinds = new EchoBlinds();
	echoBlinds.execute(event, context);
};
