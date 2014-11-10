define(function () {

	//TODO: pass positonableContext into postionable (dependency injection)
	function Positionable() {
		this.positionableContext = null;
	}
	Positionable.prototype.registerPositionableContext = function(context) {
		this.positionableContext = context;
		this.positionableContext.register(this);
	};
	var checkContext = function() {
		if (!this.positionableContext) throw new Error("Entity not registered to PositionableContext.");
	}
	Positionable.prototype.getPosition = function () {
		checkContext.call(this);
		return this.positionableContext.getPosition(this.id);
	};
	Positionable.prototype.setPosition = function (x,y) {
		checkContext.call(this);
		this.positionableContext.setPosition(this.id, x, y);
	};
	Positionable.prototype.unregisterPositionableContext = function () {
		checkContext.call(this);
		var context = this.positionableContext;
		context.unregister(this.id);
		this.positionableContext = null;
		return context;
	};
	Positionable.prototype.broadcastAtCoords = function (x,y,event,data) {
		checkContext.call(this);
		return this.positionableContext.broadcastAtCoords(x,y,event,data);
	};
	return Positionable;
})