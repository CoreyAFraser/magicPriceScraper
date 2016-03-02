var object = require('../util/object');

module.exports = {
	parse: function(html) {
		var cardsJson = [];
		var cards = [];
	    cards = html.split('\n');
			           
		var site = "SZ";
	    var index = 0;
	    var card;
	    var cardsIndex = [];

		for(var i = 0; i < cards.length-1; i++) {
			card = cards[i];
			var cardName = "";
			var cardJson = new object.card();
			var price = new object.price();

			var attributes = card.split('\t');
			if(attributes.length > 0) {
			    price.site = site;
			    price.setSet(attributes[0].trim());
			    cardJson.setName(attributes[1].trim());
			    cardName = cardJson.cardName;
			    if(attributes.length == 4) {
			        price.foil = "";
			        price.quanity = attributes[2].trim();
			        price.mintPrice = attributes[3].trim();
			    } else {
					price.foil = attributes[2].trim();
			        price.quanity = attributes[3].trim();
			        price.mintPrice = attributes[4].trim();
			    }

			    if(typeof cardsIndex[cardName] == 'undefined') {
			    	cardsIndex[cardName] = index;
			    	cardJson.prices[0] = price;
			    	cardsJson[index] = cardJson;
			    } else {
			    	cardJson = cardsJson[cardsIndex[cardName]];
			    	var ind = cardJson.prices.length;
			    	cardJson.prices[ind] = price;
			    	cardsJson[cardsIndex[cardName]] = cardJson;
			    }

				index = cardsJson.length;
			}
		}
		return cardsJson;        
	},
	url: function() {
		return 'http://shop.strikezoneonline.com/List/MagicBuyList.txt';
	}
};