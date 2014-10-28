define(['Level','Tile', 'data/tiles'], function (Level,Tile, dataTiles){
	function LevelLoader() {}
	LevelLoader.prototype.load = function(input) {
		var level = new Level(input.width, input.height)
		if (input.type === 'random') {
			this.createRandom(level);
		} else {
			this.createFromArray(level, input.tiles);
		}
		var monsters = this.populateMonsters();
		this.populateCreat
		return {
			level: level
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
	return LevelLoader;
})