import Board from "./board";
import { MinHeap } from "min-heap-typed";

class SearchNode {
	board: Board;
	moves: number;
	previousSearchNode: SearchNode | null;
	priority: number;

	constructor(
		board: Board,
		moves: number,
		previousSearchNode: SearchNode | null,
		priority: number,
	) {
		this.board = board;
		this.moves = moves;
		this.previousSearchNode = previousSearchNode;
		this.priority = priority;
	}
}

class Solver {
	private initialBoard: Board;
	private isSolvable: boolean;
	private minMoves: number;
	private solution: Board[] | null;

	constructor(initial: Board) {
		this.initialBoard = initial;
		this.isSolvable = this.solvePuzzle();
		this.minMoves = this.isSolvable ? this.getMinMoves() : -1;
		this.solution = this.isSolvable ? this.getSolutionPath() : null;
	}

	getIsSolvable(): boolean {
		return this.isSolvable;
	}

	moves(): number {
		return this.minMoves;
	}

	getSolution(): Board[] | null {
		return this.solution;
	}

	private solvePuzzle(): boolean {
		const initialSearchNode = new SearchNode(
			this.initialBoard,
			0,
			null,
			this.initialBoard.manhattan(),
		);
		const twinSearchNode = new SearchNode(
			this.initialBoard.twin(),
			0,
			null,
			this.initialBoard.twin().manhattan(),
		);

		const priorityQueue = new MinHeap<SearchNode>([], {
			comparator: (a, b) => a.priority - b.priority,
		});
		priorityQueue.add(initialSearchNode);
		priorityQueue.add(twinSearchNode);

		const visitedBoards = new Set<string>();

		while (!priorityQueue.isEmpty()) {
			const currentNode = priorityQueue.poll()!;

			if (currentNode.board.isGoal()) {
				return true;
			}

			const boardString = currentNode.board.toString();
			if (visitedBoards.has(boardString)) {
				continue;
			}
			visitedBoards.add(boardString);

			const neighbors = currentNode.board.neighbors();
			for (const neighbor of neighbors) {
				if (!visitedBoards.has(neighbor.toString())) {
					const newNode = new SearchNode(
						neighbor,
						currentNode.moves + 1,
						currentNode,
						neighbor.manhattan() + currentNode.moves + 1,
					);
					priorityQueue.add(newNode);
				}
			}
		}

		return false;
	}

	private getMinMoves(): number {
		const current: SearchNode | null = this.findGoalNode();
		let moves = 0;

		if (current !== null) {
			moves = current.moves;
		}

		return moves;
	}

	private getSolutionPath(): Board[] {
		const solution: Board[] = [];
		let current: SearchNode | null = this.findGoalNode();

		if (current !== null) {
			while (current !== null) {
				solution.unshift(current.board);
				current = current.previousSearchNode;
			}
		}

		return solution;
	}

	private findGoalNode(): SearchNode | null {
		const priorityQueue = new MinHeap<SearchNode>([], {
			comparator: (a, b) => a.priority - b.priority,
		});
		priorityQueue.add(
			new SearchNode(this.initialBoard, 0, null, this.initialBoard.manhattan()),
		);

		const visitedBoards = new Set<string>();

		while (!priorityQueue.isEmpty()) {
			const currentNode = priorityQueue.poll()!;

			if (currentNode.board.isGoal()) {
				return currentNode;
			}

			const boardString = currentNode.board.toString();
			if (visitedBoards.has(boardString)) {
				continue;
			}
			visitedBoards.add(boardString);

			const neighbors = currentNode.board.neighbors();
			for (const neighbor of neighbors) {
				if (!visitedBoards.has(neighbor.toString())) {
					const newNode = new SearchNode(
						neighbor,
						currentNode.moves + 1,
						currentNode,
						neighbor.manhattan() + currentNode.moves + 1,
					);
					priorityQueue.add(newNode);
				}
			}
		}

		return null;
	}
}

export default Solver;
