const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const numberOfSteps = 10;
// const maxElements = 201326593; // 26
const maxElements = 3298534883329; // 40
// const maxElements = 3221225473; // 30

// max integer
// 9007199254740991
// 1099511627776

const cache = {};

let visitedElementsCount = 0;

const displayProgress = () => {
	if (visitedElementsCount % 1000000 === 0) console.log(`E ${visitedElementsCount}/${maxElements}`, (visitedElementsCount / maxElements * 100).toFixed(5) + "%");
};

const fn = input => {
	const data = parseInput(input);
	const elementsCount = runSteps(numberOfSteps, data.template, data.rules);
	delete elementsCount.total;
	const sortedElementsCount = Object.values(elementsCount).sort((a, b) => a - b);
	const mostCommonElementCount = sortedElementsCount[sortedElementsCount.length - 1];
	const leastCommonElementCount = sortedElementsCount[0];
	console.log("mostCommonElementCount", mostCommonElementCount);
	console.log("leastCommonElementCount", leastCommonElementCount);
	console.log("visitedElementsCount", visitedElementsCount + 1);

	// console.log("cache", JSON.stringify(cache, null, 2));

	return mostCommonElementCount - leastCommonElementCount;
};

const countElement = (element, elementCount, number = 1) => {
	if (!elementCount[element]) elementCount[element] = 0;
	elementCount[element] += number;
	return elementCount;
};

/**
 * Modifies the first counter
 */
const mergeCounters = (counter, otherCounter) => {
	for (const key in otherCounter) {
		countElement(key, counter, otherCounter[key]);
	}
};

const runSteps = (steps, template, rules) => {
	// const elementsCount = {total: 0};
	const elementsCount = dfs(steps, 0, template, rules);
	countElement(template[template.length - 1], elementsCount);
	console.log("elementCount", JSON.stringify(elementsCount, null, 2));
	return elementsCount;
};

const dfs = (targetStep, currentStep, polymer, rules, stack = []) => {
	if (targetStep === currentStep) {
		// console.log("Stopping here", polymer, "stack", stack);
		const counter = {};
		countElement(polymer[0], counter);
		countElement(polymer[1], counter);
		visitedElementsCount += 2; // temp
		displayProgress();
		addToCache(stack, counter, currentStep - 1, 2);
		return counter;
	}
	// cacheThisToParent(polymer, stack);
	const counter = {};
	for (let index = 0; index < polymer.length - 1; index++) {
		const pair = polymer[index] + polymer[index + 1];
		const stepsToGo = numberOfSteps - currentStep;

		// console.log("Im at level", currentStep, "pair", pair, "steps to go", stepsToGo);
		const cacheEntry = getCache(pair, stepsToGo);
		if (isCacheComplete(cacheEntry, stepsToGo)) {
			// console.log("Got a complete cache ", pair, "levels to go", stepsToGo);
			if (stepsToGo > 1) {
				console.log("Used a cache so didn't have to go down", stepsToGo, "levels", "pair", pair);
				console.log("cacheEntry", JSON.stringify(cacheEntry, null, 2));
			}
			mergeCounters(counter, cacheEntry.counter);
			// used cache
			addToCache([...stack, pair], cacheEntry.counter, currentStep, cacheEntry.nodes);
			visitedElementsCount += (cacheEntry.nodes * 2);
			displayProgress();
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

const cacheThisToParent = (polymer, stack) => {
	if (stack.length === 0) return;
	const parent = stack[stack.length - 1];
	const cacheEntry = getCache(parent, 1);
	if (isCacheComplete(cacheEntry, 1)) {
		// console.log("> Cache for ", polymer, "level", 1, " already complete");
		return;
	}
	const counter = {};
	countElement(polymer[0], counter);
	countElement(polymer[1], counter);
	mergeCounters(cacheEntry.counter, counter);
	cacheEntry.nodes++;
};

const getCache = (polymerRule, level) => {
	// if (!cache[polymerRule]) cache.polymerRule = {nodes: 0, counter: {}};
	if (!cache[polymerRule]) cache[polymerRule] = [];
	if (!cache[polymerRule][level]) cache[polymerRule][level] = {nodes: 0, counter: {}};
	return cache[polymerRule][level];
};

const isCacheComplete = (cacheEntry, level) => {
	return cacheEntry.nodes >= Math.pow(2, level);
};

const addToCache = (stack, counter, currentStep, nodesAdded = 1) => {
	console.log("=> Adding to cache", stack, "counter", counter, "nodes", nodesAdded, "currentStep", currentStep);
	// console.log("travelling stack");
	for (let i = 0; i < stack.length; i++) {
		const reverseStackLevel = (stack.length - i - 1);
		console.log("reverseStackLevel", reverseStackLevel);
		const relativeLevel = (numberOfSteps - currentStep) + reverseStackLevel;

		const polymer = stack[i];
		// console.log(stack.length - i, " - ", stack[i]);
		const cacheEntry = getCache(polymer, relativeLevel);
		if (isCacheComplete(cacheEntry, relativeLevel)) {
			console.log("> Cache for ", polymer, "level", relativeLevel, " already complete");
		} else {
			console.log("> Adding counter to cache key ", polymer, "level", relativeLevel, "counter", counter);
			mergeCounters(cacheEntry.counter, counter);
			cacheEntry.nodes += nodesAdded;
			if (cacheEntry.nodes > Math.pow(2, relativeLevel)) {
				console.log("Error ====");
				console.log("Adding ");
				console.log("counter", JSON.stringify(counter, null, 2));
				console.log("stack", stack);
				console.log("Polymer", polymer);
				console.log("Error ====");
				throw new Error(`Exceed number of nodes! Level ${relativeLevel} with ${cacheEntry.nodes} nodes, max ${Math.pow(2, relativeLevel)} (just added ${nodesAdded})`);
			}
		}
		if (relativeLevel > numberOfSteps) throw new Error(`Calculated relative level to ${relativeLevel}`);
		if (relativeLevel <= 0) throw new Error(`Calculated relative level to ${relativeLevel}`);
	}
	// console.log("-----");
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
