define(['Renderer'], function(Renderer) {
	function PlayerRenderer(level, cellWidth, cellHeight) {
		var width = level.width;
		var height = level.height;
		Renderer.apply(this, arguments);
		var self = this;
		var canvas = document.createElement('canvas');
		canvas.height = cellHeight;
		canvas.width = width * cellWidth;
		document.body.appendChild(canvas);
		var context = canvas.getContext('2d');
		this.on('playerrenderer.render', function(event, data) {
			context.fillStyle = "#000000";
			context.fillRect(0,0,canvas.width, canvas.height);
			context.font = cellHeight + "px/"+ cellHeight + "px 'Inconsolata',monospace";
			context.fillStyle = "#FFFFFF";
			context.fillText("HP: " + data.hp, 0,cellHeight * .75);
		});
	}
	PlayerRenderer.prototype = Object.create(Renderer.prototype);
	PlayerRenderer.prototype.constructor = PlayerRenderer;
	PlayerRenderer.prototype.render = function() {
		Renderer.prototype.render.apply(this,arguments);
		this.broadcast('playerrenderer.begin_render');
	}
	return PlayerRenderer;
});