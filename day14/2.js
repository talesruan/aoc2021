const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const numberOfSteps = 40;
const cache = {};

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

const countElement = (element, elementCount, number = 1) => {
	if (!elementCount[element]) elementCount[element] = 0;
	elementCount[element] += number;
	return elementCount;
};

/**
 * Modifies the first counter, does not change the other
 */
const mergeCounters = (counter, otherCounter) => {
	for (const key in otherCounter) {
		countElement(key, counter, otherCounter[key]);
	}
};

const runSteps = (steps, template, rules) => {
	const elementsCount = dfs(steps, 0, template, rules);
	countElement(template[template.length - 1], elementsCount);
	console.log("elementCount", JSON.stringify(elementsCount, null, 2));
	return elementsCount;
};

const dfs = (targetStep, currentStep, polymer, rules, stack = []) => {
	if (targetStep === currentStep) {
		const counter = {};
		countElement(polymer[0], counter);
		countElement(polymer[1], counter);
		addToCache(stack, counter, currentStep - 1, 2);
		return counter;
	}
	const counter = {};
	for (let index = 0; index < polymer.length - 1; index++) {
		const pair = polymer[index] + polymer[index + 1];
		const stepsToGo = numberOfSteps - currentStep;
		const cacheEntry = getCache(pair, stepsToGo);
		if (isCacheComplete(cacheEntry, stepsToGo)) {
			mergeCounters(counter, cacheEntry.counter);
			addToCache([...stack, pair], cacheEntry.counter, currentStep, cacheEntry.nodes);
		} else {
			const scannedPart = polymer[index] + polymer[index + 1];
			const rule = findRule(scannedPart, rules);
			const newPolymer = polymer[index] + rule + polymer[index + 1];
			const branchCounter = dfs(targetStep, currentStep + 1, newPolymer, rules, [...stack, pair]);
			mergeCounters(counter, branchCounter);
		}
	}
	return counter;
};

const getCache = (polymerRule, level) => {
	if (!cache[polymerRule]) cache[polymerRule] = [];
	if (!cache[polymerRule][level]) cache[polymerRule][level] = {nodes: 0, counter: {}};
	return cache[polymerRule][level];
};

const isCacheComplete = (cacheEntry, level) => {
	return cacheEntry.nodes >= Math.pow(2, level);
};

const addToCache = (stack, counter, currentStep, nodesAdded = 1) => {
	for (let i = 0; i < stack.length; i++) {
		const cacheLevel = (numberOfSteps - currentStep) + (stack.length - i - 1);
		const polymer = stack[i];
		const cacheEntry = getCache(polymer, cacheLevel);
		if (isCacheComplete(cacheEntry, cacheLevel)) continue;
		mergeCounters(cacheEntry.counter, counter);
		cacheEntry.nodes += nodesAdded;
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
