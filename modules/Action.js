define(function(){
	function Action(callback, duration, offset) {
		this.toBeDeleted = false;
		if (typeof callback !== 'function' || !(callback instanceof Function)) {
			throw new Error("callback must be a function.");
		}
		this.callback = callback;
		if (isNaN(duration) || duration === null) {
			this.duration = Infinity;
		} else {
			this.duration = Math.max(0,duration);
		}
		if (isNaN(offset) || offset === null) {
			this.offset = 0;
		} else {
			this.offset = Math.max(0,offset);
		}
	}
	Action.prototype.invoke = function(event, data) {
		var response;
		if (this.duration > 0 && this.offset === 0) {
			response = this.callback(event, data);
			this.duration--;
		} else if (this.offset > 0) {
			this.offset--;
		} 
		if (this.duration === 0 && this.offset === 0) {
			this.toBeDeleted = true;
		}
		return response;
	}
	return Action;
})