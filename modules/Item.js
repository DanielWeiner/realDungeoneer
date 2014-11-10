define(['ClassUtil', 'Entity', 'mixins/Positionable', 'mixins/Cursable'], function(ClassUtil, Entity, Positionable, Cursable){
	function Item() {
		Entity.call(this);
		Positionable.call(this);
		Cursable.call(this);
		var self = this;
		this.passable = true;
		this.on("can_i_move", function(event, data){
			return {
				move: self.passable,
				source: 'item'
			}
		});
	}
	ClassUtil.extend(Item, Entity);
	ClassUtil.mixin(Item, Positionable);
	ClassUtil.mixin(Item, Cursable);

})