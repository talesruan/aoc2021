const fs = require('fs')

const data = fs.readFileSync('demoinput.txt', 'utf8')
console.time("Elapsed time")

const fn = () => {
	const o2GenRating = calculateValue(true,"1");
	const co2ScrubberRating = calculateValue(false,"0");
	console.log("o2GenRating", o2GenRating);
	console.log("co2ScrubberRating", co2ScrubberRating);
	return o2GenRating * co2ScrubberRating;
};

const calculateValue = (useMostCommonDigitCriteria, tieBreaker) => {
	let lines = data.split("\n");
	let digitIndex = 0;
	while (lines.length > 1) {
		const digitCount = countDigitsInIndex(lines, digitIndex);
		let filterByDigit;
		if (digitCount["0"] === digitCount["1"]) {
			filterByDigit = tieBreaker;
		} else {
			if (useMostCommonDigitCriteria) {
				filterByDigit = digitCount["0"] >= digitCount["1"] ? "0" : "1";
			} else {
				filterByDigit = digitCount["0"] >= digitCount["1"] ? "1" : "0";
			}
		}
		lines = lines.filter(l => l.substring(digitIndex, digitIndex + 1) === filterByDigit);
		digitIndex++;
	}
	return parseInt(lines[0], 2);
};

const countDigitsInIndex = (lines, index) => {
	const count = {};
	for (const line of lines) {
		const digit = line.substring(index, index + 1);
		count[digit] = (count[digit] || 0) + 1;
	}
	return count;
}

console.log("Result: ", fn ());
console.timeEnd('Elapsed time');
