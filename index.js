var APP_ID = undefined;

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

	},
	HelpIntent: function(intent, session, response) {
		response.ask('Would you like to open or close the blinds?');
	}
};

function sendMessage(payload) {
	var url = config.host + '/api/v1/put?key=' + config.apiKey + '&clientId=' + config.clientId + '&payload=' + JSON.stringify(payload);
	request('GET', url);
}

exports.handler = function(event, context) {
	var echoBlinds = new EchoBlinds();
	echoBlinds.execute(event, context);
};
