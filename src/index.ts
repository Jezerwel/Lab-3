import Solver from "./classes/solver";
import Board from "./classes/board";
import { readFileSync } from "fs";
import path from "path";

const fileName: string = process.argv[2];

if (!fileName) {
	console.error(
		"Please provide a puzzle file name as a command-line argument.",
	);
	process.exit(1);
}

const puzzlesDir = path.join(__dirname, "..", "puzzles");
const filePath = path.join(puzzlesDir, fileName);

try {
	const fileContent = readFileSync(filePath, "utf8");
	const initial: Board = parseBoard(fileContent);

	const solver: Solver = new Solver(initial);

	if (!solver.getIsSolvable()) {
		console.log("Puzzle is unsolvable");
	} else {
		console.log(`Minimum number of moves = ${solver.moves()}`);
		const solution = solver.getSolution();
		if (solution != null) {
			for (const board of solution) {
				console.log(board.toString());
			}
		}
	}
} catch (err) {
	console.error(`Error reading file: ${(err as Error).message}`);
	process.exit(1);
}

function parseBoard(fileContent: string): Board {
	const lines: string[] = fileContent.split("\n");
	const n: number = parseInt(lines[0]);
	const tiles: number[][] = Array(n).fill(Array(n));

	for (let row = 1; row < lines.length; row++) {
		if (lines[row].trim() === "") {
			continue;
		}

		const nums = lines[row]
			.split(" ")
			.map((s) => parseInt(s))
			.filter((x) => !Number.isNaN(x) && x !== n * n);

		if (nums.length === n) {
			tiles[row - 1] = nums;
		}
	}

	return new Board(tiles);
}
