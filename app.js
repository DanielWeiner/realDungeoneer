requirejs.config({
	baseUrl: 'modules',
	paths: {
		data: '../data',
		mixins: '../mixins',
		loaders: '../loaders'
	}
});

require(
['require', 'GameCore'], 
function(require, GameCore) {
	window.gameCore = new GameCore();
});
