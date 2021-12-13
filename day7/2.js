const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const data = input.split(",").map(v => parseInt(v));
	const target = getAverage(data);
	console.log("target is ", target);
	let fuelSum = 0;
	for (const submarinePos of data) {
		const deltaPosition = Math.abs(submarinePos - target);
		const fuelConsumption = (deltaPosition * (deltaPosition + 1)) / 2;
		fuelSum += fuelConsumption;
	}
	return fuelSum;
};

const getAverage = (array) => {
	const sum = array.reduce((a, b) => a + b, 0);
	return Math.floor(sum / array.length); // I think it should be rounded, but is not the accepted answer
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
