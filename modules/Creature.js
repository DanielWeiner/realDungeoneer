define(['Entity', 'Dice', 'Positionable', 'Obstacle'], function(Entity, Dice, Positionable, Obstacle){
	function Creature() {
		Entity.apply(this, arguments);
		
		var self = this;
		self.x = 0;
		self.y = 0;
		self.ac = 0;
		self.hp = 20;
		self.mp = 0;
		self.speed = 12;
		self.speedPoints = Creature.baseSpeed;
		self.textColor = '#00FFFF';
		self.textSymbol = '&';
		self.playerLastSeen = null;
		self.eyesightRange = 5;
		self.hostility = Creature.HOSTILE;
		self.attributes = {
			strength: 10,
			dexterity: 10,
			intelligence: 10,
			wisdom: 10,
			constitution: 10,
			charisma: 10
		};
		self.armor = {
			head: null,
			body: null,
			leftFoot: null,
			rightFoot: null,
			leftHand: null,
			rightHand: null,
			cloak: null
		};
		self.adornments = {
			rightRing: null,
			leftRing: null,
			amulet: null
		}
		self.inventory = {
			
		};
		self.wallet = 100;
		self.attackStrength = new Dice('1d6-1');

		self.on('move_success.' + self.id, function(event, data){
			self.broadcast('textrenderer.begin_render.tile', {x: self.x, y: self.y});
			self.changePosition(data.x, data.y);
		});
		self.on('collide.' + self.id, function(event,data) {
			if (data.type = 'obstacle') {
				self.broadcast('attack.' + data.obstacleId, {damage: self.attackStrength.roll(), originId: self.id});
			} else {
				console.log("yeowch");
			}
		})
		self.on('attack.' + self.id, function(event, data){
			self.hp -= data.damage;
			var newData = {
				damage: self.attackStrength.roll(),
				originId: self.id
			}
			self.broadcast('counter.' + data.originId, newData);
		});
		self.on('counter.' + self.id, function(event, data){
			self.hp -= data.damage;
		});

		self.on('textrenderer.begin_render.creature', function(){
			self.broadcast('textrenderer.render.creature', {
				character: self.textSymbol,
				color: self.textColor,
				x: self.x,
				y: self.y
			});
		});
		self.on('textrenderer.render.tile', function(event, data){
			if (self.x === data.x && self.y === data.y) {
				data = {
					character: self.textSymbol,
					x: self.x,
					y: self.y
				}
				self.broadcast('textrenderer.render.creature', data);
			}
		})
		self.on('end', function(){
			if (self.hp <= 0) {
				var x = self.x;
				var y = self.y;
				self.x = -1; //move self off board before rendering
				self.y = -1;
				self.broadcast('textrenderer.begin_render.tile', {x: x, y: y});
				self.die();
			}
		});
		//extend Positionable abstract class
		Positionable.apply(this, arguments);
		//extend Obstacle abstract class
		Obstacle.apply(this, arguments);
	}
	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;
	Creature.prototype.die = function() {
		this.detachFromAll();
	}
	//extend the Positional abstract Class
	for (var method in Positionable.prototype) {
		Creature.prototype[method] = Positionable.prototype[method];
	}
	//extend the Positional abstract Class
	for (var method in Obstacle.prototype) {
		Creature.prototype[method] = Obstacle.prototype[method];
	}

	Creature.hostility = {
		IN_LOVE: 2,
		FRIENDLY: 1,
		NEUTRAL: 0,
		SUSPICIOUS: -1,
		HOSTILE: -2
	};
	Creature.baseSpeed = 12;
	return Creature;
});