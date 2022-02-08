const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const numberOfSteps = 10;
	const data = parseInput(input);
	const elementsCount = runSteps(numberOfSteps, data.template, data.rules);
	const sortedElementsCount = Object.values(elementsCount).sort((a, b) => a - b);
	const mostCommonElementCount = sortedElementsCount[sortedElementsCount.length - 1];
	const leastCommonElementCount = sortedElementsCount[0];
	console.log("mostCommonElementCount", mostCommonElementCount);
	console.log("leastCommonElementCount", leastCommonElementCount);
	return mostCommonElementCount - leastCommonElementCount;
};

const countElements = (polymer, elementCount) => {
	for (const element of polymer.split("")) {
		if (!elementCount[element]) elementCount[element] = 0;
		elementCount[element]++;
	}
	return elementCount;
};

const runSteps = (steps, template, rules) => {
	const elementsCount = {};
	dfs(steps, 0, template, elementsCount, rules);
	console.log("elementCount", JSON.stringify(elementsCount, null, 2));
	countElements(template[template.length - 1], elementsCount);
	return elementsCount;
};

const dfs = (targetStep, currentStep, polymer, elementsCount, rules) => {
	if (targetStep === currentStep) {
		// console.log("Stopping here", polymer);
		countElements(polymer[0] + polymer[1], elementsCount);
		return;
	}
	for (let index = 0; index < polymer.length - 1; index++) {
		const scannedPart = polymer[index] + polymer[index + 1];
		const rule = findRule(scannedPart, rules);
		const newPolymer = polymer[index] + rule.value + polymer[index + 1];
		dfs(targetStep, currentStep + 1, newPolymer, elementsCount, rules);
	}
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
