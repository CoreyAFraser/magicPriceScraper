var request      = require('request');
var async	     = require('async');
var MongoClient  = require('mongodb').MongoClient;
var assert 		 = require('assert');
var globalConfig = require('../configs/globalConfig.json');

//=========================================Require Sites
var strikeZone = require('../sites/strikeZone');
var trollAndToad = require('../sites/trollAndToad');
//=========================================Require Sites

var lastScrapeTime = "UnSet";

function mergeResults(results) {
	var cardsJson = [];
	var cardsIndex = [];
	var index = 0;
	for(var i = 0;i < results.length; i++) {
		var result = results[i]
		for(var j = 0;j < result.length; j++) {
			var name = result[j].cardName;
			if(!cardsIndex[name]) {
				cardsIndex[name] = index;
				cardsJson[index] = result[j];
			} else {
				var cardJson = cardsJson[cardsIndex[name]];
				var ind = cardJson.prices.length;
				for(var k = 0; k < result[j].prices.length; k++) {
					cardJson.prices[ind + k] = result[j].prices[k];
				}

				cardsJson[cardsIndex[name]] = cardJson;
			}

			index = cardsJson.length;
		}
	}
	return cardsJson;
}

module.exports = {
	scrape: function(passedCallback, passedReq, passedRes) {
		console.log("Scraping Begins");
	  	async.parallel([
		  	function(callback) {
		  		console.log("  StrikeZone Begins");
		  		url = strikeZone.url();
				request(url, function(error, response, html){
					if(error) callback(error, response);

					results = strikeZone.parse(html);
					console.log("  StrikeZone Ends");
					callback(null, results);
				})
		  	},
		  	function(callback) {
		  		console.log("    Troll And Toad Begins");
		  		url = trollAndToad.url();
				request(url, function(error, response, html){
					if(error) callback(error, response);

					results = trollAndToad.parse(html);
					console.log("    Troll And Toad Ends");
					callback(null, results);
				})
		  	}
	  	],
	  	function(error, results, next) {
	  		if(error) return next(error);
	  		var cardsJson = [];
	  		cardsJson = mergeResults(results);
	  		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			 	assert.equal(null, err);
			  	console.log("Connected correctly to server to write to DB");
			 	var collection = db.collection(globalConfig.mongoDb.name);
				collection.insertMany(
				    cardsJson, 
				    function(err, result) {
				    	assert.equal(cardsJson.length, result.insertedCount);
				    	db.close();
				    	lastScrapeTime = new Date().getTime();
						console.log("Scraping Ends");
						if(passedCallback) {
							passedCallback(passedReq, passedRes);
						} else {
							passedRes.send(cardsJson);
						}
				  	});
			});
	  	});
	},
	getLastScrapeTime: function() {
		return lastScrapeTime;
	},
	resetLastScrapeTime: function() {
		lastScrapeTime = "UnSet";
	}
};