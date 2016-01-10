var request      = require('request');
var async	     = require('async');
var MongoClient  = require('mongodb').MongoClient;
var assert 		 = require('assert');
var globalConfig = require('../configs/globalConfig.json');

//=========================================Require Sites
var strikeZone = require('../sites/strikeZone');
//=========================================Require Sites

var lastScrapeTime = "UnSet";

module.exports = {
	scrape: function(callback) {
		console.log("Scraping Begins");
		var cardsJson = [];
	  	async.parallel([
		  	function(callback) {
		  		url = strikeZone.url();
				request(url, function(error, response, html){
					if(error) callback(error, response);

					results = strikeZone.parse(html, cardsJson);
					callback(null, results);
				})
		  	}
	  	],
	  	function(error, results) {
	  		if(error) return next(error);

	  		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			 	assert.equal(null, err);
			  	console.log("Connected correctly to server");
			 	var collection = db.collection(globalConfig.mongoDb.name);
				collection.insertMany(
				    cardsJson, 
				    function(err, result) {
				    	assert.equal(cardsJson.length, result.insertedCount);
				    	db.close();
				  	});
			});

	  		//if(!res.headersSent) res.send(cardsJson);
	  		}
	  	);
	  	lastScrapeTime = new Date().getTime();
	  	console.log("Scraping Ends");
	  	if(callback) {
	  		callback();
	  	}
	},
	getLastScrapeTime: function() {
		return lastScrapeTime;
	}
};