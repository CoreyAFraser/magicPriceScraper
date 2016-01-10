#!/usr/bin/env node

var app = require('../app');
var http = require('http');

app.set('port', 4444);

var server = app.listen(app.get('port'), "192.168.2.50", function() {
	console.log("Express server listening on port " + server.address().port);
})