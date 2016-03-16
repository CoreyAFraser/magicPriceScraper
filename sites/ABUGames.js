var object = require('../util/object');
var phantom = require('phantom');
var baseUrl = 'http://www.abugames.com/buylist.html';
var urls = [];
urls.push(baseUrl);

module.exports = {
	parse : function(html) {
		var beginIndex = 0;
		var endIndex = 0;

		beginIndex = html.indexOf('sideboxfill');

		while(html.indexOf('href="/set', beginIndex) != -1) {
			beginIndex = html.indexOf('href="/set', beginIndex)+6;
			endIndex = html.indexOf('"', beginIndex);

			link = baseUrl + html.substring(beginIndex, endIndex);
			console.log(link);
			urls.push(link);
			beginIndex = endIndex;
		}
		return urls;
	},
	urls : function() {
		return urls;
	}
};





/*module.exports = {
	parse: function() {
		var cardsJson = [];
		var links = [];
		var cardIndex = 0;
		var cardsIndex = [];

		function getCards(link) {
			beginIndex = 0;
			endIndex = 0;
			index = 0;
			setName = "!";
			pagesRemaining = true;
			foil = false;

			casper.start(link, function() {});

			casper.then(function(){
				while(pagesRemaining) {
					var text = document.getElementsByName('inventoryform')[0].innerHTML;

					if(setName.equals("!")) {
						beginIndex = text.indexOf("<td colspan=\"3\">",beginIndex);
						beginIndex = text.indexOf("<b ",beginIndex);
						beginIndex = text.indexOf(">",beginIndex)+1;
						endIndex = text.indexOf("<",beginIndex);
						setName = text.substring(beginIndex,endIndex);
						if(setName.contains("Foil")) {
							setName = setName.replace("Foil", "").trim();
							foil = true;
						}
						index = endIndex;
					}

					while((index = text.indexOf("<td class=\"small\">",index)) != -1) {
						var cardName = "";
						var card = new object.card();
						var price = new object.price();
						price.setSet(setName);
						price.setSite("ABU");
						
						if(foil) {
							price.foil = "Foil";
						} 
						
						beginIndex = text.indexOf("cardlink",index);
						beginIndex = text.indexOf(">",beginIndex)+1;
						endIndex = text.indexOf("<",beginIndex);
						card.setName(text.substring(beginIndex,endIndex));
						cardName = card.cardName;
						
						beginIndex = text.indexOf("small",endIndex);
						beginIndex = text.indexOf(">",beginIndex)+1;
						endIndex = text.indexOf("<",beginIndex);
						price.quantity = text.substring(beginIndex,endIndex).trim();
						
						beginIndex = text.indexOf("small",endIndex);
						beginIndex = text.indexOf(">",beginIndex)+1;
						endIndex = text.indexOf("<",beginIndex);
						price.mintPrice = text.substring(beginIndex,endIndex).replace("$","").trim();
						
						beginIndex = text.indexOf("small",endIndex);
						beginIndex = text.indexOf(">",beginIndex)+1;
						endIndex = text.indexOf("<",beginIndex);
						price.playedPrice = text.substring(beginIndex,endIndex).replace("$","").trim();
												
						index = endIndex;
						
						if(typeof cardsIndex[cardName] == 'undefined') {
					    	cardsIndex[cardName] = cardIndex;
					    	card.prices[0] = price;
					    	cardsJson[cardIndex] = cardJson;
					    } else {
					    	card = cardsJson[cardsIndex[cardName]];
					    	var priceIndex = card.prices.length;
					    	card.prices[priceIndex] = price;
					    	cardsJson[cardsIndex[cardName]] = cardJson;
					    }

						cardIndex = cardsJson.length;
					}
				
					pagesRemaining = false;
					if(text.indexOf('Next >') != -1) {
						pagesRemaining = true;
						this.clickLabel('Next >', 'a');
					}
				}
			});

			casper.run(function() {
				this.echo("Card Count: " + cardsJson.size);
			});
		};

		function getSetLinks() {
    		var links = document.querySelectorAll('.sidelink');
    		return Array.prototype.map.call(links, function(e) {
        		return e.getAttribute('href');
    		});
		};

		baseCasper.start(baseUrl, function() {
    		links = this.evaluate(getSetLinks);
		});

		baseCasper.run(function() {
			for(link in links) {
				console.log(link);
				getCards(link);
			}
			return cardsJson;
		});
	}
};*/