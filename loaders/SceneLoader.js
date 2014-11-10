define(['TurnScheduler', 'Scene'], function (TurnScheduler, Scene) {
	function SceneLoader(sceneData) {
		var sceneIndex = -1;
		this.loadNextScene = function() {
			sceneIndex++;
			if (sceneData[sceneIndex] !== undefined) {
				var sceneDataItem = sceneData[sceneIndex];
				var turnScheduler = new TurnScheduler();
				var scene = new Scene(turnScheduler);
				turnScheduler.setScene(scene);
				//load key bindings for scene
				for (var i = 0; i < sceneDataItem.keyBindings.length; i++) {
					var keyBinding = sceneDataItem.keyBindings[i];
					turnScheduler.addTrigger(keyBinding.keyEvent, keyBinding.output, keyBinding.switchTo);
				}
				//load hooks for scene
				for (var i = 0; i < sceneDataItem.hooks.length; i++) {
					var hook = sceneDataItem.hooks[i];
					turnScheduler.addHook(hook);
				}
				scene.setName(sceneDataItem.name);
				return {
					sceneName: sceneDataItem.name,
					scene: scene
				};
			} else {
				return null;
			}
		}
	}
	return SceneLoader;
})