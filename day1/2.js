import input from "./input.js";

const demoInput = [
	199,
	200,
	208,
	210,
	200,
	207,
	240,
	269,
	260,
	263
];

const calculateIncrements = (input) => {
	let increments = 0;
	let previousSum;
	const windowSize = 3;
	for(let i = 0; i < input.length; i++) {
		let currentSum = 0;
		for (let offset = 0; offset < windowSize; offset++) {
			const index = i + offset;
			if (index >= input.length) return increments;
			currentSum += input[index];
		}
		if (previousSum != undefined && previousSum < currentSum) increments++;
		previousSum = currentSum;
	}	
}

console.log("Result: ", calculateIncrements(input));

