const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const data = parseInput(input);
	const uniqueLengths = [2, 4, 3, 7];
	let uniqueCount = 0;
	for (const line of data) {
		for (const digit of line.output) {
			if (uniqueLengths.includes(digit.length)) uniqueCount++;
		}
	}
	return uniqueCount;
};

const parseInput = (input) => {
	return input.split("\n").map(line => {
		const parts = line.split("|").map(p => p.trim());
		return {
			signals: parts[0].split(" "),
			output: parts[1].split(" ")
		};
	});
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
