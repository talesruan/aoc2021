/**
 * Big inputs from https://the-tk.com/project/aoc2021-bigboys.html
 * This solution completes in 24s. It can be improved
 */
const fs = require("fs");

const input = fs.readFileSync("biginput.txt", "utf8");
console.time("Elapsed time");

const getAverage = (array) => {
	const sum = array.reduce((a, b) => a + b, 0);
	return sum / array.length;
};

const getStats = (array) => {
	const sorted = array.sort((a, b) => a - b);
	return `AVG: ${getAverage(array)} MIN: ${sorted[0]} MAX: ${sorted[sorted.length - 1]}`;
}

const fn = function (input) {
	console.log("Parsing");
	const map = parseInput(input);
	const basinSizes = [];
	map.iterate((x, y) => {
		if (!isLowPoint(map, x, y)) return;
		const basin = bfs(map, x, y);
		// displayBasin(map, basin, {x,y})
		basinSizes.push(basin.length);
	});
	const sortedBasinSizes = basinSizes.sort((a, b) => b - a);
	console.log("Found", sortedBasinSizes.length, "basins");
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
	matrix;
	sizeY;
	sizeX;

	constructor (matrix) {
		this.matrix = matrix;
		this.sizeY = this.matrix.length;
		this.sizeX = this.matrix[0].length;
	}

	iterate (func) {
		const eTotal = this.matrix.length * this.matrix[0].length;
		let n = 0;
		for (let y = 0; y < this.sizeY; y++) {
			for (let x = 0; x < this.sizeX; x++) {
				n++;
				if (n % 100000 === 0) console.log("Iterating", `${n}/${eTotal}`, (n / eTotal * 100).toFixed(2) + "%");
				func(x, y);
			}
		}
	}

	isInside (x, y) {
		return x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY;
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
		].filter(coord => this.isInside(coord.x, coord.y));
	}
}

const isLowPoint = (map, x, y) => {
	if (map.get(x, y) === 9) return false;
	return map.getAdjacentValues(x, y).every(v => v > map.get(x, y));
};

const parseInput = (input) => {
	const matrix = [];
	for (const line of input.split("\n").filter(s => s !== "")) {
		matrix.push(line.split("").map(v => parseInt(v)));
	}
	return new HeightMap(matrix);
};

console.log("Result: ", fn(input), "expected", 101367520960);
console.timeEnd("Elapsed time");
