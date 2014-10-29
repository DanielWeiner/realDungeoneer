define(['Entity'], function(Entity) {
	function Tile(x, y) {
		var self = this;
		Entity.call(this);
		this.x = x;
		this.y = y;
		this.passable = true;
		this.textSymbol = '';
		this.creatureMove = self.on('creature.move.' + self.x + '.' + self.y , function(event, data) {
			if (self.passable) {
				self.broadcast('creature.'+data.originId+'.move_success', {x: self.x, y: self.y}); //go ahead
			} else {
				self.broadcast('creature.'+data.originId+'.collide.wall', {x: data.originX, y: data.originY}); //nope, sorry
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