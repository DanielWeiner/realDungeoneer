define(function(){
	/**
		1) create a room randomly, weighted close to the level boundaries, surrounded by walls.
		2) from the current room, select a random wall to begin digging
		3) put one or more doors in that wall.
			for each door:
			if there's a floor tile on the other side, leave it.
			otherwise:
			4) create a room on the other side
			or:
			4) generate a random a rise/run of a tunnel, weighted away from the level boundaries.
				4a) start vertically or horizontally
				4b) alternate digging horizontally along run, and vertically along rise.
					4b1) If there is a wall on the other side, add a door and leave it. go to a random room.
					otherwise
					4b1) if there's a floor tile parallel 1 tile away, move away from it 1 tile.
						 if there's a floor tile parallel there as well, stop making the hallway. go to a random room.
						 otherwise, dig a floor tile and surround it with walls (except on any location that has a wall or floor tile)
					4b2) along the way, we can decide to branch. break a wall and perhaps add a door. go to step 4.
					4b3) after a while, try to build another room. if a minimum room size check fails on one side of the hall, try a
						 different side. if all fails:
						 dig in one of those directions until another wall is reached. break the wall or add a door. go to step 4
						 otherwise:
						 build a random sized room.
		5) go to step 2 until we reach a desired room+tunnel density

	**/

	return {
		generateDungeon: function(width, height) {

		}
	}
})