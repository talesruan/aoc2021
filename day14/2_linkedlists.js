const fs = require("fs");

const input = fs.readFileSync("demoinput.txt", "utf8");
console.time("Elapsed time");

const fn = input => {
	const numberOfSteps = 10;
	const data = parseInput(input);
	const finalPolymer = runSteps(numberOfSteps, data.template, data.rules);
	const elementsCount = countElements(polymerToString(finalPolymer));
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
	const polymer = template;
	console.log("Template:", polymerToString(template));
	for (let i = 0; i < steps; i++) {
		console.log("Running step", i + 1, "size:", polymer.length);
		console.time("Step" + i);
		step(polymer, rules, i);
		console.timeEnd("Step" + i);
		// console.log("After step", i + 1, polymerToString(polymer));
	}
	return polymer;
};

const polymerToString = polymer => {
	let element = polymer;
	let str = element.value;
	while (element.next) {
		element = element.next;
		str += element.value;
	}
	return str;
};

const step = (polymer, rules, i) => {
	let prev = polymer;
	let curr = prev.next;
	do {
		const rule = findRule(prev.value + curr.value, rules);
		if (rule) {
			const newElement = {value: rule, next: curr};
			prev.next = newElement;
		}
		prev = curr;
		curr = curr.next;
	} while (prev.next);
	return polymer;
};

const findRule = (key, rules) => {
	return rules[key];
};

const parseInput = input => {
	const data = {rules: []};
	let lineNumber = 0;
	for (const line of input.split("\n").filter(l => l !== "")) {
		if (lineNumber === 0) {
			let previous;
			let first;
			for (const letter of line.split("")) {
				const e = {value: letter};
				if (previous) previous.next = e;
				if (!first) first = e;
				previous = e;
			}
			data.template = first;
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
