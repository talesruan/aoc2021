const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')
console.time("Elapsed time")

const fn = function () {
	let horizontalPosition = 0;
	let depth = 0;
	for (const line of data.split("\n")) {
		const command = line.split(" ")[0];
		const value = parseInt(line.split(" ")[1]);
		if (command === "forward") horizontalPosition += value;
		if (command === "up") depth -= value;
		if (command === "down") depth += value;
	}
	console.log("Horizontal Position: ", horizontalPosition);
	console.log("Depth: ", depth);
	return horizontalPosition * depth;
};

console.log("Result: ", fn ());
console.timeEnd('Elapsed time');
