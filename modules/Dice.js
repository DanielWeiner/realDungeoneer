define(function(){
	function Dice(dieString) { //something like "10d12 + 4", "2d10 + 5, drop lowest 3"
		this.count = 0;
		this.die = 0;
		this.modifier = 0;
		this.drop = 0;
		this.dropType = 'lowest';
		dieString && this.setDie(dieString);
	}
	Dice.prototype.setDie = function(dieString) {
		if (!dieString.match(/^\d+d\d+(?:\s*[+\-]\s*\d+)?(?:,\s*drop\s+(?:low|high)est\s+\d+)?$/)) throw new Error("Invalid die descriptor");
		var tokens = dieString.split(/\s*,\s*/); //split at comma, separate "12d42 + 6" from "drop lowest 39"
		var roll = tokens[0].replace(/\s+/g, '');
		var drop = tokens[1];
		
		var rollTokens = roll.replace(/(d|[+\-])/g, ' ').split(' ');
		this.count = +(rollTokens[0]);
		this.die = +(rollTokens[1]);
		if (rollTokens[2]) this.modifier = +(rollTokens[2]);
		if (roll.indexOf('-') !== -1) this.modifier *= -1;
		
		if (drop) {
			var dropTokens = drop.trim().split(/\s+/);
			this.drop = +(dropTokens[2]);
			this.dropType = dropTokens[1];
		}
	};
	Dice.prototype.toString = function() {
		var result = this.count+'d'+this.die;
		if (this.modifier) result += (this.modifier >= 0 ? '+' : '') + this.modifier;
		if (this.drop) result += ', drop ' + this.dropType + ' ' + this.drop;
		return result;
	};
	Dice.prototype.roll = function() {
		var rolls = [];
		for (var i = 0; i < this.count; i++) {
			rolls.push(~~(Math.random()*this.die) + 1);
		}
		rolls.sort();
		if (this.dropType === 'lowest') {
			rolls = rolls.slice(this.drop);
		} else {
			rolls = rolls.slice(0, -this.drop);
		}
		return rolls.reduce(function(a,b){return a+b},0) + this.modifier;
	};

	return Dice;
})