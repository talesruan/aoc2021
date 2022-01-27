const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");
console.time("Elapsed time");

const fn = function (input) {
	const links = parseInput(input);
	return visitCave("start", links, []);
};

const visitCave = (cave, links, path) => {
	path = [...path, cave];
	if (cave === "end") {
		console.log("Found path:", path.join(","));
		return 1;
	}
	const candidates = links.filter(link => link.from === cave).map(link => link.to);
	let pathsFound = 0;
	for (const destination of candidates) {
		const isVisited = path.includes(destination);
		if (isVisited && isSmallCave(destination)) continue;
		pathsFound += visitCave(destination, links, path);
	}
	return pathsFound;
};

const isSmallCave = (caveName) => {
	return caveName === caveName.toLowerCase();
};

const parseInput = (input) => {
	const links = [];
	for (const line of input.split("\n").filter(l => l !== "")) {
		const nodes = line.split("-");
		links.push({from: nodes[0], to: nodes[1]});
		links.push({from: nodes[1], to: nodes[0]});
	}
	return links;
};

console.log("Result: ", fn(input));
console.timeEnd("Elapsed time");
