define(['Creature'], function(Creature) {
	function isClose(x1,y1,x2,y2, range) {
		return ((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1)) <= (range * range);
	}
	function Player(){
		Creature.apply(this, arguments);
		var self = this;
		self.textSymbol = '@';
		self.hp = Infinity;
		self.textColor = '#FFFF00';
		self._speed = self.speed;
		
		self.on('collide.' + self.id, function(event, data) {
			if (data.type === "impasse") {
				alert("ow!");
			}
		})

		self.on('playerrenderer.begin_render', function(){
			var data = {
				hp: self.hp,
				mp: self.mp
			}
			self.broadcast('playerrenderer.render', data);
		});
		self.on('monster.detect_player', function(event, data){
			
			if (isClose(self.x, self.y, data.x, data.y, data.range)) {
				self.broadcast('monster.player_detected.' + data.originId, {
					x: self.x,
					y: self.y,
					originId: data.originId
				});
			} else {
				self.broadcast('monster.player_not_detected.' + data.originId, {originId: data.originId});
			}
		});
		self.setupMove();
		Object.defineProperty(this, 'speed', {
			get: function() {
				return self._speed;
			},
			set: function(value) {
				Creature.baseSpeed = value;
				self._speed = value;
			}
		})
	}
	Player.prototype = Object.create(Creature.prototype);
	Player.prototype.constructor = Player;
	Player.prototype.setupMove = function() {
		var self = this;
		var directions = {
			'west': {x:-1, y:0}, 
			'east': {x:1, y:0}, 
			'north': {x:0, y:-1}, 
			'south': {x:0, y:1}, 
			'northwest': {x:-1, y:-1}, 
			'northeast': {x:1, y:-1}, 
			'southwest': {x:-1, y:1},
			'southeast': {x:1, y:1},
			'wait': {x:0, y:0}
		};
		for (var direction in directions) {
			(function(direction) {
				self.on('player.move_begin.' + direction, function(event){
					var data = {
						originX: self.x, 
						originY: self.y, 
						x: self.x + directions[direction].x, 
						y: self.y + directions[direction].y,
						originId: self.id
					};
					self.broadcast('move.'+data.x+'.'+ data.y, data);
				});
			}(direction));
		}
	}

	return Player;
});