requirejs.config({
	baseUrl: 'modules',
	paths: {
		data: '../data'
	}
});

require(
['require', 'GameCore'], 
function(require, GameCore) {
	window.gameCore = new GameCore();
	gameCore.start('Game');
	// var scene = new Scene('scene', ['begin', 'middle','end'], {
	// 	'left': 'player.move_begin.west',
	// 	'right': 'player.move_begin.east',
	// 	'up': 'player.move_begin.north',
	// 	'down': 'player.move_begin.south',
	// 	'upleft': 'player.move_begin.northwest',
	// 	'upright': 'player.move_begin.northeast',
	// 	'downleft': 'player.move_begin.southwest',
	// 	'downright': 'player.move_begin.southeast',
	// 	'center': 'player.move_begin.wait'
	// }); 
	// var level = new Level(scene, 100,40);
	// var renderer = new TextRenderer(scene, level, 10,20);
	// var prenderer = new PlayerRenderer(scene,level, 10,20);
	// var player = new Player(scene);
	// player.speed = 24;
	// player.x = ~~(Math.random()*100);
	// player.y = ~~(Math.random()*40);

	// for (var i = 0; i < 20; i++) {
	// 	var creature = new Creature(scene);
	// 	creature.x = ~~(Math.random()*100);
	// 	creature.y = ~~(Math.random()*40);
	// 	creature.speed = ~~(Math.random()*36) + 1;
	// }
	// renderer.render();
	// prenderer.render();


	// window.addEventListener('keydown', function(event){
	// 	switch(event.keyCode) {
	// 		case 38:
	// 			scene.start('up'); break;
	// 		case 40:
	// 			scene.start('down'); break;
	// 		case 39:
	// 			scene.start('right'); break;
	// 		case 37:
	// 			scene.start('left'); break;
	// 		case 36:
	// 			scene.start('upleft'); break;
	// 		case 33:
	// 			scene.start('upright'); break;
	// 		case 35:
	// 			scene.start('downleft'); break;
	// 		case 34:
	// 			scene.start('downright'); break;
	// 		case 12:
	// 			scene.start('center'); break;
	// 	}
	// });
});
