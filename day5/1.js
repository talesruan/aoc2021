const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const data = parseData(input);
	const overlapPoints = new Set();
	const lineOccurrencePoints = new Set();
	const horizontalAndVerticalLines = data.filter(line => line.x1 === line.x2 || line.y1 === line.y2);
	for (let index = 0; index < horizontalAndVerticalLines.length; index++) {
		console.log("Line ", index, "of", horizontalAndVerticalLines.length);
		const line = horizontalAndVerticalLines[index];
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
	const points = [];
	for (let x = Math.min(line.x1, line.x2); x <= Math.max(line.x1, line.x2); x++) {
		for (let y = Math.min(line.y1, line.y2); y <= Math.max(line.y1, line.y2); y++) {
			points.push(`${x},${y}`);
		}
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