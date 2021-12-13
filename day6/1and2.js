const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input, numberOfDaysToSimulate) {
	const data = input.split(",").map(v => parseInt(v));
	let fishCountByTimer = new Array(9).fill(0);
	for (const fishTimer of data) {
		fishCountByTimer[fishTimer]++;
	}
	for (let day = 0; day < numberOfDaysToSimulate; day++) {
		fishCountByTimer = passDay(fishCountByTimer);
	}
	return countFish(fishCountByTimer);
};

const countFish = (fishCountByTimer) => {
	return fishCountByTimer.reduce((prev, value) => prev + value, 0);
};

const passDay = (fishCountByTimer) => {
	const newFishPopulation = [];
	for (let timer = 0; timer < 8; timer++) {
		newFishPopulation[timer] = fishCountByTimer[timer + 1];
	}
	newFishPopulation[6] += fishCountByTimer[0];
	newFishPopulation[8] = fishCountByTimer[0];
	return newFishPopulation;
};

console.log("Result: ", fn(input, 80)); // part 1
console.log("Result: ", fn(input, 256)); // part 2
console.timeEnd("Elapsed time");
