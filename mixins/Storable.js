define(function () {
	function Storable() {
		this.storableContext = null;
	}
	Storable.prototype.registerStorableContext = function(context) {
		this.storableContext = context;
		this.storableContext.register(this);
	};
	var checkContext = function() {
		if (!this.storableContext) throw new Error("Entity not registered to StorableContext.");
	}
	Storable.prototype.getLetterIndex  = function() {
		checkContext.call(this);
		return this.storableContext.getPosition(this.id);
	}
	Storable.prototype.setLetterIndex = function(letterIndex) {
		checkContext.call(this);
		this.storableContext.setPosition(this.id,letterIndex);
	}
	Storable.prototype.store = function() {
		checkContext.call(this);
		this.storableContext.setPosition(this.id,letterIndex);
	}
	Storable.prototype.unregisterStorableContext = function() {
		checkContext.call(this);
		var context = this.storableContext;
		context.unregister(this.id);
		this.storableContext = null;
		return context;
	}
	Storable.prototype.broadcastAtLetterIndex = function(letterIndex, event, data) {
		checkContext.call(this);
		return this.storableContext.broadcastAtLetterIndex(x,y,event,data);
	}
});