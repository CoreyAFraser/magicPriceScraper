var request      = require('request');
var async	     = require('async');
var MongoClient  = require('mongodb').MongoClient;
var assert 		 = require('assert');
var globalConfig = require('../configs/globalConfig.json');
var object 		 = require('../util/object');
var dbHelper     = require('../helpers/dBHelper');

//=========================================Require Sites
var strikeZone = require('../sites/strikeZone');
var trollAndToad = require('../sites/trollAndToad');
var abuGames = require('../sites/ABUGames');
//=========================================Require Sites

function mergeResults(results) {
	var cardsJson = [];
	var cardsIndex = [];
	var index = 0;
	for(var i = 0;i < results.length; i++) {
		var result = results[i]
		if(result != null) {
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
		  	}/*,
		  	function(callback) {
		  		console.log("        ABU Begins");
		  		urls = abuGames.urls();
		  		i = 0;
		  		currentLink = "";
		  		while(i < urls.length) {
		  			if(currentLink != urls[i]) {
		  				currentLink = urls[i];
		  				console.log(currentLink);
						request(urls[i], function(error, response, html){
							if(error) callback(error, response);

							urls = abuGames.parse(html);
							console.log("        ABU Page " + (i+1) + " " + urls[i] + " ends " + urls.length);
							callback(null, null);
							i++;
						});
					} else {
						setTimeout(function() {}, 200)
					}
				}

				insert card as read, have dB helper query, merge and update the dB for each entry


		  	}*/
	  	],
	  	function(error, results, next) {
	  		if(error) return next(error);
	  		var cardsJson = [];
	  		cardsJson = mergeResults(results);

			MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			 	assert.equal(null, err);
			  	console.log("Connected correctly to server to write to DB");
			 	var collection = db.collection(globalConfig.mongoDb.name);

			 	currentTime = new Date().getTime();

				collection.insert(
				    { _id : "lastScrapeTime",
				      "name" : "lastScrapeTime",
				      "time" : currentTime },
				 	 function(err, result, upserted) {
					}
				);
			});

	  		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			 	assert.equal(null, err);
			  	console.log("Connected correctly to server to write to DB");
			 	var collection = db.collection(globalConfig.mongoDb.name);
				collection.insertMany(
				    cardsJson, 
				    function(err, result) {
				    	assert.equal(err, undefined);
				    	assert.equal(cardsJson.length, result.insertedCount);
				    	db.close();
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
	decideToScrapeOrSearch: function(scrape, searchDB, req, res) {
		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
		 	assert.equal(null, err);
		  	var collection = db.collection(globalConfig.mongoDb.name);
			collection.find({ "name" : "lastScrapeTime" }).toArray(function(err, docs) {
				if(docs.length == 0 || docs[0].time == undefined) {
			  		dbHelper.clearDbWithCallback(scrape, searchDB, req, res);
		  		} else {
		  			currentTime = new Date().getTime();
		  			lastScrapeTime = docs[0].time;
					if(lastScrapeTime == undefined || ((currentTime - lastScrapeTime) > (1000 * 60 * 60 * 24))) {
						console.log("Scraping then searching");
						dbHelper.clearDbWithCallback(scrape, searchDB, req, res);
					} else {
						console.log("Searching");
						searchDB(req, res);
					}
		  		}
		  	});
		});
	},
	resetLastScrapeTime: function() {
		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			assert.equal(null, err);
			var lastScrapeTime = new object.lastScrapeTime();
			lastScrapeTime.time = "Unset";

			collection.insert(
				lastScrapeTime, 
				function(err, result) {
				   	assert.equal(lastScrapeTime.length, result.insertedCount);
				    db.close();
				});
		});
	}
};