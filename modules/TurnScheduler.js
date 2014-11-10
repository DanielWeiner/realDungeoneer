define(function () {
	function TurnScheduler() {
		this.hooks = [];
		this.hookIndex =  -1;
		this.eventBindings = {};
		this.scene = null;
	}
	TurnScheduler.prototype.setScene = function (scene) {
			this.scene = scene;
	}
	TurnScheduler.prototype.addHook = function (hookName) {
		this.hooks.push(hookName);
		return this.hooks.length - 1;
	}
	TurnScheduler.prototype.addTrigger = function (triggerName, event, switchTo) {
		this.eventBindings[triggerName] = {
			event: event,
			switchTo: switchTo
		};
	}
	TurnScheduler.prototype.invokeTrigger = function(triggerName) {
		if (this.eventBindings[triggerName] !== undefined) {
			this.nextHook();
			this.emit(this.eventBindings[triggerName].event);
			return this.eventBindings[triggerName].switchTo || this.scene;
		} 
		return this.scene; 
	}
	TurnScheduler.prototype.removeHook = function(hookIndex) {
		this.hooks.splice(this.hookIndex, 1);
	}
	TurnScheduler.prototype.nextHook = function() {
		if (this.hookIndex < this.hooks.length - 1) {
			this.hookIndex++;
			this.emit(this.hooks[this.hookIndex]);
			return true;
		} else {
			this.hookIndex = -1;
			return false;
		}
	}
	TurnScheduler.prototype.emit = function(eventName) {
		this.scene.broadcast(eventName);
	}
	return TurnScheduler;
})