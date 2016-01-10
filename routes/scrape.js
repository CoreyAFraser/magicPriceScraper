var domain = require('domain');
var errDomain = domain.createDomain();

errDomain.on('error', function(err) {
	console.log((new Date).toUTCString(), ': Process uptime (s)', process.uptime());
	console.log(err.stack);
});

errDomain.run(function(){
	//=========================================Require Dependencies
	var express      = require('express');
	var app          = express();
	var router	     = express.Router();
	var dbHelper     = require('../helpers/dBHelper');
	var scraper      = require('../helpers/scraper');
	//=========================================Require Dependencies

	app.use('/', router);
	router.use(function(req,res,next) {
		req.headers['if-none-match'] = '';
		next();
	});

	router.get('/scrape', function(req, res) {
		dbHelper.clearDb();
		scraper.scrape();
	});
	module.exports = router;
});