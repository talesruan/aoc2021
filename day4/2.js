const fs = require('fs')
const data = fs.readFileSync('input.txt', 'utf8')
console.time("Elapsed time")

const bingoGridSize = 5;

const fn = function () {
	const parsedData = parseData(data);
	const numbersDrawnSoFar = [];
	let boards = parsedData.boards;
	for (const drawnNumber of parsedData.drawnNumbers) {
		numbersDrawnSoFar.push(drawnNumber);
		if (numbersDrawnSoFar.length < bingoGridSize) continue; // can't possibly win with < 5 numbers drawn
		const competingBoards = [];
		for (const board of boards) {
			if (isBoardWon(board, numbersDrawnSoFar)) {
				if (boards.length === 1) {
					console.log("Found last winning board.");
					return calculateBoardScore(board, numbersDrawnSoFar, drawnNumber);
				}
				continue;
			}
			competingBoards.push(board);
		}
		boards = competingBoards;
	}
};

const parseData = (dataString) => {
	const lines = dataString.split("\n");
	const drawnNumbers = lines[0].split(",").map(n => parseInt(n));
	const boards = [];
	for (let lineNumber = 1; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		if (line === "") continue;
		const boardNumber = Math.trunc((lineNumber-1) / (bingoGridSize + 1));
		const rowNumber = (lineNumber-2) % (bingoGridSize + 1);
		const parsedRow = line.trim().split(/\s+/).map(n => parseInt(n));
		if (rowNumber === 0) boards[boardNumber] = [];
		boards[boardNumber][rowNumber] = parsedRow;
	}
	return {drawnNumbers, boards};
};

const isBoardWon = (board, drawnNumbers) => {
	const hitMatrix = getHitMatrix(board, drawnNumbers); // I know it can be more efficient if I store the hit matrix and do not recalculate everytime
	for (let a = 0; a < bingoGridSize; a++) {
		let rowHit = true;
		let columnHit = true;
		for (let b = 0; b < bingoGridSize; b++) {
			rowHit = rowHit && hitMatrix[a][b]
			columnHit = columnHit && hitMatrix[b][a]
		}
		if (rowHit || columnHit) return true;
	}
	return false;
};

const calculateBoardScore = (board, drawnNumbers, lastNumberDrawn) => {
	const hitMatrix = getHitMatrix(board, drawnNumbers);
	let sumOfUnmarkedNumbers = 0;
	for (let a = 0; a < bingoGridSize; a++) {
		for (let b = 0; b < bingoGridSize; b++) {
			if (!hitMatrix[a][b]) sumOfUnmarkedNumbers += board[a][b];
		}
	}
	return sumOfUnmarkedNumbers * lastNumberDrawn
}

const getHitMatrix = (board, drawnNumbers) => {
	const rows = [];
	for (let rowNumber = 0; rowNumber < bingoGridSize; rowNumber++) {
		const row = []
		for (let colNumber = 0; colNumber < bingoGridSize; colNumber++) {
			const isMatch = drawnNumbers.includes(board[rowNumber][colNumber]);
			row.push(isMatch);
		}
		rows.push(row);
	}
	return rows;
};

console.log("Result: ", fn ());
console.timeEnd('Elapsed time');
