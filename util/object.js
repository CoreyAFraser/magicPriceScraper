function setName(name) {
	var newName = name;
	newName = newName.split("(")[0];
	newName = newName.replace("-","").replace("Foil","")
		.replace("FOIL","").replace(/ +/g, " ").trim().toLowerCase();

	this.cardName = newName;
}

function setSet(set) {
	var newSet = set;
	newSet = newSet.replace(",","").replace(/ +/g, " ").replace("Singles", "").replace("Foil","").
					trim().toLowerCase();
	this.set = newSet;
}

module.exports = {
	card: function() {
		this.cardName = "";
		this.prices = [];
		this.setName = setName;

	},
	price: function() {
		this.mintPrice = "";
		this.playedPrice = "";
		this.quanity = "";
		this.foil = "";
		this.site = "";
		this.set = "";
		this.setSet = setSet;
	}
};