define(['Renderer'], function(Renderer) {
	function TextRenderer(width, height, cellWidth, cellHeight) {
		this.cachedCharacters = {};
		var self = this;
		this.firstRender = true;
		Renderer.apply(this, arguments);
		var canvas = document.createElement('canvas');
		canvas.width = width * cellWidth;
		canvas.height = height * cellHeight;
		var context = canvas.getContext('2d');
		document.body.appendChild(canvas);
		this.on('textrenderer.render', function(event, data){
			var cachedCharacter = self.cachedCharacters[data.character+","+data.backgroundColor+","+data.color];
			if (!cachedCharacter) {
				var newCanvas = document.createElement('canvas');
				newCanvas.width = cellWidth;
				newCanvas.height = cellHeight;
				var newContext = newCanvas.getContext('2d');
				newContext.fillStyle = data.backgroundColor || '#000000';
				newContext.font = cellHeight + "px/"+ cellHeight + "px 'Inconsolata', monospace";
				newContext.fillRect(0,0,cellWidth, cellHeight);
				newContext.fillStyle = data.color || '#FFFFFF';
				newContext.fillText(data.character, 0, 0.8 * cellHeight, cellWidth-1);
				var dataUrl = newCanvas.toDataURL();
				var img = document.createElement('img');
				img.src = dataUrl;
				self.cachedCharacters[data.character+","+data.backgroundColor+","+data.color] = img;
				cachedCharacter = self.cachedCharacters[data.character+","+data.backgroundColor+","+data.color];
			}
			context.drawImage(cachedCharacter, data.x*cellWidth, data.y*cellHeight);
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