define(function(){
	return [
		{name: 'Home Screen', keyBindings: [
			{keyEvent: 'n', switchTo: 'New Player'},
			{keyEvent: 'l', switchTo: 'Load Game'},
			{keyEvent: 'q', switchTo: 'Quit'}
		], hooks: ['begin', 'end']},
		{name: 'Load Game', keyBindings: [
			{keyEvent: 'up', output: 'cursor.up'},
			{keyEvent: 'down', output: 'cursor.down'},
			{keyEvent: 'enter', output: 'game.get_game', switchTo: 'Game'}
		], hooks: ['begin', 'end']},
		{name: 'Game', keyBindings: [
			{keyEvent: 'left', output: 'player.move_begin.west'},
			{keyEvent: 'right', output: 'player.move_begin.east'},
			{keyEvent: 'up', output: 'player.move_begin.north'},
			{keyEvent: 'down', output: 'player.move_begin.south'},
			{keyEvent: 'upleft', output: 'player.move_begin.northwest'},
			{keyEvent: 'upright', output: 'player.move_begin.northeast'},
			{keyEvent: 'downleft', output: 'player.move_begin.southwest'},
			{keyEvent: 'downright', output: 'player.move_begin.southeast'},
			{keyEvent: 'center', output: 'player.move_begin.wait'}
		], hooks: ['begin', 'middle', 'end']}
	];
});