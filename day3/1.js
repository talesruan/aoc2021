const fs = require('fs')

const data = fs.readFileSync('input.txt', 'utf8')
console.time("Elapsed time")

const fn = function () {
	const countBitsByIndex = [];
	for (const line of data.split("\n")) {
		const digits = line.split("");
		for (let index = 0; index < digits.length; index++) {
			if (!countBitsByIndex[index]) countBitsByIndex[index] = [];
			const digit = parseInt(digits[index]);
			countBitsByIndex[index][digit] = (countBitsByIndex[index][digit] || 0) + 1;
		}
	}
	let gammaRate = "";
	let epsilonRate = "";
	for (const digitCount of countBitsByIndex) {
		if (digitCount[0] >= digitCount [1] ) {
			gammaRate += "0";
			epsilonRate += "1"
		} else {
			gammaRate += "1";
			epsilonRate += "0"
		}
	}
	const decimalGammaRate = parseInt(gammaRate, 2);
	const decimalEpsilonRate = parseInt(epsilonRate, 2);
	console.log("Gamma Rate", gammaRate, decimalGammaRate);
	console.log("Epsilon Rate", epsilonRate, decimalEpsilonRate);
	return decimalGammaRate * decimalEpsilonRate;
};

console.log("Result: ", fn ());
console.timeEnd('Elapsed time');
