define(['Entity'], function (Entity) {
	function Positionable () {
		this.handlers = [];
		this.isPositionable = true;
	}
	Positionable.prototype.onPosition = function(event,x,y,callback) {
		if (typeof x === 'function') {
			callback = x;
			x = this.x;
			y = this.y;
		}
		var newEvent = event + '.' + x + '.' + y;
		var self = this;
		this.handlers.push({
			event: event,
			callback: callback,
			actionId: self.on(newEvent, callback)
		});
	}
	Positionable.prototype.changePosition = function(x,y) {
		this.x = x;
		this.y = y;
		var self = this
		for (var i = 0; i < this.handlers.length; i++) {
			var newEvent = this.handlers[i].event + '.' + x + '.' + y;
			Entity.prototype.removeAction.call(this, this.handlers[i].actionId);
			this.handlers[i].actionId = this.on(newEvent, this.handlers[i].callback);
		}
	}
	Positionable.prototype.removeAction = function(actionId){
		Entity.prototype.removeAction.call(this, actionId);
		for (var i = 0; i < this.handlers.length; i++) {
			if (this.handlers.actionId === actionId) {
				this.handlers.splice(i,1);
				break;
			}
		}
	}

	return Positionable;
});