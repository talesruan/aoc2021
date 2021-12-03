import input from "./input.js";

let increments = 0;
let previous;
for (const i of input) {
	if (previous != undefined && previous < i) increments++;
	previous = i;
}

console.log("Increments", increments);