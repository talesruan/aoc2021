const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const grid = parseInput(input);
	display(grid);
	let stepNumber = 0;
	while (true) {
		stepNumber ++;
		const stepFlashes = step(grid);
		console.log("");
		console.log("Step", stepNumber);
		display(grid);
		console.log("flashes ", stepFlashes);
		if (stepFlashes === grid.sizeX * grid.sizeY) {
			console.log("Found sync!");
			return stepNumber;
		}
	}
};

const incrementEnergy = (grid, x, y) => {
	const newEnergyLevel = grid.get(x, y) + 1;
	if (newEnergyLevel > 9 + 1) return; // already flashed
	grid.set(x, y, newEnergyLevel);
	if (newEnergyLevel > 9) {
		for (const adjacent of grid.getAdjacentCoords(x, y)) {
			incrementEnergy(grid, adjacent.x, adjacent.y);
		}
	}
};

const step = (grid) => {
	grid.iterate((x, y) => {
		incrementEnergy(grid, x, y);
	});
	let flashes = 0;
	grid.iterate((x, y) => {
		if (grid.get(x, y) > 9) {
			flashes++;
			grid.set(x, y, 0);
		}
	});
	return flashes;
};

class Grid {
	matrix;
	sizeY;
	sizeX;

	constructor (matrix) {
		this.matrix = matrix;
		this.sizeY = this.matrix.length;
		this.sizeX = this.matrix[0].length;
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

	set (x, y, value) {
		if (!this.matrix[y]) this.matrix[y] = [];
		this.matrix[y][x] = value;
	}

	getAdjacentValues (x, y) {
		return this.getAdjacentCoords(x, y).map(coord => this.get(coord.x, coord.y));
	}

	getAdjacentCoords (x, y) {
		return [
			{x: x - 1, y: y - 1},
			{x: x + 0, y: y - 1},
			{x: x + 1, y: y - 1},
			{x: x - 1, y: y + 0},
			//{x: x + 0, y: y + 0},
			{x: x + 1, y: y + 0},
			{x: x - 1, y: y + 1},
			{x: x + 0, y: y + 1},
			{x: x + 1, y: y + 1},
		].filter(coord => this.get(coord.x, coord.y) !== undefined);
	}
}

const display = (grid) => {
	const BgRed = "\x1b[41m";
	const Reset = "\x1b[0m";
	const BgBlue = "\x1b[44m";
	const BgGreen = "\x1b[42m";
	for (let y = 0; y < grid.matrix.length; y++) {
		let line = "";
		for (let x = 0; x < grid.matrix[0].length; x++) {
			const v = " " + grid.get(x, y);
			if (parseInt(v) === 0) {
				line += BgRed + v + Reset;
			} else {
				line += v;
			}
		}
		console.log(line);
	}
}

const parseInput = (input) => {
	const matrix = [];
	for (const line of input.split("\n")) {
		matrix.push(line.split("").map(v => parseInt(v)));
	}
	return new Grid(matrix);
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
