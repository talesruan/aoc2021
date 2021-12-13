/**
 * Big inputs from https://the-tk.com/project/aoc2021-bigboys.html
 * This solution completes under a second.
 */
const fs = require("fs");

const input = fs.readFileSync("biginput.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const data = parseInput(input);
	let sum = 0;
	for (const line of data) {
		const dictionaryMap = getDictionaryFromSignals(line.signals);
		let value = "";
		for (const digit of line.output) {
			value += decodeDigit(digit, dictionaryMap);
		}
		sum += parseInt(value);
	}
	return sum;
};

const dictionaryCache = new Map();

const getCacheKey = (signals) => {
	return signals.join("|");
};

const getDictionaryFromSignals = (signals) => {
	// try from cache
	const cacheKey = getCacheKey(signals);
	if (dictionaryCache.has(cacheKey)) return dictionaryCache.get(cacheKey);
	const digit = [];
	// first get the easy/unique ones:
	digit[1] = signals.find(s => s.length === 2);
	digit[4] = signals.find(s => s.length === 4);
	digit[7] = signals.find(s => s.length === 3);
	digit[8] = signals.find(s => s.length === 7);
	// get 9
	digit[9] = signals.find(s => s.length === 6 && signalIncludes(s, digit[4]));
	// get 0
	digit[0] = signals.find(s => s.length === 6 && s !== digit[9] && signalIncludes(s, digit[1]));
	// get 6
	digit[6] = signals.find(s => s.length === 6 && s !== digit[9] && s !== digit[0]);
	// get 3
	digit[3] = signals.find(s => s.length === 5 && signalIncludes(s, digit[1]));
	// get 5
	digit[5] = signals.find(s => s.length === 5 && signalIncludes(digit[6], s));
	// get 2
	digit[2] = signals.find(s => s.length === 5 && s !== digit[3] && s !== digit[5]);
	const dictionary = new Map();
	for (let i = 0; i < 10; i++) {
		if (!digit[i]) continue;
		dictionary.set(digit[i], i);
	}
	dictionaryCache.set(cacheKey, dictionary);
	return dictionary;
};

/**
 * check if b is contained in a
 */
const signalIncludes = (a, b) => {
	const lettersB = b.split("");
	for (const letter of lettersB) {
		if (!a.includes(letter)) return false;
	}
	return true;
};

const decodeDigit = (digitString, dictionaryMap) => {
	return dictionaryMap.get(sortLetters(digitString));
};

const sortLetters = (string) => {
	return string.split("").sort().join("");
};

const parseInput = (input) => {
	return input.split("\n").filter(s => s !== "").map(line => {
		const parts = line.split("|").map(p => p.trim());
		return {
			signals: parts[0].split(" ").map(s => sortLetters(s)).sort(),
			output: parts[1].split(" ")
		};
	});
};

console.log("Result: ", fn(input));
console.log("Expect: ", 498570828);
console.timeEnd("Elapsed time");
