const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const data = parseInput(input);
	// console.log("data", JSON.stringify(data, null, 2));
	display(data.grid);
	// TODO: fold grid
	console.log("data.foldInstructions", JSON.stringify(data.foldInstructions, null, 2));
	const folded = fold(data.grid, data.foldInstructions[0].axis, data.foldInstructions[0].value);
	console.log("After first fold");
	display(folded);
};

const fold = (grid, axis, foldPosition) => {
	// Creates folded grid:
	const foldedGrid = new Grid();

	return foldedGrid;
};

const countDots = grid => {

};

class Grid {
	matrix;
	sizeY = 0;
	sizeX = 0;

	constructor (matrix = []) {
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

	set (x, y, value) {
		// sizex 5
		// x max 4
		if (x > this.sizeX - 1) {
			console.log("xy", x, y, "sizex increased from", this.sizeX, "to", x+1);
			this.sizeX = x + 1;
		}
		if (y > this.sizeY - 1) this.sizeY = y + 1;
		if (!this.matrix[y]) this.matrix[y] = [];
		this.matrix[y][x] = value;
	}
}

const parseInput = (input) => {
	const data = {foldInstructions: [], grid: new Grid()};
	for (const line of input.split("\n").filter(l => l !== "")) {
		if (line.includes("fold along")) {
			const foldPart = line.split(" ")[2];
			data.foldInstructions.push({axis: foldPart.split("=")[0], value: parseInt(foldPart.split("=")[1])});
		} else {
			const coords = line.split(",").map(value => parseInt(value));
			data.grid.set(coords[0], coords[1], true);
		}
	}
	return data;
};

const display = (grid) => {
	// let width = 0;
	// for (const row of grid.matrix) {
	// 	if (!row) continue;
	// 	width = Math.max(width, row.length);
	// }
	for (let y = 0; y < grid.matrix.length; y++) {
		let line = "";
		for (let x = 0; x < grid.sizeX; x++) {
			const v = " " + (grid.get(x, y) ? "#" : ".");
			line += v;
		}
		console.log(line);
	}
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
