define(['Action'], function(Action) {
	var entityId = -1;
	function Entity() { //TODO: remove this, scene should add Entities, but Entities shouldn't depend on Scene existing
		this.id = ++entityId;
		this.scenes = {};
		this.boundActions = [];
	}
	function setMethod (methodName, method) {
		Entity.prototype[methodName] = function() {
			if (!Object.getOwnPropertyNames(this.scenes).length) throw new Error("Entity must be registered to a Scene");
			return method.apply(this, arguments);
		}
	}
	setMethod('acceptInput', function(){
		for (var sceneName in this.scenes) {
			this.scenes[sceneName].pause();
		}
	});
	setMethod('broadcast', function(event, data) {
		for (var sceneName in this.scenes) {
			if (this.scenes[sceneName] === this.scenes[sceneName].gameCore.currentScene) {
				this.scenes[sceneName].emit(event, data, this);
			}
		}
	});
	setMethod('broadcastAll', function() {
		for (var sceneName in this.scenes) {
			this.scenes[sceneName].emit(event, data, this);
		}
	});
	Entity.prototype.on = function(){
		var action = new (Action.bind.apply(Action, [Action].concat([].slice.call(arguments))))();
		action.source = this;
		for (var sceneName in this.scenes) {
			this.scenes[sceneName].registerAction(action);
		}
		this.boundActions.push(action);
		return action.id;
	};
	setMethod('removeAction', function(actionId){
		for (var sceneName in this.scenes) {
			this.scenes[sceneName].removeAction(actionId);
		}
		for (var i = 0; i < this.boundActions.length; i++) {
			if (this.boundActions[i].id === actionId) {
				this.boundActions.splice(i,1);
				break;
			}
		}
	});
	setMethod('detachFromAll', function(){
		for (var i = this.boundActions.length - 1; i >= 0; i--) {
			for (var sceneName in this.scenes) {
				this.scenes[sceneName].removeAction(this.boundActions[i].id)
			}
		}
		for (var sceneName in this.scenes) {
			this.scenes[sceneName].remove(this);
		}
		this.boundActions.length = 0;
		this.scenes = {};
	});
	setMethod('detach', function(sceneName){
		if (sceneName in this.scenes) {
			this.scenes[sceneName].remove(this);
			delete this.scenes[sceneName];
		} else {
			throw new Error("Entity not registered to scene " + sceneName);
		}
	});
	return Entity;
});