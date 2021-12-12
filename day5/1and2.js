const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const considerDiagonalLines = true; // set true for part 2

const fn = function (input) {
	const data = parseData(input);
	const overlapPoints = new Set();
	const lineOccurrencePoints = new Set();
	const lines = considerDiagonalLines ? data : data.filter(line => line.x1 === line.x2 || line.y1 === line.y2);
	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		for (const point of getLinePoints(line)) {
			if (lineOccurrencePoints.has(point)) {
				overlapPoints.add(point);
			} else {
				lineOccurrencePoints.add(point);
			}
		}
	}
	return overlapPoints.size;
};

const getLinePoints = (line) => {
	const xIncrement = Math.sign(line.x2 - line.x1);
	const yIncrement = Math.sign(line.y2 - line.y1);
	const points = [];
	let x = line.x1;
	let y = line.y1;
	points.push(`${x},${y}`);
	while (x !== line.x2 || y !== line.y2) {
		x += xIncrement;
		y += yIncrement;
		points.push(`${x},${y}`);
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