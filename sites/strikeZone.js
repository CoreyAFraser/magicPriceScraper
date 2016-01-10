module.exports = {
	parse: function(html, cardsJson) {
		var cards = [];
	    cards = html.split('\n');
			           
		var site = "SZ";
	    var index = cardsJson.length;
	    var card;
	    var cardsIndex = [];

		for(var i = 0; i < cards.length-1; i++) {
			card = cards[i];
			var cardName = "";
			var cardJson = {cardName : "",
							prices : []};
			var price = { price : "", quanity : "", foil : "", site: "", set : ""};

			var attributes = card.split('\t');
			if(attributes.length > 0) {
			    price.site = site;
			    price.set = attributes[0].trim();
			    cardJson.cardName = cardName = attributes[1].trim();
			    if(attributes.length == 4) {
			        price.foil = "";
			        price.quanity = attributes[2].trim();
			        price.price = attributes[3].trim();
			    } else {
					price.foil = attributes[2].trim();
			        price.quanity = attributes[3].trim();
			        price.price = attributes[4].trim();
			    }

			    if(!cardsIndex[cardName]) {
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