class Board {
	private tiles: number[][];
	private n: number;

	constructor(tiles: number[][]) {
		this.n = tiles.length;
		this.tiles = tiles.map((row) => row.slice());
	}

	toString(): string {
		return `${this.n}\n${this.tiles.map((row) => row.join(" ")).join("\n")}`;
	}

	dimension(): number {
		return this.n;
	}

	hamming(): number {
		let count = 0;
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n; j++) {
				const tile = this.tiles[i][j];
				if (tile !== 0 && tile !== i * this.n + j + 1) {
					count++;
				}
			}
		}
		return count;
	}

	manhattan(): number {
		let distance = 0;
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n; j++) {
				const tile = this.tiles[i][j];
				if (tile !== 0) {
					const goalRow = Math.floor((tile - 1) / this.n);
					const goalCol = (tile - 1) % this.n;
					distance += Math.abs(i - goalRow) + Math.abs(j - goalCol);
				}
			}
		}
		return distance;
	}

	isGoal(): boolean {
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n; j++) {
				const tile = this.tiles[i][j];
				if (tile !== (i * this.n + j + 1) % (this.n * this.n)) {
					return false;
				}
			}
		}
		return true;
	}

	equals(other: Board): boolean {
		if (this.n !== other.dimension()) {
			return false;
		}
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n; j++) {
				if (this.tiles[i][j] !== other.tiles[i][j]) {
					return false;
				}
			}
		}
		return true;
	}

	neighbors(): Board[] {
		const neighbors: Board[] = [];
		const [blankRow, blankCol] = this.findBlankPosition();

		const directions = [
			[0, -1], // up
			[0, 1], // down
			[-1, 0], // left
			[1, 0], // right
		];

		for (const [dRow, dCol] of directions) {
			const newRow = blankRow + dRow;
			const newCol = blankCol + dCol;

			if (newRow >= 0 && newRow < this.n && newCol >= 0 && newCol < this.n) {
				const newTiles = this.copyTiles();
				[newTiles[blankRow][blankCol], newTiles[newRow][newCol]] = [
					newTiles[newRow][newCol],
					0,
				];
				neighbors.push(new Board(newTiles));
			}
		}

		return neighbors;
	}

	twin(): Board {
		const newTiles = this.copyTiles();
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n - 1; j++) {
				if (newTiles[i][j] !== 0 && newTiles[i][j + 1] !== 0) {
					[newTiles[i][j], newTiles[i][j + 1]] = [
						newTiles[i][j + 1],
						newTiles[i][j],
					];
					return new Board(newTiles);
				}
			}
		}
		throw new Error("Unable to create twin board");
	}

	private findBlankPosition(): [number, number] {
		for (let i = 0; i < this.n; i++) {
			for (let j = 0; j < this.n; j++) {
				if (this.tiles[i][j] === 0) {
					return [i, j];
				}
			}
		}
		throw new Error("Blank square not found");
	}

	private copyTiles(): number[][] {
		return this.tiles.map((row) => row.slice());
	}
}

export default Board;
