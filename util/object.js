function setName(name) {
	var newName = name;
	newName = newName.replace("-","").replace("Foil","").replace("FOIL","").trim().toLowerCase()
	this.cardName = newName;
}

function setSet(set) {
	var newSet = set;
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
		this.setSet = setSet
	}
};