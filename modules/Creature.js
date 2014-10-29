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
		self.on('creature.move', function(event, data, source){
			if (data.x === self.x && data.y === self.y) { //make sure there's no collision
				console.log(data);
				var newData = {
					x: data.originX,
					y: data.originY,
					originId: self.id
				}
				self.broadcast('creature.'+data.originId+'.collide.creature', newData); //watch where you're going, buddy!
			}
		});
		self.on('creature.'+self.id+'.move_success', function(event, data){
			self.broadcast('textrenderer.begin_render.tile', {x: self.x, y: self.y});
			self.x = data.x;
			self.y = data.y;
		});
		
		self.on('creature.'+self.id+'.collide', function (event, data){
			self.x = data.x;
			self.y = data.y;
		});
		self.on('creature.'+self.id+'.attack', function(event, data, source){
			self.hp -= data.damage;
			var newData = {
				damage: self.attackStrength.roll(),
				originId: self.id
			}
			self.broadcast('creature.'+data.originId+'.counter', newData);
		});
		self.on('creature.'+self.id+'.counter', function(event, data){
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
		})
	}
	Creature.prototype = Object.create(Entity.prototype);
	Creature.prototype.constructor = Creature;
	Creature.prototype.die = function() {
		this.detachFromAll();
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