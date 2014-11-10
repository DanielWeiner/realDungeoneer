define(['Entity', 'PositionableContext', 'ClassUtil'], function(Entity, PositionableContext, ClassUtil) {
	function Level(width, height) {
		Entity.call(this);
		this.positionableContext = new PositionableContext(width, height);
		this.on('get_level', function(){
			return this;
		});
	}
	ClassUtil.extend(Level, Entity);
	return Level;
});