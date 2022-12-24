import _, { initial } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { bfSearch } from "../../../util/graph";

const YEAR = 2022;
const DAY = 24;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/24/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/24/data.txt
// problem url  : https://adventofcode.com/2022/day/24

type Coor = [number,number];

async function p2022day24_part1(input: string, ...params: any[]) {
	type Blizzard = '>' | '<' | '^' | 'v';
	class CellSnapshot {
		constructor(public row: number, public col: number, public minute: number){}
	
		public isWall = false;
		public blizzards: Blizzard[] =[];
		public neighbors: CellSnapshot[] = [];
	}
	
	type MapSnapshot = (CellSnapshot|undefined)[][];

	let mapWidth = 0;
	let mapHeight = 0;
	let startMap: MapSnapshot = [];	
	initMap();
	const maps: MapSnapshot[] = [startMap];
	let start = startMap[0][1];

	const options = {
		isEnd: (cell: CellSnapshot) => {
			return cell.row == mapHeight-1 && cell.col == mapWidth-2;
		},
		start: start!,
		neighbors: (cell: CellSnapshot) => {
			return getNeighbors(cell);
		}
	}

	const result = bfSearch(options);

	return result!.shortestPath.length-1;

	function getNeighbors(cell: CellSnapshot): CellSnapshot[] {
		const currMap = maps[cell.minute];		
		let newMap = maps[cell.minute+1];
		if (newMap == undefined) {
			newMap = nextMap(currMap);
			maps.push(newMap);
		}
		const dirs = directions(cell.row, cell.col);
		dirs.push([cell.row, cell.col]);
		const neighbors: CellSnapshot[] = [];
		for (let dir of dirs) {
			const [newRow, newCol] = dir;
			const newNeighbor = newMap[newRow][newCol]!;
			if (newNeighbor.blizzards.length == 0 && !newNeighbor.isWall) neighbors.push(newNeighbor);
		}	
		return neighbors;
	}

	function nextMap(map: MapSnapshot): MapSnapshot {
		const newMap = Array(mapHeight).fill(false).map(x => Array(mapWidth));
		for (let row = 0; row < map.length; row++) {
			for (let col = 0; col < map[0].length; col++) {
				const curr: CellSnapshot = map[row][col]!;
				if (newMap[row][col] == undefined) newMap[row][col] = new CellSnapshot(row, col, curr.minute+1);
				
				if (curr.isWall) {
					newMap[row][col].isWall = true;
				}
				for (let blizzard of curr.blizzards) {
					const [nextRow, nextCol] = getBlizzardNextSpot(blizzard, [row,col]);
					if (newMap[nextRow][nextCol] == undefined) newMap[nextRow][nextCol] = new CellSnapshot(nextRow, nextCol, curr.minute+1);
					const nextCell: CellSnapshot = newMap[nextRow][nextCol]!;
					nextCell.blizzards.push(blizzard);
				}
			}
		}
		return newMap;
	}

	function getBlizzardNextSpot(blizzard: Blizzard, [row, col]: Coor): Coor {
		switch (blizzard) {
			case '<':
				return col == 1 ? [row, mapWidth-2] : [row, col-1];
			case '>':
				return col == (mapWidth-2) ? [row, 1] : [row, col+1];
			case '^':
				return row == 1 ? [mapHeight-2, col] : [row - 1, col];
			case 'v':
				return row == mapHeight-2 ? [1, col] : [row + 1, col];
		}
	}

	function initMap(): void {
		const lines = input.split("\n");
		mapWidth = lines[0].length;
		mapHeight = lines.length;
		
		for (const [row, line] of lines.entries()) {
			startMap.push([]);
			for(let col = 0; col < line.length; col++) {
				const curr = new CellSnapshot(row, col, 0);
				startMap[row][col] = curr;
				if (line[col] == '#') curr.isWall = true;
				else if(line[col] != '.') curr.blizzards.push(line[col] as Blizzard);
			}			
		}
	}

	function directions(row: number, col: number): [number,number][] {
		const retval: [number,number][] = []
		if (row -1 >= 0) retval.push([row-1, col]);
		if (row + 1 < mapHeight) retval.push([row+1, col])
		if (col -1 >= 0) retval.push([row, col-1])
		if (col +1 < mapWidth) retval.push([row, col+1]);
		return retval;
	}

	function printMap(map: MapSnapshot): void {
		for (let [rowIndex, row] of map.entries()) {
			let rowStr = '';
			for (let [colIndex, col] of row.entries()) {
				if (map[rowIndex][colIndex] == undefined) throw Error('tried to print undefined cell');
				const curr: CellSnapshot = map[rowIndex][colIndex]!;
				if (curr.isWall) {
					rowStr += '#';
				} else if (curr.blizzards.length == 0) {
					rowStr += '.';
				} else if (curr.blizzards.length == 1) {
					rowStr += curr.blizzards[0];
				} else {
					rowStr += curr.blizzards.length.toString();
				}
			}
			console.log(rowStr);
		}
	}
}

async function p2022day24_part2(input: string, ...params: any[]) {
	type Blizzard = '>' | '<' | '^' | 'v';
	class CellSnapshot {
		constructor(public row: number, public col: number, public minute: number){}
	
		public isWall = false;
		public blizzards: Blizzard[] =[];
		public neighbors: CellSnapshot[] = [];
	}
	
	type MapSnapshot = (CellSnapshot|undefined)[][];

	let mapWidth = 0;
	let mapHeight = 0;
	let startMap: MapSnapshot = [];	
	initMap();
	const maps: MapSnapshot[] = [startMap];
	let start = startMap[0][1];

	let options = {
		isEnd: (cell: CellSnapshot) => {
			return cell.row == mapHeight-1 && cell.col == mapWidth-2;
		},
		start: start!,
		neighbors: (cell: CellSnapshot) => {
			return getNeighbors(cell);
		}
	}

	const firstLegResult = bfSearch(options);
	if (firstLegResult == undefined) throw Error('undefined first leg');
	options.isEnd = (cell: CellSnapshot) => {
		return cell.row == 0 && cell.col == 1;
	}
	options.start = firstLegResult.node;
	const secondLegResult = bfSearch(options);
	if (secondLegResult == undefined) throw Error('undefined second leg');

	options.isEnd = (cell: CellSnapshot) => {
		return cell.row == mapHeight-1 && cell.col == mapWidth-2;
	}
	options.start = secondLegResult.node;
	const thirdLegResult = bfSearch(options);
	if (thirdLegResult == undefined) throw Error('undefined third leg');
	

	return thirdLegResult.node.minute;

	function getNeighbors(cell: CellSnapshot): CellSnapshot[] {
		const currMap = maps[cell.minute];		
		let newMap = maps[cell.minute+1];
		if (newMap == undefined) {
			newMap = nextMap(currMap);
			maps.push(newMap);
		}
		const dirs = directions(cell.row, cell.col);
		dirs.push([cell.row, cell.col]);
		const neighbors: CellSnapshot[] = [];
		for (let dir of dirs) {
			const [newRow, newCol] = dir;
			const newNeighbor = newMap[newRow][newCol]!;
			if (newNeighbor.blizzards.length == 0 && !newNeighbor.isWall) neighbors.push(newNeighbor);
		}	
		return neighbors;
	}

	function nextMap(map: MapSnapshot): MapSnapshot {
		const newMap = Array(mapHeight).fill(false).map(x => Array(mapWidth));
		for (let row = 0; row < map.length; row++) {
			for (let col = 0; col < map[0].length; col++) {
				const curr: CellSnapshot = map[row][col]!;
				if (newMap[row][col] == undefined) newMap[row][col] = new CellSnapshot(row, col, curr.minute+1);
				
				if (curr.isWall) {
					newMap[row][col].isWall = true;
				}
				for (let blizzard of curr.blizzards) {
					const [nextRow, nextCol] = getBlizzardNextSpot(blizzard, [row,col]);
					if (newMap[nextRow][nextCol] == undefined) newMap[nextRow][nextCol] = new CellSnapshot(nextRow, nextCol, curr.minute+1);
					const nextCell: CellSnapshot = newMap[nextRow][nextCol]!;
					nextCell.blizzards.push(blizzard);
				}
			}
		}
		return newMap;
	}

	function getBlizzardNextSpot(blizzard: Blizzard, [row, col]: Coor): Coor {
		switch (blizzard) {
			case '<':
				return col == 1 ? [row, mapWidth-2] : [row, col-1];
			case '>':
				return col == (mapWidth-2) ? [row, 1] : [row, col+1];
			case '^':
				return row == 1 ? [mapHeight-2, col] : [row - 1, col];
			case 'v':
				return row == mapHeight-2 ? [1, col] : [row + 1, col];
		}
	}

	function initMap(): void {
		const lines = input.split("\n");
		mapWidth = lines[0].length;
		mapHeight = lines.length;
		
		for (const [row, line] of lines.entries()) {
			startMap.push([]);
			for(let col = 0; col < line.length; col++) {
				const curr = new CellSnapshot(row, col, 0);
				startMap[row][col] = curr;
				if (line[col] == '#') curr.isWall = true;
				else if(line[col] != '.') curr.blizzards.push(line[col] as Blizzard);
			}			
		}
	}

	function directions(row: number, col: number): [number,number][] {
		const retval: [number,number][] = []
		if (row -1 >= 0) retval.push([row-1, col]);
		if (row + 1 < mapHeight) retval.push([row+1, col])
		if (col -1 >= 0) retval.push([row, col-1])
		if (col +1 < mapWidth) retval.push([row, col+1]);
		return retval;
	}

	function printMap(map: MapSnapshot): void {
		for (let [rowIndex, row] of map.entries()) {
			let rowStr = '';
			for (let [colIndex, col] of row.entries()) {
				if (map[rowIndex][colIndex] == undefined) throw Error('tried to print undefined cell');
				const curr: CellSnapshot = map[rowIndex][colIndex]!;
				if (curr.isWall) {
					rowStr += '#';
				} else if (curr.blizzards.length == 0) {
					rowStr += '.';
				} else if (curr.blizzards.length == 1) {
					rowStr += curr.blizzards[0];
				} else {
					rowStr += curr.blizzards.length.toString();
				}
			}
			console.log(rowStr);
		}
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `#.######\n#>>.<^<#\n#.<..<<#\n#>v.><>#\n#<^v^^>#\n######.#`,
			extraArgs: [],
			expected: `18`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `#.######\n#>>.<^<#\n#.<..<<#\n#>v.><>#\n#<^v^^>#\n######.#`,
			extraArgs: [],
			expected: `54`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day24_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day24_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day24_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day24_part2(input));
	const part2After = performance.now();

	logSolution(24, 2022, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
