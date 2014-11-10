define(['ClassUtil', 'Entity', 'Dice', 'mixins/Positionable', 'mixins/Lookable'], function(ClassUtil, Entity, Dice, Positionable, Lookable){
	function Creature () {
		Entity.call(this);
		Positionable.call(this);
		Lookable.call(this);
		this.HP = 20;
		this.glyph = '&';
		this.glyphBackground = '#000000';
		this.glyphColor = '#00FFFF';
		this.on("can_i_move", function(event, data){
			return {
				move: false,
				source: 'creature'
			}
		});
		this.on('attack', function(event, data){
			this.takeDamage(data.attack);
			return {counterAttack: ~~(Math.random() * 5)};
		});
	}
	ClassUtil.extend(Creature, Entity);
	ClassUtil.mixin(Creature, Positionable);
	ClassUtil.mixin(Creature, Lookable);
	Creature.prototype.attemptMove = function(x,y) {
		this.broadcastAtCoords(x,y,'can_i_move');
		var responses = this.broadcastAtCoords(x, y, 'can_i_move');
		var currentPosition =  this.getPosition();
		if (responses.length && responses.every(function(response){return response.move})) {
			this.moveTo(x, y);
		} else {
			if (responses.length && (x !== currentPosition.x || y !== currentPosition.y)) {
				this.collide(x,y,responses.filter(function(response){return !response.move}));
			}
		}
	}
	Creature.prototype.render = function() {
		this.broadcast('draw_glyph', {
			glyph: this.glyph,
			color: this.glyphColor,
			backgroundColor: this.glyphBackground,
			x: this.getPosition().x,
			y: this.getPosition().y
		});
	}
	Creature.prototype.moveTo = function(x,y) {
		var currentPosition = this.getPosition();
		this.setPosition(x, y);
		this.render();
		this.broadcastAtCoords(currentPosition.x, currentPosition.y, 'draw_tile');
	}
	Creature.prototype.collide = function(x,y,collisionResponses) {
		for (var i = 0; i < collisionResponses.length; i++) {
			if (collisionResponses[i].source === 'creature') {
				//Todo: dice
				var responses = this.broadcastAtCoords(x, y, 'attack', {attack: ~~(Math.random() * 5)});
				for (var j = 0; j < responses.length; j++) {
					this.takeDamage(responses[j].counterAttack);
				}
			}
		}
	}
	Creature.prototype.die = function() {
		for (var scene in this.scenes) {
			this.removeScene(scene);
		}
		this.unregisterPositionableContext();
	}
	Creature.prototype.takeDamage = function(damage) {
		this.HP -= damage;
		if (this.HP < 0) {
			var pos = this.getPosition();
			this.broadcastAtCoords(pos.x, pos.y, 'draw_tile');
			this.die();
		}
	}
	return Creature;
});