define(['Renderer'], function(Renderer) {
	function HTMLTextRenderer(width, height, cellWidth, cellHeight) {
		var self = this;
		this.firstRender = true;
		Renderer.apply(this, arguments);
		var table = document.createElement('table');
		table.setAttribute('cellspacing', 0);
		table.setAttribute('cellpadding', 0);
		table.style.display = 'block';
		table.style.width = width * cellWidth;
		table.style.height = height * cellHeight;
		table.style.fontFamily = 'monospace';
		table.style.fontSize = '16px';
		for (var i = 0; i < height; i++) {
			var tr = document.createElement('tr');
			tr.style.float = 'left';
			tr.style.width = '100%';
				for (var j = 0; j < width; j++) {
					var td = document.createElement('td');
					td.width = cellWidth;
					td.height = cellHeight;
					td.style.padding = 0;
					td.style.float = 'left';
					td.style.display = 'block';
					tr.appendChild(td);
				}
			table.appendChild(tr);
		}
		document.body.appendChild(table);

		this.on('textrenderer.render', function(event, data){
			var td = table.children[data.y].children[data.x];
			td.style.backgroundColor = data.backgroundColor || '#000';
			td.style.color = data.color || '#FFF';
			
			td.innerHTML = data.character;
		});
	}
	HTMLTextRenderer.prototype = Object.create(Renderer.prototype);
	HTMLTextRenderer.prototype.constructor = HTMLTextRenderer;
	HTMLTextRenderer.prototype.render = function() {
		Renderer.prototype.render.apply(this, arguments);
		if (this.firstRender) {
			this.firstRender = false;
			this.broadcast('textrenderer.begin_render.tile');
		}
		this.broadcast('textrenderer.begin_render.item');
		this.broadcast('textrenderer.begin_render.creature');
		
	};
	return HTMLTextRenderer;
});