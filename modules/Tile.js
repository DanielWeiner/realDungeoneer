define(['ClassUtil', 'Entity','mixins/Positionable'], function(ClassUtil, Entity, Positionable) {
	function Tile () {
		Entity.call(this);
		Positionable.call(this);
		this.glyph = '.';
		this.glyphColor = '#FFFFFF';
		this.glyphBackground = '#000000';
		this.passable = true;
		var self = this;
		this.on("can_i_move", function(event, data){
			return {
				move: this.passable,
				source: 'tile'
			}
		});
		this.on("draw_tile", function(){
			this.broadcast("draw_glyph", {
				glyph: this.glyph,
				color: this.glyphColor,
				backgroundColor: this.glyphBackground,
				x: this.getPosition().x,
				y: this.getPosition().y
			});
		})
	}
	ClassUtil.extend(Tile, Entity);
	ClassUtil.mixin(Tile, Positionable);
	return Tile;
});