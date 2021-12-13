/**
 * Big inputs from https://the-tk.com/project/aoc2021-bigboys.html
 */
const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = function (input, numberOfDaysToSimulate) {
	const data = input.split(",").map(v => parseInt(v));
	console.log(data);
	let fishCountByTimer = new Array(9).fill(BigInt(0));
	for (const fishTimer of data) {
		fishCountByTimer[fishTimer]++;
	}
	for (let day = 0; day < numberOfDaysToSimulate; day++) {
		if (day % 10000 === 0) console.log("Day", day + 1, (day / numberOfDaysToSimulate * 100).toFixed(2) + "%");
		fishCountByTimer = passDay(fishCountByTimer);
	}
	return countFish(fishCountByTimer);
};

const countFish = (fishCountByTimer) => {
	return fishCountByTimer.reduce((prev, value) => prev + value, BigInt(0));
};

const passDay = (fishCountByTimer) => {
	const newFishPopulation = [];
	newFishPopulation[0] = fishCountByTimer[1];
	newFishPopulation[1] = fishCountByTimer[2];
	newFishPopulation[2] = fishCountByTimer[3];
	newFishPopulation[3] = fishCountByTimer[4];
	newFishPopulation[4] = fishCountByTimer[5];
	newFishPopulation[5] = fishCountByTimer[6];
	newFishPopulation[6] = fishCountByTimer[7] + fishCountByTimer[0];
	newFishPopulation[7] = fishCountByTimer[8];
	newFishPopulation[8] = fishCountByTimer[0];
	return newFishPopulation;
};

const display = (count) => {
	for (let i = 0; i < count.length; i++) {
		console.log(`T ${i}`, count[i]);
	}
	console.log("Fish count: ", countFish(count));
};

// console.log("Result: ", fn(input, 80)); // part 1
// console.log("Result: ", fn(input, 256)); // part 2
console.log("Result: ", fn(input, 9999999)); // big inputs: completes in 2m 24s
// console.log("Result: ", fn(input, 67108864));
console.timeEnd("Elapsed time");
