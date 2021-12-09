/**
 * Big inputs from https://the-tk.com/project/aoc2021-bigboys.html
 * This solution completes under 2s
 */

const fs = require("fs");
const data = fs.readFileSync("biginput.txt", "utf8");
console.time("Elapsed time");

let bingoGridSize;

const fn = function () {
	console.log("Parsing data...");
	const parsedData = parseData(data);
	console.log("Grid size is ", bingoGridSize);
	const numberPositionMap = getNumberPositionMap(parsedData.boards);
	const numbersDrawnSoFar = [];
	let winningBoards = 0;
	for (const drawnNumber of parsedData.drawnNumbers) {
		console.log(`Drawing number ${numbersDrawnSoFar.length}/${parsedData.drawnNumbers.length} - ${(numbersDrawnSoFar.length/parsedData.drawnNumbers.length*100).toFixed(2)}%`, drawnNumber);
		numbersDrawnSoFar.push(drawnNumber);
		if (!numberPositionMap[drawnNumber]) continue;
		for (const appearance of numberPositionMap[drawnNumber]) {
			if (appearance.board.winner) continue;
			appearance.board.marks[appearance.a][appearance.b] = true;
			appearance.board.hits++;
			appearance.board.hitsByRow[appearance.a] = appearance.board.hitsByRow[appearance.a] ? appearance.board.hitsByRow[appearance.a] + 1 : 1;
			appearance.board.hitsByCol[appearance.b] = appearance.board.hitsByCol[appearance.b] ? appearance.board.hitsByCol[appearance.b] + 1 : 1;
			if (numbersDrawnSoFar.length >= bingoGridSize && isBoardWon(appearance.board)) {
				appearance.board.winner = true;
				winningBoards++;
				if (winningBoards === parsedData.boards.length) {
					console.log("Found last winning board.");
					return calculateBoardScore(appearance.board, numbersDrawnSoFar, drawnNumber);
				}
			}
		}
	}
};

const getNumberPositionMap = (boards) => {
	const map = [];
	for (const board of boards) {
		for (let a = 0; a < bingoGridSize; a++) {
			for (let b = 0; b < bingoGridSize; b++) {
				const number = board.numbers[a][b];
				const appearance = {board, a, b};
				if (!map[number]) map[number] = [];
				map[number].push(appearance);
			}
		}
	}
	return map;
};

const findBingoGridSize = (inputLines) => {
	return inputLines[3].trim().split(/\s+/).length;
};

const parseData = (dataString) => {
	const lines = dataString.split("\n");
	bingoGridSize = findBingoGridSize(lines);
	const drawnNumbers = lines[0].split(",").map(n => parseInt(n));
	const boards = [];
	for (let lineNumber = 1; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		if (line === "") continue;
		const boardNumber = Math.trunc((lineNumber - 1) / (bingoGridSize + 1));
		const rowNumber = (lineNumber - 2) % (bingoGridSize + 1);
		const parsedRow = line.trim().split(/\s+/).map(n => parseInt(n));
		if (rowNumber === 0) {
			boards[boardNumber] = {
				numbers: [],
				marks: [],
				hits: 0,
				hitsByRow: [],
				hitsByCol: []
			};
		}
		boards[boardNumber].numbers[rowNumber] = parsedRow;
		boards[boardNumber].marks[rowNumber] = parsedRow.map(() => false);
	}
	return {drawnNumbers, boards};
};

const isBoardWon = (board) => {
	if (board.hits < bingoGridSize) return false;
	return board.hitsByRow.some(hitCount => hitCount >= bingoGridSize) || board.hitsByCol.some(hitCount => hitCount >= bingoGridSize);
};

const calculateBoardScore = (board, drawnNumbers, lastNumberDrawn) => {
	let sumOfUnmarkedNumbers = 0;
	for (let a = 0; a < bingoGridSize; a++) {
		for (let b = 0; b < bingoGridSize; b++) {
			if (!board.marks[a][b]) sumOfUnmarkedNumbers += board.numbers[a][b];
		}
	}
	return sumOfUnmarkedNumbers * lastNumberDrawn;
};

console.log("Result: ", fn());
console.timeEnd("Elapsed time");
