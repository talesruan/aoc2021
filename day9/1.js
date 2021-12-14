const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const map = parseInput(input);
	let sum = 0;
	map.iterate((x, y) => {
		if (!isLowPoint(map, x, y)) return;
		const riskLevel = map.get(x, y) + 1;
		sum += riskLevel;
	});
	return sum;
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

	getAdjacents (x, y) {
		return [
			this.get(x + 1, y + 0),
			this.get(x - 1, y + 0),
			this.get(x + 0, y + 1),
			this.get(x + 0, y - 1)
		].filter(v => v !== undefined);
	}
}

const isLowPoint = (map, x, y) => {
	return map.getAdjacents(x, y).every(v => v > map.get(x, y));
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
