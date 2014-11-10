define(['ClassUtil', 'Creature', 'mixins/Lookable'], function(ClassUtil, Creature, Lookable) {
	function Player() {
		Creature.call(this);
		this.HP = Infinity;
		this.glyph = '@';
		this.glyphBackground = '#000000';
		this.glyphColor = '#FFFF00';
		this.on('player.move_begin', function(event){
			var dir = event.split('.')[2];
			var currentPosition = this.getPosition();
			var newMove = {};
			switch (dir) {
				case 'west':
					newMove = {x: -1, y:0}; break;
				case 'east':
					newMove = {x: 1, y: 0}; break;
				case 'north':
					newMove = {x: 0, y: -1}; break;
				case 'south':
					newMove = {x: 0, y: 1}; break;
				case 'northwest':
					newMove = {x: -1, y:-1}; break;
				case 'southeast':
					newMove = {x: 1, y: 1}; break;
				case 'northeast':
					newMove = {x: 1, y: -1}; break;
				case 'southwest':
					newMove = {x: -1, y: 1}; break;
				case 'wait':
					newMove = {x: 0, y: 0}; break;
			}
			newMove.x += currentPosition.x;
			newMove.y += currentPosition.y;
			this.attemptMove(newMove.x, newMove.y);
			//broadcast position to all monsters within max range
			var pos = this.getPosition();
			for (var i = pos.x - Lookable.maxVision; i <= pos.x + Lookable.maxVision; i++) {
				for (var j = pos.y - Lookable.maxVision; j <= pos.y + Lookable.maxVision; j++) {
					this.broadcastAtCoords(i,j, 'i_am_here', {
						x: pos.x,
						y: pos.y
					});
				}
			}
			
		});
	}
	ClassUtil.extend(Player, Creature);
	return Player;
});