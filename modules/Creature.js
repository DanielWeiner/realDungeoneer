define(['Entity', 'Dice'], function(Entity, Dice){
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
		
		//collision detection for other creatures
		self.on('creature.move', function(event, data){
			if (data.x === self.x && data.y === self.y) { //make sure there's no collision
				self.broadcast('creature.collide.creature', data); //watch where you're going, buddy!
			}
		});
		self.on('creature.move_success', function(event, data){
			if (data.originId === self.id) {
				self.broadcast('textrenderer.begin_render.tile', {x: self.x, y: self.y});
				self.x = data.x;
				self.y = data.y;
			}
		});
		
		self.on('creature.collide', function bounceBack(event, data){
			if (data.originId === self.id) {
				self.x = data.originX;
				self.y = data.originY;
			}
		});
		self.on('creature.attack', function(event, data, source){
			if (data.target === self) {
				self.hp -= data.damage;
				var newData = {
					target: source,
					damage: self.attackStrength.roll()
				}
				self.broadcast('creature.counter', newData);
			}
		});
		self.on('creature.counter', function(event, data){
			if (data.target === self) {
				self.hp -= data.damage;
			}
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
				self.die();
			}
		})
	}
	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;
	Creature.prototype.die = function() {
		this.detachFromAll();
	}
	Creature.prototype.startMove = function() {
		var self = this;
		if (self.playerLastSeen !== null && self.playerLastSeen.x === self.x && self.playerLastSeen.y === self.y) { //thought he was ove there...
			self.playerLastSeen = null; //I guess not. hmm...
		}
		if (self.speedPoints >= Creature.baseSpeed) {
			self.broadcast('creature.detect_player', {  //where is he?
				x: self.x,
				y: self.y,
				range: self.eyesightRange,
				originId: self.id
			});
		}
	}
	Creature.prototype.moveToward = function(x, y) {
		var self = this;
		/* if player is in weapon range, attack within range. otherwise...*/
		function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
		var deltaX = self.x  - x;
		var deltaY = self.y - y;
		var err = deltaY / deltaX;
		var newData = {
			x: self.x -(Math.abs(err) <= 0.75? sign(deltaX) : 0),
			y: self.y - (Math.abs(err) >= 0.25? sign(deltaY) : 0),
			originX: self.x,
			originY: self.y,
			originId: self.id
		}
		self.broadcast('creature.move', newData);
		self.speedPoints -= Creature.baseSpeed;
		self.startMove();
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