define(['Entity'], function(Entity) {
	function Tile(x, y) {
		var self = this;
		Entity.call(this);
		this.x = x;
		this.y = y;
		this.passable = true;
		this.textSymbol = '';
		this.creatureMove = self.on('creature.move', function(event, data) {
			if (data.x === self.x && data.y === self.y) { //a creature attempted to move on me
				if (self.passable) {
					self.broadcast('creature.move_success', data); //go ahead
				} else {
					self.broadcast('creature.collide.wall', data); //nope, sorry
				}
			}
		});
		this.textRender = self.on('textrenderer.begin_render.tile', function(event, data){
			if(!data || self.x === data.x && self.y === data.y) {
				self.broadcast('textrenderer.render.tile', {
					character: self.textSymbol,
					x: self.x,
					y: self.y
				});
			}
		});
	}
	Tile.prototype = Object.create(Entity.prototype);
	Tile.prototype.constructor = Tile;

	return Tile;
});