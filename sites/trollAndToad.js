var object = require('../util/object');

module.exports = {
	parse: function(html) {
		var cardsJson = [];
		var cards = [];
	    cards = html.split('tdrow');
			           
		var site = "TT";
	    var index = cardsJson.length;
	    var card;
	    var cardsIndex = [];

		for(var i = 0; i < cards.length-1; i++) {
			card = cards[i];
			var cardName = "";
			var cardJson = new object.card();
			var price = new object.price();
			var beginIndex;
			var endIndex;

			price.site = site;
				
			beginIndex = card.indexOf("<strong>");
			beginIndex = card.indexOf(">",beginIndex)+1;
			endIndex = card.indexOf("<",beginIndex);
			price.set = card.substring(beginIndex,endIndex).replace("Singles", "").replace("Foil","").trim();
				
			beginIndex = card.indexOf("<a",beginIndex);
			beginIndex = card.indexOf(">",beginIndex)+1;
			endIndex = card.indexOf("<",beginIndex);
			cardJson.setName(card.substring(beginIndex,endIndex).trim());
			cardName = cardJson.cardName;


			beginIndex = card.indexOf("<label",beginIndex);
			beginIndex = card.indexOf(">",beginIndex)+1;
			endIndex = card.indexOf("<",beginIndex);
			foil = card.substring(beginIndex,endIndex).trim();
			if(foil.indexOf("Foil") > -1) {
				price.foil = "Foil";
			} else {
				price.foil = "";
			}
				
			beginIndex = card.indexOf("<td",beginIndex);
			beginIndex = card.indexOf(">",beginIndex)+1;
			endIndex = card.indexOf("<",beginIndex);
			price.mintPrice = card.substring(beginIndex,endIndex).replace("$","").trim();
			price.playedPrice = "";
				
			beginIndex = card.indexOf("<td",beginIndex);
			beginIndex = card.indexOf(">",beginIndex)+1;
			endIndex = card.indexOf("<",beginIndex);
			price.quantity = card.substring(beginIndex,endIndex).trim();			

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
		return cardsJson;        
	},
	url: function() {
		return 'http://www.trollandtoad.com/buying3.php?Department=M';
	}
};