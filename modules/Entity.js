define(['Action'], function(Action) {
	var entityId = -1;
	function Entity() {
		this.states = {}
		this.scenes = {};
		this.activeStates = [];
		this.id = ++entityId;
		this.addState('always');
		this.activateState('always');
	}
	Entity.prototype.addState = function (stateName) {
		//TODO: give states complements, so that if you turn off one state, its complement turns on, and vice-versa. like blind <--> can see
		if (this.states[stateName] === undefined) {
			this.states[stateName] = {};
		}
	}
	Entity.prototype.activateState = function (stateName)  {
		if (this.activeStates.indexOf(stateName) === -1) {
			this.activeStates.push(stateName);
		}
	}
	Entity.prototype.deactivateState = function (stateName)  {
		var stateIdx = this.activeStates.indexOf(stateName);
		if (stateIdx !== -1) {
			this.activeStates.splice(stateIdx, -1);
		}
	}
	Entity.prototype.onState = function (stateName, event, callback, duration, offset) {
		if (this.states[stateName] !== undefined) {
			var state = this.states[stateName];
			state[event] = state[event] || [];

			//we want the "this" context to  refer to the caller always. Why would it be called on anyone else?
			//TODO: I see that call and apply are way faster than bind. Maybe change this?
			state[event].push(new Action(callback.bind(this), duration, offset));
			for (var sceneName in this.scenes) {
				this.scenes[sceneName].addSubscriber(event, this);
			}
		}
	}
	Entity.prototype.offState = function (stateName, event, callback) {
		if (this.states[stateName] !== undefined) {
			var state = this.states[stateName];
			//remove callback from event in this states
			if (state[event] !== undefined) {
				for (var i = state[event].length - 1; i >=0; i--) {
					if (state[event][i].callback === callback) {
						state[event].splice(i);
					}
				}
			}
			//check if event has handlers in any state
			for (var stateName in this.states) {
				state = this.states[stateName];
				if (state[event] && state[event].length > 0) {
					return;
				}
			}
			//if not, remove this entity from this event in all scenes
			for (var sceneName in this.scenes) {
				this.scenes[sceneName].removeSubscriber(event, this);
			}
		}
	}
	Entity.prototype.on = function (event, callback, duration, offset) {
		this.onState('always', event, callback, duration, offset);
	};
	Entity.prototype.off = function(event, callback) {
		this.offState('always', event, callback);
	};
	Entity.prototype.addScene = function (scene) {
		this.scenes[scene.name] = scene;

		for (var stateName in this.states) {
			var state = this.states[stateName];
			for (var event in state) {
				scene.addSubscriber(event, this);
			}
		}
		return scene.id;
	};
	Entity.prototype.removeScene = function (sceneName) {
		var scene = this.scenes[sceneName];
		for (var stateName in this.states) {
			var state = this.states[stateName];
			for (var event in state) {

				scene.removeSubscriber(event, this);
			}
		}
		delete this.scenes[sceneName];
		return scene;
	};
	Entity.prototype.notify = function (event, originalEvent, data) {
		var responses = [];
		var toOff = [];
		for (var i = 0; i < this.activeStates.length; i++) {
			var currentState = this.activeStates[i];
			if (this.states[currentState][event] !== undefined) {
				for (var j = this.states[currentState][event].length - 1; j >= 0 ; j--) {
					var action = this.states[currentState][event][j];
					var response = action.invoke(originalEvent, data);
					if (action.toBeDeleted) {
						toOff.push({
							state: currentState,
							callback: action.callback,
							event: originalEvent
						});
					}
					if (response !== undefined) responses.push(response);
				}
			}
		}
		for (var i = 0; i < toOff.length; i++) {
			this.offState(toOff[i].state, toOff[i].originalEvent, toOff[i].callback);
		}
		return responses;
	};
	Entity.prototype.broadcast = function(event, data) {
		for (var name in this.scenes) {
			return this.scenes[name].broadcast(event, data);
		}
	};
	return Entity;
});