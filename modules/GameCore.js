// define(['Scene','KeyBinding', 'TextRenderer', 'PlayerRenderer', 'Player', 'LevelLoader', 'data/playerrenderers', 'data/scenes', 'data/players', 'data/textrenderers', 'data/levels'], 
// 	function (Scene, KeyBinding, TextRenderer, PlayerRenderer, Player, LevelLoader, dataPlayerRenderers, dataScenes, dataPlayers, dataTextRenderers, dataLevels) {
// 	function GameCore(){
// 		window.addEventListener('keydown', function(event){
// 			switch(event.keyCode) {
// 				case 38:
// 					self.emitEvent('up'); break;
// 				case 40:
// 					self.emitEvent('down'); break;
// 				case 39:
// 					self.emitEvent('right'); break;
// 				case 37:
// 					self.emitEvent('left'); break;
// 				case 36:
// 					self.emitEvent('upleft'); break;
// 				case 33:
// 					self.emitEvent('upright'); break;
// 				case 35:
// 					self.emitEvent('downleft'); break;
// 				case 34:
// 					self.emitEvent('downright'); break;
// 				case 12:
// 					self.emitEvent('center'); break;
// 				default:
// 					self.emitEvent(String.fromCharCode(event.keyCode).toLowerCase());
// 			}
// 		});
// 		this.scenes = {};
// 		this.currentScene = null;
// 		var self = this;
// 		this.loadScenes(dataScenes);
// 		this.loadTextRenderers(dataTextRenderers);
// 		this.loadPlayerRenderers(dataPlayerRenderers);
// 		this.loadLevels(dataLevels);
// 		this.loadPlayers(dataPlayers);
// 	}
// 	GameCore.prototype.emitEvent = function(event) {
// 		if (this.currentScene) {
// 			this.currentScene.start(event);
// 		};
// 	}
// 	GameCore.prototype.start = function(sceneName) {
// 		if (sceneName in this.scenes){ 
// 			this.currentScene = this.scenes[sceneName];
// 			this.currentScene.load();
// 			return;
// 		}
// 		throw new Error("Could not find scene '" + sceneName + "'.");
// 	}
// 	GameCore.prototype.stop = function() {

// 	}
// 	GameCore.prototype.saveGame = function() {

// 	}
// 	GameCore.prototype.loadGame = function() {

// 	}
// 	GameCore.prototype.loadScenes = function(scenes) {
// 		for (var i = 0; i < scenes.length; i++) {
// 			var scene = new Scene(scenes[i].name, scenes[i].hooks);
// 			var keyBindings = [];
// 			for (var j = 0; j < scenes[i].keyBindings.length; j++) {
// 				var keyBinding = new KeyBinding();
// 				keyBinding.scene = scene;
// 				keyBinding.keyEvent = scenes[i].keyBindings[j].keyEvent;
// 				keyBinding.output = scenes[i].keyBindings[j].output;
// 				keyBinding.switchTo = scenes[i].keyBindings[j].switchTo;
// 				keyBindings.push(keyBinding);
// 			}
// 			scene.gameCore = this;
// 			scene.keyBindings = keyBindings;
// 			this.addScene(scene);
// 		}
// 	}
// 	GameCore.prototype.loadTextRenderers = function(textRenderers) {
// 		for (var i = 0; i < textRenderers.length; i++) {
// 			var tr = textRenderers[i];
// 			var textRenderer = new TextRenderer(tr.width, tr.height, tr.cellWidth, tr.cellHeight)
// 			for (var j = 0; j < tr.scenes.length; j++) {
// 				this.registerEntity(this.scenes[tr.scenes[j]], textRenderer);
// 			}
// 		}
// 	};
// 	GameCore.prototype.loadPlayerRenderers = function(playerRenderers) {
// 		for (var i = 0; i < playerRenderers.length; i++) {
// 			var tr = playerRenderers[i];
// 			var playerRenderer = new PlayerRenderer(tr.width, tr.height, tr.cellWidth, tr.cellHeight)
// 			for (var j = 0; j < tr.scenes.length; j++) {
// 				this.registerEntity(this.scenes[tr.scenes[j]], playerRenderer);
// 			}
// 		}
// 	};
// 	GameCore.prototype.loadPlayers = function(players) {
// 		for (var i = 0; i < players.length; i++) {
// 			var player = new Player();
// 			for (var j = 0; j < players[i].scenes.length; j++) {
// 				this.registerEntity(this.scenes[players[i].scenes[j]], player);
// 			}
// 		}
// 	}
// 	GameCore.prototype.loadLevels = function(levels) {
// 		var levelLoader = new LevelLoader();
// 		for (var i = 0; i < levels.length; i++) {
// 			var loadedLevel = levelLoader.load(levels[i]);
// 			var level = loadedLevel.level;
// 			var monsters = loadedLevel.monsters;
// 			for(var m = 0; m < levels[i].scenes.length; m++) {
// 				for (var j = 0; j < level.grid.length; j++) {
// 					for (var k = 0; k < level.grid[j].length; k++) {
// 						var tile = level.grid[j][k];
// 						this.registerEntity(this.scenes[levels[i].scenes[m]], tile);
// 					}
// 				}
// 				this.registerEntity(this.scenes[levels[i].scenes[m]], level);
// 				for (var j = 0; j < monsters.length; j++) {
// 					var monster = monsters[j];
// 					this.registerEntity(this.scenes[levels[i].scenes[m]], monster);
// 					monster.changePosition(monster.x, monster.y);
// 				}
// 			}

// 		}
// 	}
// 	GameCore.prototype.loadMonsters = function() {

// 	}
// 	GameCore.prototype.loadTiles = function() {

// 	}
// 	GameCore.prototype.addScene = function(scene) {
// 		this.scenes[scene.name] = scene;
// 		return scene.id;
// 	}
// 	GameCore.prototype.removeScene = function(id) {
// 		var scene = this.scenes[id];
// 		delete this.scenes[id];
// 		return scene;
// 	}
// 	GameCore.prototype.switchScene = function(sceneName) {
// 		var scene = this.currentScene;
// 		if (sceneName in this.scenes){ 
// 			this.currentScene = this.scenes[sceneName];
// 			return scene;
// 		}
// 		throw new Error("Could not find scene '" + sceneName + "'.");
// 	}
// 	GameCore.prototype.registerEntity = function(scene, entity) {
// 		entity.scenes[scene.name] = scene;
// 		scene.entities[entity.id] = entity;
// 		for (var i = 0; i < entity.boundActions.length; i++) {
// 			this.registerAction(scene, entity.boundActions[i]);
// 		}
// 		entity.broadcast('entity.create', {entity: entity});
// 		return entity.id;
// 	}
// 	GameCore.prototype.removeEntity = function(scene, entity) {
// 		delete entity.scenes[scene.name];
// 		delete scene.entities[entity.id];
// 		;
// 	}
// 	GameCore.prototype.registerAction = function(scene, action) {
// 		scene.boundActions[action.id] = action;
// 		scene.actionTree[action.name] = scene.actionTree[action.name] || [];
// 		scene.actionTree[action.name].push(action);
// 		return action.id;
// 	}
// 	GameCore.prototype.removeAction = function(scene, action) {
// 		for (var i = 0; i < scene.actionTree[action.name].length; i++) {
// 			if (scene.actionTree[action.name][i] === action) {
// 				scene.actionTree[action.name].splice(i,1);
// 				return action;
// 			}
// 		}		
// 		return undefined;
// 	}
// 	GameCore.prototype.exposeEntity = function() {

// 	}
// 	GameCore.prototype.shareEntity = function() {

// 	}

// 	return GameCore;
// });
define(['Player', 'loaders/SceneLoader', 'loaders/LevelLoader', 'data/scenes', 'data/levels'], function(Player, SceneLoader, LevelLoader, sceneData, levelData){
	function GameCore() {
		this.scenes = {}
		this.currentScene = null;
		this.loadScenes(new SceneLoader(sceneData));
		this.loadLevels(new LevelLoader(levelData));
		this.loadPlayerInto("Game");
		this.setScene('Game');
		this.listen();
	}
	GameCore.prototype.loadScenes = function(sceneLoader) {
		do {
			var sceneData = sceneLoader.loadNextScene();
			if (sceneData) {
				this.scenes[sceneData.sceneName] = sceneData.scene;
			}
		} while (sceneData);
	}
	GameCore.prototype.loadPlayerInto = function(sceneName) {
		var player = new Player();
		this.registerEntity(this.getScene(sceneName), player);
		var level = player.broadcast('get_level')[0];
		player.registerPositionableContext(level.positionableContext);
		player.setPosition(0,0);
		player.broadcast('draw_glyph', {
			glyph: player.glyph,
			color: player.glyphColor,
			backgroundColor: player.glyphBackground,
			x: player.getPosition().x,
			y: player.getPosition().y
		})
	}
	GameCore.prototype.loadLevels = function(levelLoader) {
		do {
			var levelData = levelLoader.loadNextLevel();
			if (levelData) {
				for (var i = 0; i < levelData.entities.length; i++) {
					for (var j = 0; j < levelData.sceneNames.length; j++) {
						this.registerEntity(this.getScene(levelData.sceneNames[j]), levelData.entities[i]);
						var entity = levelData.entities[i];
						if (entity.getPosition !== undefined) {
							entity.broadcast('draw_glyph', {
								glyph: entity.glyph,
								color: entity.glyphColor,
								backgroundColor: entity.glyphBackground,
								x: entity.getPosition().x,
								y: entity.getPosition().y
							});
						}
						
					}
				}
			}
		} while (levelData);
	}
	GameCore.prototype.setScene = function(sceneName) {
		this.currentScene = this.scenes[sceneName];
	}
	GameCore.prototype.startCurrentScene = function(trigger) {
		if (this.currentScene && this.currentScene.turnScheduler.eventBindings[trigger] !== undefined) {
			var invokedScene = this.currentScene.turnScheduler.invokeTrigger(trigger);
			if (invokedScene === this.currentScene) {
				while (this.currentScene.turnScheduler.nextHook());
			} else {
				this.setScene(invokedScene)
			}
		}
	}
	GameCore.prototype.listen = function() {
		var self = this;
		window.addEventListener('keydown', function(event){
			switch(event.keyCode) {
				case 38:
					self.startCurrentScene('up'); break;
				case 40:
					self.startCurrentScene('down'); break;
				case 39:
					self.startCurrentScene('right'); break;
				case 37:
					self.startCurrentScene('left'); break;
				case 36:
					self.startCurrentScene('upleft'); break;
				case 33:
					self.startCurrentScene('upright'); break;
				case 35:
					self.startCurrentScene('downleft'); break;
				case 34:
					self.startCurrentScene('downright'); break;
				case 12:
					self.startCurrentScene('center'); break;
				default:
					self.startCurrentScene(String.fromCharCode(event.keyCode).toLowerCase());
			}
		});
	}
	GameCore.prototype.registerEntity = function(scene, entity) {
		entity.addScene(scene);
	}
	GameCore.prototype.getScene = function (sceneName) {
		if (this.scenes[sceneName] === undefined) throw new Error("Scene " + sceneName + " not registered to Game Core.");
		return this.scenes[sceneName];
	}
	return GameCore;
})