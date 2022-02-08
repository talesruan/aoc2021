const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const numberOfSteps = 40;
// const maxElements = 201326593; // 26
const maxElements = 3298534883329; // 40
// const maxElements = 3221225473; // 30

const fn = input => {
	const data = parseInput(input);
	const elementsCount = runSteps(numberOfSteps, data.template, data.rules);
	delete elementsCount.total;
	const sortedElementsCount = Object.values(elementsCount).sort((a, b) => a - b);
	const mostCommonElementCount = sortedElementsCount[sortedElementsCount.length - 1];
	const leastCommonElementCount = sortedElementsCount[0];
	console.log("mostCommonElementCount", mostCommonElementCount);
	console.log("leastCommonElementCount", leastCommonElementCount);
	return mostCommonElementCount - leastCommonElementCount;
};

const countElement = (element, elementCount) => {
	elementCount.total++;
	if (elementCount.total % 10000000 === 0) console.log(`E ${elementCount.total}/${maxElements}`, (elementCount.total / maxElements * 100).toFixed(5) + "%");
	if (!elementCount[element]) elementCount[element] = 0;
	elementCount[element]++;
	return elementCount;
};

const runSteps = (steps, template, rules) => {
	const elementsCount = {total: 0};
	dfs(steps, 0, template, elementsCount, rules);
	countElement(template[template.length - 1], elementsCount);
	console.log("elementCount", JSON.stringify(elementsCount, null, 2));
	return elementsCount;
};

const dfs = (targetStep, currentStep, polymer, elementsCount, rules) => {
	if (targetStep === currentStep) {
		// console.log("Stopping here", polymer);
		countElement(polymer[0], elementsCount);
		countElement(polymer[1], elementsCount);
		return;
	}
	for (let index = 0; index < polymer.length - 1; index++) {
		const scannedPart = polymer[index] + polymer[index + 1];
		const rule = findRule(scannedPart, rules);
		const newPolymer = polymer[index] + rule + polymer[index + 1];
		dfs(targetStep, currentStep + 1, newPolymer, elementsCount, rules);
	}
};

const findRule = (key, rules) => {
	return rules[key];
};

const parseInput = input => {
	const data = {rules: []};
	let lineNumber = 0;
	for (const line of input.split("\n").filter(l => l !== "")) {
		if (lineNumber === 0) {
			data.template = line;
		} else {
			const parsedRule = line.split(" -> ");
			data.rules[parsedRule[0]] = parsedRule[1];
		}
		lineNumber++;
	}
	return data;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
