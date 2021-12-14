const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const map = parseInput(input);
	let sum = 0;
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (!isLowPoint(map, x, y)) continue;
			const riskLevel = get(map, x, y) + 1;
			sum += riskLevel;
		}
	}
	return sum;
};

const isLowPoint = (map, x, y) => {
	return getAdjacents(map, x, y).every(v => v > map[y][x]);
};

const getAdjacents = (map, x, y) => {
	return [
		get(map, x + 1, y + 0),
		get(map, x - 1, y + 0),
		get(map, x + 0, y + 1),
		get(map, x + 0, y - 1)
	].filter(v => v !== undefined);
};

const get = (map, x, y) => {
	if (!map[y]) return;
	return map[y][x];
};

const parseInput = (input) => {
	const heightMap = [];
	for (const line of input.split("\n")) {
		heightMap.push(line.split("").map(v => parseInt(v)));
	}
	return heightMap;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
