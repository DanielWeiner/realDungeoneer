define(function(){
	function createEventNameArray(name) {
			if (name === '') return [];
			var splitName = name.split('.');
			var resultArr = [];
			var currElement = '';
			for (var i = 0; i < splitName.length; i++) {
				currElement += (currElement? '.' : '') + splitName[i];
				resultArr.unshift(currElement);
			}
			return resultArr;
		}
	function StorableContext() {
		this.indices = {};
		this.entities = {};
		this.capacity = Infinity;
		this.length = 0;
	}
	StorableContext.prototype.register = function(entity) {
		this.entities[entity.id] = {entity: entity};
	}
	StorableContext.prototype.unregister = function(entity) {
		if (this.entities[entityId] !== undefined) {
			this.removeAtLetterIndex(entityId, this.entities[entityId].index);
			delete this.entities[entityId];
		}
	}
	StorableContext.prototype.removeAtLetterIndex = function(entityId, index) {
		if (this.entities[entityId].index !== undefined) {
			for (var i = this.indices[index].length - 1; i >= 0; i--) {
				if (entityId === this.indices[index][i]) {
					this.indices[index].splice(i,1);
					break;
				}
			} 
		}
	};
	StorableContext.prototype.getLetterIndex = function(entityId) {
		if (this.entities[entityId] !== undefined) {
			return this.entities[entityId].index;
		} 
	};
	StorableContext.prototype.setLetterIndex= function(entityId, index) {
		if (this.entities[entityId] !== undefined) {
			this.removeAtLetterIndex(entityId, this.entities[entityId].index);
			if (this.indices[index] !== undefined) {
				this.locations[index].push(entityId);
				this.entities[entityId].index = index;
			} else {
				throw new Error("StorableContext index " + index + " does not exist.");
			}
		} else {
			throw new Error("Entity not registered to context")
		}
	};
	//to override
	StorableContext.prototype.addNewIndex = function() {
		var idx = this.length;
		this.length++;
		this.indices[this.length] = [];
		return idx;
	}
	StorableContext.prototype.store = function(entityId) {
		this.setLetterIndex(entityId, this.addNewIndex());
	}
});
