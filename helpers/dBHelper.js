var MongoClient  = require('mongodb').MongoClient;
var assert 		 = require('assert');
var globalConfig = require('../configs/globalConfig.json');

module.exports = {
	clearDb: function(res) {
		MongoClient.connect(globalConfig.mongoDb.url, function(err, db) {
			assert.equal(null, err);
			console.log("Connected correctly to server");
			var collection = db.collection(globalConfig.mongoDb.name);
			collection.removeMany({}, 
				function(err, result) {
					console.log("Cleared DB");
					if(res) {
						res.send("Cleared DB");
					}
				    db.close();
			});
		});
	}
};