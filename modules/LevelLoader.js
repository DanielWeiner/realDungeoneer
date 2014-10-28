define(['Level','Tile', 'Monster', 'data/tiles'], function (Level,Tile, Monster, dataTiles){
	function LevelLoader() {}
	LevelLoader.prototype.load = function(input) {
		var level = new Level(input.width, input.height)
		if (input.type === 'random') {
			this.createRandom(level);
		} else {
			this.createFromArray(level, input.tiles);
		}
		var monsters = this.populateMonsters(level, input.monsterDensity);
		return {
			level: level,
			monsters: monsters
		};
	}
	LevelLoader.prototype.createRandom = function(level) {
		for (var i = 0; i < level.height; i++) {
			var row = [];
			for (var j = 0; j < level.width; j++) {
				var tile = new Tile(j, i);
				if (Math.random() > .99) {
					tile.passable = false;
					tile.textSymbol = '#';
				} else {
					tile.textSymbol = '.';
				}
				row.push(tile);
			}
			level.grid.push(row);
		}
	}
	LevelLoader.prototype.createFromArray = function(level, tileArray) {
		for (var i = 0; i < level.height; i++) {
			var row = [];
			for (var j = 0; j < level.width; j++) {
				var tile = new Tile(j, i);
				tile.passable = dataTiles[tileArray[i][j]].passable;
				tile.textSymbol = dataTiles[tileArray[i][j]].ch;
				row.push(tile);
			}
			level.grid.push(row);
		}
	}
	LevelLoader.prototype.populateMonsters = function(level, monsterDensity) {
		var monsters = [];
		for (var i = 0; i < level.grid.length; i++) {
			for (var j = 0; j < level.grid[i].length; j++) {
				if (Math.random() <= (monsterDensity / 100)) {
					var monster = new Monster();
					monster.x = j;
					monster.y = i;
					monsters.push(monster);
				}
			}
		}
		return monsters;
	}
	return LevelLoader;
})