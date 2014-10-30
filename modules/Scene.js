define(function() {
	var sceneId = -1;
	function Scene(name, hooks, keyBindings) {
		this.name = name; 
		this.hooks = hooks;
		this.gameCore = null;
		this.keyBindings = keyBindings || []; //TODO: support KeyBinding object
		this.currentHook = 0;
		this.hookTriggers = {};
		this.actionTree = {};
		this.entities = {};
		this.paused = true;
		this.id = ++sceneId;
		this.boundActions = {};
		this.expiredActions = [];
		this.registerAction = function(action) {
			return this.gameCore.registerAction(this, action);
		};
		this.add = function(entity) {
			return this.gameCore.registerEntity(this, entity);
		};
		this.remove = function(entity) {
			return this.gameCore.removeEntity(this, entity);
		}
	}

	//the hook cycle begins. If a keybinding event is passed in, then it's automatically added to the first hook's actions. 
	Scene.prototype.load = function() {
		this.emit('scene.load');
	}
	Scene.prototype.unload = function() {
		this.emit('scene.unload');
	}
	Scene.prototype.start = function(event) {
		console.time('turn');
		this.currentHook = 0;
		this.paused = false;
		for (var i = 0; i < this.keyBindings.length; i++) {
			if (this.keyBindings[i].keyEvent === event) {
				this.registerTrigger(this.hooks[0], this.keyBindings[i].output);	
				this.hook(this.hooks[0]);
				if (this.keyBindings[i].switchTo) {
					this.gameCore.switchScene(keyBindings[i])
				}
				return;
			}
		}
	}

	//go to the next hook, then trigger all the actions of that hook.
	//TODO: give triggers priority

	Scene.prototype.hook = function(hook) {
		var self  = this;
		this.emit(hook);
		if (hook in this.hookTriggers) {
			this.hookTriggers[hook].forEach(function(trigger) {
				self.emit(trigger);
			});
		}
		if (!this.paused) {
			this.resume();
		}
	};

	Scene.prototype.resume = function() {
		if (this.currentHook < this.hooks.length - 1) {
			this.hook(this.hooks[++this.currentHook]);
		} else {
			this.end();
		}
	};

	Scene.prototype.end = function(tick) {
		this.currentHook = this.hooks.length - 1;
		this.hookTriggers = {};
		this.removeExpiredActions();
		console.timeEnd('turn');
	};

	Scene.prototype.pause = function() {
		this.paused = true;
	};
	Scene.prototype.registerTrigger = function(hook,triggerName) {
		if (this.hooks.indexOf(hook) !== -1) {
			this.hookTriggers[hook] = this.hookTriggers[hook] || [];
			this.hookTriggers[hook].push(triggerName);
		} else {
			throw new Error("hook " + hook + " not registered for scene " + this.name + ".");
		}
	};
	Scene.prototype.emit = function(triggerName, data, source) {
		function createActionNameArray(name) {
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
		var actionNames = createActionNameArray(triggerName);
		for (var i = 0; i <  actionNames.length; i++) {
			if (this.actionTree[actionNames[i]]) {
				for (var j = 0; j < this.actionTree[actionNames[i]].length; j++) {
					var action = this.actionTree[actionNames[i]][j];
					if (action.offset === 0 && action.duration > 0) {
						action.duration--;
						if (source !== action.source) {
							action.callback(triggerName, data, source);
						}
					} else if (action.duration > 0) {
						action.offset--;
					} else {
						this.expiredActions.push(action);
					}
				}
			}
		}
	};
	Scene.prototype.removeAction = function(actionId) {
		var action = this.boundActions[actionId];
		delete this.boundActions[actionId];
		return this.gameCore.removeAction(this, action);
	};
	Scene.prototype.removeExpiredActions = function() {
		for (var i = 0; i < this.expiredActions.length; i++) {
			var action = this.expiredActions[i];
			this.removeAction(action);
		}
		this.expiredActions.length = 0;
	};
	Scene.prototype.exposeEntity = function() {

	}
	Scene.prototype.shareEntities = function() {
		
	}
	return Scene;
})