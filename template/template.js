const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	console.log("data", JSON.stringify(input, null, 2));
	for (const line of input.split("\n")) {
		console.log("line ", line);
	}
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
