const fs = require("fs");

const data = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = function () {
	console.log("data", JSON.stringify(data, null, 2));
	for (const line of data.split("\n")) {
		console.log("line ", line);
	}
};

console.log("Result: ", fn());
console.timeEnd("Elapsed time");
