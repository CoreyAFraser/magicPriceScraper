var domain = require('domain');
var errDomain = domain.createDomain();

errDomain.on('error', function(err) {
	console.log((new Date).toUTCString(), ': Process uptime (s)', process.uptime());
	console.log(err.stack);
});

errDomain.run(function(){
	//=========================================Require Dependencies
	var express      = require('express');
	var request      = require('request');
	var cheerio      = require('cheerio');
	var app          = express();
	var router	     = express.Router();
	var async	     = require('async');
	var MongoClient  = require('mongodb').MongoClient;
	var assert 		 = require('assert');
	var globalConfig = require('../configs/globalConfig.json');
	var scraper      = require('../helpers/scraper');
	//=========================================Require Dependencies

	//=========================================Require Sites
	var strikeZone = require('../sites/strikeZone');
	//=========================================Require Sites

	app.use('/', router);
	router.use(function(req,res,next) {
		req.headers['if-none-match'] = '';
		next();
	});

	function searchDB(req, res) {
		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
		 	assert.equal(null, err);
		  	console.log("Connected correctly to server to search");

		  	var collection = db.collection(globalConfig.mongoDb.name);
			collection.find({ _id : req.query.cardName }).toArray(function(err, docs) {
				if(docs.length == 0) {
			  		collection.find({ _id : new RegExp(req.query.cardName, "i") }).toArray(function(err, docs) {
	    				if(!res.headersSent) { res.send(docs); };
	  				});
		  		} else {
					if(!res.headersSent) { res.send(docs); };
		  		}
		  	});
		});
	};

	router.get('/search', function(req, res){
		var currentTime = new Date().getTime();
		var lastScrapeTime = scraper.getLastScrapeTime();
		console.log("*** Last Scrape Time *** " + lastScrapeTime);
		if(lastScrapeTime == "UnSet" || ((currentTime - lastScrapeTime) > (1000 * 60 * 60 * 24))) {
			console.log("Scraping then searching");
			scraper.scrape(searchDB, req, res);
		} else {
			console.log("Searching");
			searchDB(req, res);
		}
	});
	
	module.exports = router;
});