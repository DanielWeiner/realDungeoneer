define(function(){
	function Cursable() {
		this.addState('cursed');
		this.addState('blessed');
		this.addState('uncursed');
		this.setBUCStatus('uncursed');
	}
	Cursable.prototype.setBUCStatus = function(bucStatus) {
		if (["cursed", "uncursed", "blessed"].indexOf(bucStatus) === -1) throw new Error("Illegal BUC status");
		this.deactivateState("blessed");
		this.deactivateState("uncursed");
		this.deactivateState("cursed");
		this.activateState(bucStatus);
	};
	Cursable.prototype.onCursed = function(event, callback, duration, offset) {
		this.onState("cursed", event, callback, duration, offset);
	}
	Cursable.prototype.onUncursed = function (event, callback, duration, offset) {
		this.onState("uncursed", event, callback, duration, offset);
	}
	Cursable.prototype.onBlessed = function (event, callback, duration, offset) {
		this.onState("blessed", event,callback, duration, offset);
	}
	Cursable.prototype.offCursed = function(event, callback) {
		this.offState("cursed", event, callback);
	}
	Cursable.prototype.offUncursed = function (event, callback) {
		this.offState("uncursed", event, callback);
	}
	Cursable.prototype.offBlessed = function (event, callback) {
		this.offState("blessed", event,callback);
	}
	return Cursable;
})