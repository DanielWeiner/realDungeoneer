define(function(){
	var actionId = -1;
	function Action(name, callback, duration, offset) {
		this.name = name;
		this.callback = callback || function(){};
		this.duration = duration || Infinity; //by default, actions don't get removed. However, e.g. status effects only last a limited amount of time
		this.offset = offset || 0;
		this.source = null;
		this.id = ++actionId;
	}
	return Action;
})