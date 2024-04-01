import Board from "./board";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

interface SearchNode {
	board: Board;
	moves: number;
	priority: number;
	prev: SearchNode | null;
}

class Solver {
	private initialBoard: Board;
	private isSolvable: boolean;
	private minMoves: number = Infinity;
	private solution: Board[] | null = null;

	constructor(initial: Board) {
		this.initialBoard = initial;
		this.isSolvable = true;
		this.solve();
	}

	getIsSolvable(): boolean {
		return this.isSolvable;
	}

	moves(): number {
		return this.minMoves === Infinity ? -1 : this.minMoves;
	}

	getSolution(): Board[] | null {
		return this.solution;
	}

	private solve() {
		const initial: SearchNode = this.createSearchNode(this.initialBoard, 0);
		const twin: SearchNode = this.createSearchNode(this.initialBoard.twin(), 0);

		const pq = new MinPriorityQueue<SearchNode>(
			(node: SearchNode) => node.priority,
		);

		pq.enqueue(initial);
		pq.enqueue(twin);

		let prevBoard: Board | null = null;

		while (!pq.isEmpty()) {
			const node = pq.dequeue();

			if (node.board.isGoal()) {
				this.updateSolution(node);
				return;
			}

			if (this.shouldSkipNode(prevBoard, node.board)) {
				continue;
			}

			prevBoard = node.board;

			this.addNeighborsToQueue(node, pq);
		}

		this.isSolvable = false;
	}

	private createSearchNode(board: Board, moves: number): SearchNode {
		return {
			board,
			moves,
			priority: moves + board.manhattan(),
			prev: null,
		};
	}

	private updateSolution(node: SearchNode): void {
		this.minMoves = node.moves;
		this.solution = this.buildSolution(node);
	}

	private shouldSkipNode(
		prevBoard: Board | null,
		currentBoard: Board,
	): boolean {
		return prevBoard?.equals(currentBoard) ?? false;
	}

	private addNeighborsToQueue(
		node: SearchNode,
		pq: MinPriorityQueue<SearchNode>,
	): void {
		for (const neighbor of node.board.neighbors()) {
			const newNode: SearchNode = {
				board: neighbor,
				moves: node.moves + 1,
				priority: node.moves + 1 + neighbor.manhattan(),
				prev: node,
			};
			pq.enqueue(newNode);
		}
	}

	private buildSolution(node: SearchNode): Board[] {
		const solution: Board[] = [];
		let curr: SearchNode | null = node;

		while (curr !== null) {
			solution.unshift(curr.board);
			curr = curr.prev;
		}

		return solution;
	}
}

export default Solver;
