define(['ClassUtil','Entity'], function (ClassUtil,Entity) {
	function LevelRenderer (width, height, cellWidth, cellHeight) {
		Entity.call(this);
		this.cachedGlyphs = {};
		width *= cellWidth;
		height *= cellHeight;
		var cvs = document.createElement('canvas');
		cvs.width = width;
		cvs.height = height;
		document.body.appendChild(cvs);
		var ctx = cvs.getContext('2d');
		this.on("draw_glyph", function(event, data){
			var color = data.color || "#FFFFFF";
			var backgroundColor = data.backgroundColor || "#000000";
			var glyph = data.glyph || ' ';
			var glyphName = data.glyph + ',' + data.color + ',' + data.backgroundColor;
			if (this.cachedGlyphs[glyphName] === undefined) {
				var newCanvas = document.createElement('canvas');
				newCanvas.width = cellWidth;
				newCanvas.height = cellHeight;
				var newContext = newCanvas.getContext('2d');
				newContext.fillStyle = data.backgroundColor;
				newContext.fillRect(0,0,cellWidth,cellHeight);
				newContext.textAlign = "left";
				newContext.textBaseline = "hanging";
				newContext.fillStyle = color;
				newContext.font = cellHeight + "px monospace";
				newContext.fillText(glyph,0,0);
				var imgUrl = newCanvas.toDataURL();
				var img = new Image(cellWidth, cellHeight);
				img.src = imgUrl;
				this.cachedGlyphs[glyphName] = img;
			}
			ctx.drawImage(this.cachedGlyphs[glyphName], data.x*cellWidth, data.y * cellHeight);
		});
	}
	ClassUtil.extend(LevelRenderer, Entity);
	return LevelRenderer;
})