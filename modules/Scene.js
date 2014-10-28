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
		this.registerAction = function(action) {
			return this.gameCore.registerAction(this, action);
		};
		this.add = function(entity) {
			return this.gameCore.registerEntity(this, entity);
		};
		this.remove = function(entity) {
			return this.gameCore.remove(entity);
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
			var splitName = triggerName.split('.');
			var resultArr = [];
			var currElement = '';
			for (var i = 0; i < splitName.length; i++) {
				currElement += (currElement? '.' : '') + splitName[i];
				resultArr.unshift(currElement);
			}
			return resultArr;
		}
		var actionNames = createActionNameArray(triggerName.name);
		for (var i = 0; i <  actionNames.length; i++) {
			if (this.actionTree[actionNames[i]]) {
				this.actionTree[actionNames[i]].forEach(function(action){
					if (action.offset === 0 && action.duration > 0) {
						action.duration--;
						if (source !== action.source) {
							action.callback(actionNames[i], data, source);
						}
					} else {
						action.offset--;
					}
				});
			}
		}
	};
	Scene.prototype.removeAction = function(actionId) {
		var action;
		for (var actionName in this.actionTree) {
			for (var i = 0; i < this.actionTree[actionName].length; i++) {
				if (this.actionTree[actionName][i].id === actionId) {
					action = this.actionTree[actionName][i];
					this.actionTree[actionName].splice(i,1);
					break;
				}
			}
			if (action) break;
		}
	};
	Scene.prototype.removeExpiredActions = function() {
		for (var actionName in this.actionTree) {
			for (var i = this.actionTree[actionName].length - 1; i >=0; i--) {
				var action = this.actionTree[actionName][i];
				if (action.duration <= 0) {
					this.actionTree[actionName].splice(i,1);
				}
			}
		}
	};
	Scene.prototype.exposeEntity = function() {

	}
	Scene.prototype.shareEntities = function() {
		
	}
	return Scene;
})