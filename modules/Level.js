define(['Entity', 'Tile'], function(Entity, Tile) {
	function Level(width, height) {
		Entity.call(this);
		this.width = width;
		this.height = height;
		this.grid = [];
		//this.setupTiles();
	}
	Level.prototype = Object.create(Entity.prototype);
	Level.prototype.constructor = Level;
	Level.prototype.setupTiles = function() {
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				var tile = new Tile(this.scene, j, i);
				if (Math.random() > .99) tile.passable = false;
				this.grid.push(tile);
			}
		}
	}

	return Level;
});