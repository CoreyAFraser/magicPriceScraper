var domain = require('domain');
var errDomain = domain.createDomain();

errDomain.on('error', function(err) {
	console.log('Everything is broken forever');
	console.log((new Date).toUTCString(), ': Process uptime (s)', process.uptime());
	console.log(err.stack);
});

errDomain.run(function(){
	//=========================================Require Dependencies
	var express      = require('express');
	var fs 		     = require('fs');
	var request      = require('request');
	var cheerio      = require('cheerio');
	var app          = express();
	var path 	     = require('path');
	var async	     = require('async');
	var logger	     = require('morgan');
	var compress     = require('compression');
	var bodyParser   = require('body-parser');
	var MongoClient  = require('mongodb').MongoClient;
	var assert 		 = require('assert');
	var scrape	     = require('./routes/scrape');
	var search	     = require('./routes/search');
	var globalConfig = require('./configs/globalConfig.json');
	var dbHelper     = require('./helpers/dBHelper');
	var scraper      = require('./helpers/scraper');
	//=========================================Require Dependencies

	function parallel(middlewares) {
		return function(req, res, next) {
			async.each(middlewares, function(mv, cb) {
				mv(req, res, cb);
			}, next);
		};
	}

	var views = './views/';
	app.get('/', function(req, res){
		res.sendfile(views + 'index.html');
	});

	app.get('/clearDb', function(req, res){
		dbHelper.clearDb(res);
	});

	app.use(parallel([
		logger('combined'),
		compress(),
		bodyParser.json(),
		scrape,
		search,

	]));

	//setInterval(function() { scraper.scrape(); }, 1000 * 60 * 60 * 24);

	module.exports = app;
});