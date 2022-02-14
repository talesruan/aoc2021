const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const numberOfSteps = 10;
	const data = parseInput(input);
	const finalPolymer = runSteps(numberOfSteps, data.template, data.rules);
	const elementsCount = countElements(finalPolymer);
	const sortedElementsCount = Object.values(elementsCount).sort((a, b) => a - b);
	const mostCommonElementCount = sortedElementsCount[sortedElementsCount.length - 1];
	const leastCommonElementCount = sortedElementsCount[0];
	console.log("mostCommonElementCount", mostCommonElementCount);
	console.log("leastCommonElementCount", leastCommonElementCount);
	return mostCommonElementCount - leastCommonElementCount;
};

const countElements = polymer => {
	const elementCount = {};
	for (const element of polymer.split("")) {
		if (!elementCount[element]) elementCount[element] = 0;
		elementCount[element]++;
	}
	return elementCount;
};

const runSteps = (steps, template, rules) => {
	let polymer = template;
	console.log("Template:", template);
	for (let i = 0; i < steps; i++) {
		console.log("Running step", i + 1);
		polymer = step(polymer, rules);
	}
	return polymer;
};

const step = (polymer, rules) => {
	const newPolymer = polymer.split("");
	let insertionIndex = 0;
	for (let index = 0; index < polymer.length - 1; index++) {
		insertionIndex++;
		const scannedPart = polymer[index] + polymer[index + 1];
		const rule = findRule(scannedPart, rules);
		if (rule) {
			newPolymer.splice(insertionIndex, 0, rule.value);
			insertionIndex++;
		}
	}
	return newPolymer.join("");
};

const findRule = (key, rules) => {
	return rules.find(rule => rule.condition === key);
};

const parseInput = input => {
	const data = {rules: []};
	let lineNumber = 0;
	for (const line of input.split("\n").filter(l => l !== "")) {
		if (lineNumber === 0) {
			data.template = line;
		} else {
			const parsedRule = line.split(" -> ");
			data.rules.push({condition: parsedRule[0], value: parsedRule[1]});
		}
		lineNumber++;
	}
	return data;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
