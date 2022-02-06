const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const numberOfFoldsToRun = 999;
	const data = parseInput(input);
	let coords = data.coords;
	console.log("Starting sheet");
	for (let i = 0; i < data.foldInstructions.length; i++) {
		if (i >= numberOfFoldsToRun) break;
		console.log("Folding", data.foldInstructions[i]);
		coords = fold(coords, data.foldInstructions[i].axis, data.foldInstructions[i].value);
	}
	console.log("Folded sheet (final):");
	displayByCoords(coords);
	return countDots(coords);
};

const fold = (coords, axis, foldPosition) => {
	const otherAxis = axis === "x" ? "y" : "x";
	const foldedCoords = coords.map(xy => {
		if (xy[axis] < foldPosition) return xy;
		return {
			[otherAxis]: xy[otherAxis],
			[axis]: xy[axis] - ((xy[axis] - foldPosition) * 2)
		};
	});
	// Possible optimization: Remove duplicated dots
	return foldedCoords;
};

const countDots = coords => {
	const set = new Set();
	coords.map(xy => `${xy.x},${xy.y}`).forEach(xy => set.add(xy));
	return set.size;
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
		if (x > this.sizeX - 1) this.sizeX = x + 1;
		if (y > this.sizeY - 1) this.sizeY = y + 1;
		if (!this.matrix[y]) this.matrix[y] = [];
		this.matrix[y][x] = value;
	}
}

const parseInput = (input) => {
	const data = {foldInstructions: [], grid: new Grid(), coords: []};
	for (const line of input.split("\n").filter(l => l !== "")) {
		if (line.includes("fold along")) {
			const foldPart = line.split(" ")[2];
			data.foldInstructions.push({axis: foldPart.split("=")[0], value: parseInt(foldPart.split("=")[1])});
		} else {
			const coords = line.split(",").map(value => parseInt(value));
			data.grid.set(coords[0], coords[1], true);
			data.coords.push({x: coords[0], y: coords[1]});
		}
	}
	return data;
};

const displayByCoords = (coords) => {
	display(getGridByCoords(coords));
}

const getGridByCoords = (coords) => {
	const grid = new Grid();
	for (const coord of coords) {
		grid.set(coord.x, coord.y, true);
	}
	return grid;
};

const display = (grid) => {
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
