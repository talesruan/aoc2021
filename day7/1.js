const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const data = input.split(",").map(v => parseInt(v)).sort((a, b) => a - b);
	const target = getMedian(data);
	console.log("target is ", target);
	let fuelSum = 0;
	for (const submarinePos of data) {
		const fuelConsumption = Math.abs(submarinePos - target);
		fuelSum += fuelConsumption;
	}
	return fuelSum;
};

const getMedian = (sortedArray) => {
	if (sortedArray.length % 2 === 1) {
		const middle = Math.floor(sortedArray.length / 2);
		return sortedArray[middle];
	}
	const middle1 = (sortedArray.length / 2) - 1;
	const middle2 = (sortedArray.length / 2);
	return (sortedArray[middle1] + sortedArray[middle2]) / 2
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
