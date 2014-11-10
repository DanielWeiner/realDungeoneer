define(function () {
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
	function PositionableContext(width, height) {
		this.locations = [];
		this.entities = {};
		this.width = width;
		this.height = height;

		//TODO: set integer constraints on height, width
		for (var i = 0; i < height; i++) {
			var row = [];
			for (var j = 0; j < width; j++) {
				row.push([]);
			}
			this.locations.push(row);
		}
	}
	PositionableContext.prototype.register = function(entity) {
		this.entities[entity.id] = {entity: entity};
	};
	PositionableContext.prototype.unregister = function(entityId) {
		if (this.entities[entityId] !== undefined) {
			this.removeAtCoords(entityId, this.entities[entityId].x, this.entities[entityId].y);
			delete this.entities[entityId];
		}
	};
	PositionableContext.prototype.removeAtCoords = function(entityId, x, y) {
		if (this.entities[entityId].x !== undefined && this.entities[entityId].y !== undefined) {
			for (var i = this.locations[y][x].length - 1; i >= 0; i--) {
				if (entityId === this.locations[y][x][i]) {
					this.locations[y][x].splice(i,1);
					break;
				}
			} 
		}
	};
	PositionableContext.prototype.getPosition = function(entityId) {
		if (this.entities[entityId] !== undefined) {
			return {
				x: this.entities[entityId].x,
				y: this.entities[entityId].y
			}
		} else {
			return {x:undefined, y:undefined}
		}
	};
	PositionableContext.prototype.setPosition = function(entityId, x, y) {
		if (this.entities[entityId] !== undefined) {
			this.removeAtCoords(entityId, this.entities[entityId].x, this.entities[entityId].y);
			if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
				this.locations[y][x].push(entityId);
				this.entities[entityId].x = x;
				this.entities[entityId].y = y;
			} else {
				throw new Error("Cannot set entity position out of context bounds.");
			}
		} else {
			throw new Error("Entity not registered to context")
		}
		
	};
	PositionableContext.prototype.broadcastAtCoords = function(x,y,event,data) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) return [];
		var eventNames = createEventNameArray(event);
		var responses = [];
		for (var i = 0; i < this.locations[y][x].length; i++) { //todo: support event hierarchy
			for (var j = 0; j < eventNames.length; j++) {
				var eventName = eventNames[j];
				responses = responses.concat(this.entities[this.locations[y][x][i]].entity.notify(eventName, event, data));
			}
		}
		return responses;
	};

	return PositionableContext;
})