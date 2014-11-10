define(function () {
	function Lookable() {
		this.addState('can_see');
		this.addState('blind');
		this.activateState('can_see');
		this.setVision(5);
	}
	Lookable.maxVision = 0;
	Lookable.allVisions = {};
	Lookable.prototype.setVision = function (vision) {
		var lastVision = this.vision;
		this.vision = vision;
		if (lastVision) {
			Lookable.allVisions[lastVision]--; //remove one from current vision slot
			if (Lookable.allVisions[lastVision] == 0) {
				delete Lookable.allVisions[lastVision]; //delete slot if empty
			}
		}
		Lookable.allVisions[vision] = ++Lookable.allVisions[vision] || 1;
		if (lastVision === Lookable.maxVision && Lookable.allVisions[lastVision] === undefined) {
			//if we just deleted the max vision slot..
			Lookable.maxVision = 0;
			for (var vision in Lookable.allVisions) { //check for max vision again and set it
				Lookable.maxVision = Math.max(vision, Lookable.maxVision);
			}
		} else {
			Lookable.maxVision = Math.max(vision, Lookable.maxVision);
		}
	}
	return Lookable;
});