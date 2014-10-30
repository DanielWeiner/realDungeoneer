define(function () {
	return function() {
		var self = this;
		if (!this.isPositionable) throw new Error("Obstacle must be Positionable");
		this.onPosition('tile.find_obstacle', function(event, data){
			console.log("finding!");
			self.broadcast('tile.obstacle_found.' + self.x + '.' + self.y, {originId: self.id});
		});
	}
})