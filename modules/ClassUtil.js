define(function(){
	return {
		extend: function(thisClass, parentClass) {
			thisClass.prototype = Object.create(parentClass.prototype);
			thisClass.prototype.constructor = thisClass;
		},
		mixin: function(thisClass, mixinClass) {
			for (var prop in mixinClass.prototype) {
				if (thisClass.prototype[prop] === undefined) {
					thisClass.prototype[prop] = mixinClass.prototype[prop];
				}
			}
		}
	};
});