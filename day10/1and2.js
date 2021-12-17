const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const delimiters = [
	{begin: "(", end: ")", syntaxErrorPoints: 3, autoCompletePoints: 1},
	{begin: "[", end: "]", syntaxErrorPoints: 57, autoCompletePoints: 2},
	{begin: "{", end: "}", syntaxErrorPoints: 1197, autoCompletePoints: 3},
	{begin: "<", end: ">", syntaxErrorPoints: 25137, autoCompletePoints: 4}
];

const fn = function (input) {
	let syntaxErrorScore = 0;
	const autoCompleteScores = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		const stack = [];
		let isLineCorrupted = false;
		for (const character of line.split("")) {
			if (isEndDelimiter(character)) {
				const expected = stack.shift() || "";
				if (character !== expected) {
					// console.log("Expected", expected, ", but found", character, "instead.");
					syntaxErrorScore += getSyntaxErrorPoints(character);
					isLineCorrupted = true;
					break;
				}
			} else {
				const nextExpected = getDelimiterData(character).end;
				stack.unshift(nextExpected);
			}
		}
		if (isLineCorrupted) continue;
		if (stack.length > 0) {
			autoCompleteScores.push(getAutocompleteScore(stack));
		}
	}

	const sortedAutoCompleteScores = autoCompleteScores.sort((a, b) => a - b);
	const autoCompleteMiddleScore = sortedAutoCompleteScores[Math.floor(sortedAutoCompleteScores.length / 2)];

	console.log("syntaxErrorScore (part 1)..........:", syntaxErrorScore);
	console.log("autoCompleteMiddleScore (part 2)...:", autoCompleteMiddleScore);
};

const isEndDelimiter = (character) => {
	return delimiters.some(d => d.end === character);
};

const getDelimiterData = (character) => {
	return delimiters.find(d => d.begin === character);
};

const getAutocompleteScore = (stack) => {
	let score = 0;
	for (const character of stack) {
		const points = delimiters.find(d => d.end === character).autoCompletePoints;
		score = (score * 5) + points;
	}
	return score;
};

const getSyntaxErrorPoints = (character) => {
	return delimiters.find(d => d.end === character).syntaxErrorPoints;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
