const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const map = parseInput(input);
	const basinSizes = [];
	map.iterate((x, y) => {
		if (!isLowPoint(map, x, y)) return;
		const basin = bfs(map, x, y);
		// displayBasin(map, basin, {x,y})
		basinSizes.push(basin.length);
	});
	const sortedBasinSizes = basinSizes.sort((a, b) => b - a);
	return sortedBasinSizes[0] * sortedBasinSizes[1] * sortedBasinSizes[2];
};

const bfs = (map, originX, originY) => {
	const visited = [];
	const frontier = [{x: originX, y: originY}];
	while (frontier.length > 0) {
		const xy = frontier.shift();
		visited.push(xy);
		for (const adjacent of map.getAdjacentCoords(xy.x, xy.y)) {
			if (map.get(adjacent.x, adjacent.y) >= 9) continue;
			if (inArray(visited, adjacent) || inArray(frontier, adjacent)) continue;
			frontier.push(adjacent);
		}
	}
	return visited;
};

/**
 * Draws the basin on screen.
 * It's not necessary for the solution, I just found it cool
 */
const displayBasin = (map, basin, origin) => {
	const BgRed = "\x1b[41m";
	const Reset = "\x1b[0m";
	const BgBlue = "\x1b[44m";
	const BgGreen = "\x1b[42m";
	for (let y = 0; y < map.matrix.length; y++) {
		let line = "";
		for (let x = 0; x < map.matrix[0].length; x++) {
			const v = map.get(x,y);
			if (v === 9) {
				line += BgRed + v + Reset;
			} else if (origin.x === x && origin.y === y) {
				line += BgBlue + v + Reset;
			} else if (basin.some(xy => xy.x === x && xy.y === y)) {
				line += BgGreen + v + Reset;
			} else {
				line += map.get(x, y);
			}
		}
		console.log(line);
	}
	console.log("Basin size:", basin.length);
}

const inArray = (array, xy) => {
	return array.some(elment => elment.x === xy.x && elment.y === xy.y);
};

class HeightMap {
	constructor (matrix) {
		this.matrix = matrix;
	}

	iterate (func) {
		for (let y = 0; y < this.matrix.length; y++) {
			for (let x = 0; x < this.matrix[0].length; x++) {
				func(x, y);
			}
		}
	}

	get (x, y) {
		if (!this.matrix[y]) return;
		return this.matrix[y][x];
	}

	getAdjacentValues (x, y) {
		return this.getAdjacentCoords(x, y).map(coord => this.get(coord.x, coord.y));
	}

	getAdjacentCoords (x, y) {
		return [
			{x: x + 1, y: y + 0},
			{x: x - 1, y: y + 0},
			{x: x + 0, y: y + 1},
			{x: x + 0, y: y - 1}
		].filter(coord => this.get(coord.x, coord.y) !== undefined);
	}
}

const isLowPoint = (map, x, y) => {
	return map.getAdjacentValues(x, y).every(v => v > map.get(x, y));
};

const parseInput = (input) => {
	const matrix = [];
	for (const line of input.split("\n")) {
		matrix.push(line.split("").map(v => parseInt(v)));
	}
	return new HeightMap(matrix);
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
