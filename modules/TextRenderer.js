define(['Renderer'], function(Renderer) {
	function TextRenderer(width, height, cellWidth, cellHeight) {
		var self = this;
		this.firstRender = true;
		Renderer.apply(this, arguments);
		var canvas = document.createElement('canvas');
		canvas.width = width * cellWidth;
		canvas.height = height * cellHeight;
		var context = canvas.getContext('2d');
		document.body.appendChild(canvas);
		this.on('textrenderer.render', function(event, data){
			context.fillStyle = data.backgroundColor || '#000000';
			context.font = cellHeight + "px/"+ cellHeight + "px 'Inconsolata',monospace";
			context.fillRect(data.x * cellWidth, data.y * cellHeight, cellWidth, cellHeight);
			context.fillStyle = data.color || '#FFFFFF';
			//todo: cache character to image for faster rendering
			context.fillText(data.character, data.x * cellWidth, (data.y + 0.75) * cellHeight, cellWidth-1);
		});
	}
	TextRenderer.prototype = Object.create(Renderer.prototype);
	TextRenderer.prototype.constructor = TextRenderer;
	TextRenderer.prototype.render = function() {
		Renderer.prototype.render.apply(this, arguments);
		if (this.firstRender) {
			this.firstRender = false;
			this.broadcast('textrenderer.begin_render.tile');
		}
		this.broadcast('textrenderer.begin_render.item');
		this.broadcast('textrenderer.begin_render.creature');
		
	};
	return TextRenderer;
});