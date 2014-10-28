define(['Entity'], function(Entity) {
	function Renderer() {
		Entity.apply(this, arguments);
		var self = this;
		this.on('scene.load', function(){
			self.render();
		})
		this.on('end', function(){ //at the end of a hook cycle, all renderers will render
			self.render();
		});
	}
	Renderer.prototype = Object.create(Entity.prototype);
	Renderer.prototype.constructor = Renderer;
	Renderer.prototype.render = function() {
		this.broadcast('renderer.begin_render');
	};
	return Renderer;
});