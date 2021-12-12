/**
 * Big inputs from https://the-tk.com/project/aoc2021-bigboys.html
 * Currently not working fast enough
 */

const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const considerDiagonalLines = true; // set true for part 2

const fn = function (input) {
	const data = parseData(input);
	const overlapPoints = new Set();
	const grid = [];
	const lines = considerDiagonalLines ? data : data.filter(line => line.x1 === line.x2 || line.y1 === line.y2);
	for (let index = 0; index < lines.length; index++) {
		// console.log("Line ", index, "of", lines.length);
		const line = lines[index];
		for (let otherIndex = index + 1; otherIndex < lines.length; otherIndex++) {
			console.log("Line ", index, "of", lines.length, `Line ${index} vs ${otherIndex}`);
			const otherLine = lines[otherIndex];
			const lineOverlapPoints = getIntersectionPoints(line, otherLine);
			lineOverlapPoints.forEach(p => overlapPoints.add(getKey(p.x, p.y)));
		}
	}
	return overlapPoints.size;
};

const getIntersectionPoints = (line1, line2) => {
	const points1 = getLinePoints(line1);
	const points2 = getLinePoints(line2);
	const intersectionPoints = points1.filter(p1 => points2.some(p2 => p1.x === p2.x && p1.y === p2.y));
	return intersectionPoints;
};

const getKey = (x, y) => `${x},${y}`;

const recordPoint = (grid, x, y) => {
	if (!grid[x]) grid[x] = [];
	grid[x][y] = true;
};

const hasPoint = (grid, x, y) => {
	return grid[x] && grid[x][y];
};

const getLinePoints = (line) => {
	const xIncrement = Math.sign(line.x2 - line.x1);
	const yIncrement = Math.sign(line.y2 - line.y1);
	const points = [];
	let x = line.x1;
	let y = line.y1;
	points.push({x, y});
	while (x !== line.x2 || y !== line.y2) {
		x += xIncrement;
		y += yIncrement;
		// points.push(`${x},${y}`);
		points.push({x, y});
	}
	return points;
};

const parseData = (dataString) => {
	const inputLines = dataString.split("\n");
	const lines = inputLines.filter(s => s !== "").map(lineString => {
		const points = lineString.split(" -> ").map(pointString => {
			return pointString.split(",").map(value => parseInt(value));
		});
		return {
			x1: points[0][0], y1: points[0][1], x2: points[1][0], y2: points[1][1]
		};
	});
	return lines;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");