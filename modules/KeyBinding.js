define(['Scene'], function(Scene) {
	function KeyBinding() {
		this.scene = null; //scene that it's bound to
		this.keyEvent = null; //key event that triggers it "up", "down", etc.
		this.switchTo = null; //scene to switch to, if applicable
		this.output = null; //event name to output
	}
	return KeyBinding;
});