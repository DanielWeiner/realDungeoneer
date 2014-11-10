define(function() {
	function createEventNameArray(name) {
		if (name === '') return [];
		var splitName = name.split('.');
		var resultArr = [];
		var currElement = '';
		for (var i = 0; i < splitName.length; i++) {
			currElement += (currElement? '.' : '') + splitName[i];
			resultArr.unshift(currElement);
		}
		return resultArr;
	}

	var sceneId = -1;
	function Scene(turnScheduler) {
		this.events = {};
		this.id = ++sceneId;
		this.turnScheduler = turnScheduler;
	}
	Scene.prototype.setName = function(name) {
		this.name = name;
	}
	Scene.prototype.addSubscriber = function (event, entity) {
		this.events[event] = this.events[event] || [];
		for (var i = 0; i < this.events[event].length; i++) {
			if (this.events[event][i] === entity) return;
		}
		if (this.events[event].indexOf(entity) === -1) {
			this.events[event].push(entity);
		}	
	};
	Scene.prototype.removeSubscriber = function (event, entity) {
		if (this.events[event] !== undefined) {
			for (var i = this.events[event].length - 1; i >= 0; i--) {
				if (this.events[event][i] === entity) {
					this.events[event].splice(i,1);
					break;
				}
			}
		}
	};
	Scene.prototype.broadcast = function (event, data) {
		var responses = [];
		var eventNameArray = createEventNameArray(event);
		for (var i = 0; i < eventNameArray.length; i++) {
			var eventName = eventNameArray[i];
			if (this.events[eventName] !== undefined) {
				for (var j = 0; j < this.events[eventName].length; j++) {
					responses = responses.concat(this.events[eventName][j].notify(eventName, event, data));
				}
			}
		}
		if (event !== '*') {
			if (this.events['*'] !== undefined) {
				for (var i = 0; i < this.events[i].length; i++) {
					responses = responses.concat(this.events['*'][i].notify(eventName, event,data));
				}
			}
		}
		return responses;
	};
	Scene.prototype.getTurnScheduler = function() {
		return this.turnScheduler;
	}
	return Scene;
})