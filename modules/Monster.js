define(['Creature', 'Dice'], function (Creature, Dice) {
	function Monster() {
		var self = this;
		Creature.apply(this, arguments);
		self.on('monster.player_not_detected', function(event, data){
			//twiddle thumbs... (maybe have a playerLastSeen property and move toward that?)
			if (data.originId === self.id) {
				if (self.playerLastSeen) {
					self.moveToward(self.playerLastSeen.x, self.playerLastSeen.y);
				} else {
					var die = new Dice('1d3-2'); //-1, 0, or 1
					self.moveToward(self.x + die.roll(), self.y + die.roll());
				}
			}
		});
		self.on('monster.player_detected', function(event, data) {
			if (data.originId === self.id) {
				self.playerLastSeen = {
					x: data.x,
					y: data.y
				};
				self.moveToward(data.x, data.y);
			}
		});
		self.on('middle', function(){
			self.speedPoints += self.speed;
			self.startMove();
		});
		// self.on('creature.'+self.id+'.collide.creature', function(event, data, source){
		// 		var newData = {
		// 			damage: self.attackStrength.roll(),
		// 			originId: self.id
		// 		};
		// 		self.broadcast('creature.'+data.originId+'.attack', newData);
		// });

	}
	Monster.prototype = Object.create(Creature.prototype);
	Monster.prototype.constructor = Monster;

	Monster.prototype.startMove = function() {
		var self = this;
		if (self.playerLastSeen !== null && self.playerLastSeen.x === self.x && self.playerLastSeen.y === self.y) { //thought he was over there...
			self.playerLastSeen = null; //I guess not. hmm...
		}
		if (self.speedPoints >= Creature.baseSpeed) {
			self.broadcast('monster.detect_player', {  //where is he?
				x: self.x,
				y: self.y,
				range: self.eyesightRange,
				originId: self.id
			});
		}
	}
	Monster.prototype.moveToward = function(x, y) {
		var self = this;
		/* if player is in weapon range, attack within range. otherwise...*/
		function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
		var deltaX = self.x  - x;
		var deltaY = self.y - y;
		var err = deltaY / deltaX;
		x = self.x -(Math.abs(err) <= 0.75? sign(deltaX) : 0);
		y = self.y - (Math.abs(err) >= 0.25? sign(deltaY) : 0);
		var newData = {
			x: x,
			y: y,
			originX: self.x,
			originY: self.y,
			originId: self.id
		}
		self.broadcast('move.'+x + '.' + y, newData);
		self.speedPoints -= Creature.baseSpeed;
		self.startMove();
	}
	return Monster;
})