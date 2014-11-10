define(['ClassUtil', 'Creature', 'Dice'], function (ClassUtil, Creature, Dice) {
	function Monster() {
		Creature.call(this);
		this.playerLastSeen = null;
		this.speed = ~~(Math.random()*36) + 1;
		this.onState('can_see', 'i_am_here', function(event, data) {
			var x = data.x;
			var y = data.y;
			var pos = this.getPosition();
			var thisX = pos.x;
			var thisY = pos.y;
			var dx = thisX - x;
			var dy = thisY - y;
			if (dx*dx + dy*dy <= this.vision*this.vision) {
				this.playerLastSeen = {
					x: x,
					y: y
				}
			}
		});
		this.on('middle', function() {
			this.speedPoints += this.speed;
			while (this.speedPoints >= Creature.baseSpeed && !this.isDead) {
				this.startMove();
				this.speedPoints -= Creature.baseSpeed;
			}
		});

	}
	ClassUtil.extend(Monster, Creature);
	Monster.prototype.startMove = function() {
		var x = 0,y = 0;
		var currentPosition = this.getPosition();
		if (this.playerLastSeen === null) {
			x = ~~(Math.random() * 3) - 1;
			y = ~~(Math.random() * 3) - 1;
		} else {
			function sign(x) {
				return x === 0? 0 : x > 0? 1 : -1; 
			}
			Δy = this.playerLastSeen.y - currentPosition.y;
			Δx = this.playerLastSeen.x - currentPosition.x;
			if (Δx !== 0) {
				var ratio = Δy/Δx;
				if (Math.abs(ratio) <= 2) {
					x = sign(Δx);
				}
				if (Math.abs(ratio) > .5) {
					y = sign(Δy);
				}
			} else {
				x = 0;
				y = sign(Δy);
			}
		}
		
		var newMove = {
			x: x + currentPosition.x,
			y: y + currentPosition.y
		}
		if (x === 0 && y === 0) this.playerLastSeen = null;
		this.attemptMove(newMove.x, newMove.y);
	}
	return Monster;
})