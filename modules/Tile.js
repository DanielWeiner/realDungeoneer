define(['Entity','Positionable'], function(Entity, Positionable) {
	function Tile(x, y) {
		var self = this;
		Entity.call(this);
		Positionable.call(this);
		this.x = x;
		this.y = y;
		this.passable = true;
		this.textSymbol = '';

		var obstacleOnMe = false;
		var obstacleId = -1;

		// bacause this call is synchronous, these will always get set immediately after the original broadcast() call
		// and before the next statement.
		this.onPosition('tile.obstacle_found', function(event, data){
			console.log('found!');
			obstacleOnMe = true;
			obstacleId = data.originId;
		});
		this.onPosition('move', function(event, data){
			
			obstacleOnMe = false; 
			obstacleId = -1;
			if (self.passable === true) {
				self.broadcast('tile.find_obstacle.' + self.x + '.' + self.y);
				console.log('tile.find_obstacle.' + self.x + '.' + self.y);
				if (obstacleOnMe) {
					console.log(data);
					self.broadcast('collide.' + data.originId, {type: 'obstacle', x: self.x, y: self.y, obstacleId: obstacleId});
				} else {
					self.broadcast('move_success.' + data.originId, {x: self.x, y: self.y});
				}
			} else {
				self.broadcast('collide.' + data.originId, {type: 'impasse', x: self.x, y: self.y});
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

	//also extend the Positional abstract Class
	for (var method in Positionable.prototype) {
		Tile.prototype[method] = Positionable.prototype[method];
	}

	return Tile;
});