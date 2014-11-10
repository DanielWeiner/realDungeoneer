define(['Level', 'LevelRenderer', 'Tile', 'Monster'], function (Level, LevelRenderer, Tile, Monster) {
	function LevelLoader(levelData, player) {
		var levelIndex = -1;
		this.loadNextLevel = function() {
			levelIndex++;
			if (levelData[levelIndex] !== undefined) {
				var entities = [];
				var levelDataItem = levelData[levelIndex];
				var level = new Level(levelDataItem.width, levelDataItem.height);
				entities.push(level);
				//TODO static variables on Renderer for cellWidth & cellHeight
				var renderer = new LevelRenderer(levelDataItem.width, levelDataItem.height,15,27);
				entities.push(renderer);

				//add tiles. TODO: generate dungeons
				for (var i = 0; i < levelDataItem.height; i++) {
					for (var j = 0; j < levelDataItem.width; j++) {
						var tile = new Tile();

						tile.registerPositionableContext(level.positionableContext);
						tile.setPosition(j,i);
						entities.push(tile);

						//add random Monsters
						if (Math.random() < (levelDataItem.monsterDensity/100)) {

							//todo: monster factory
							var monster= new Monster();
							monster.registerPositionableContext(level.positionableContext);
							monster.setPosition(j,i);
							entities.push(monster);
						}
					}
				}
				return {
					sceneNames: levelDataItem.scenes,
					entities: entities
				};
			} else {
				return null;
			}
		}
	}
	return LevelLoader;
})