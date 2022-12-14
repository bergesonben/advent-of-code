import _, { delay } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 14;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/14/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/14/data.txt
// problem url  : https://adventofcode.com/2022/day/14

enum Cell {
	rock, 
	air, 
	sand
}
let HOLE: [number,number] = [50,0];

function printGrid(grid: Cell[][], floor?: number, pos?: [number,number]): void {	
	for (let row = 0; row < (floor ?? grid[0].length); row++) {
		let rowStr = '';
		for (let col = 0; col < grid.length; col++) {
			if (pos != undefined && pos[0] == col && pos[1] == row) rowStr += '\x1b[33m0\x1b[0m'
			else if (row == HOLE[1] && col == HOLE[0]) rowStr += '+'
			else if (grid[col][row] == Cell.rock) rowStr += '#'
			else if (grid[col][row] == Cell.air) rowStr += '.'			
			else rowStr += 'O'
			
		}
		console.log(rowStr);
	}
}

function createGrid1(input: string): Cell[][] {
	const grid: Cell[][] = Array(200).fill(0).map(x => Array(200).fill(Cell.air));
	const lines = input.split("\n");
	for (const line of lines) {
		const coors = getRockCoors(line);
		for (let i = 0; i < coors.length-1; i++) {
			const coor1 = coors[i];
			const coor2 = coors[i+1];
			const startCol = coor1[0] - 450;
			const startRow = coor1[1];
			const endCol = coor2[0] - 450;
			const endRow = coor2[1];
			for (let j = Math.min(startRow, endRow); j <= Math.max(startRow, endRow); j++) {
				grid[startCol][j] = Cell.rock;
			}
			for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
				grid[j][startRow] = Cell.rock;
			}
		}
	}
	return grid;
}

function createGrid(input: string): [Cell[][], number] {
	let maxRow = 0;
	const grid: Cell[][] = Array(200).fill(0).map(x => Array(200).fill(Cell.air));
	const lines = input.split("\n");
	for (const line of lines) {
		const coors = getRockCoors(line);
		for (let i = 0; i < coors.length-1; i++) {
			const coor1 = coors[i];
			const coor2 = coors[i+1];
			const startCol = coor1[0] - 450;
			const startRow = coor1[1];
			const endCol = coor2[0] - 450;
			const endRow = coor2[1];
			maxRow = Math.max(startRow, endRow, maxRow);
			for (let j = Math.min(startRow, endRow); j <= Math.max(startRow, endRow); j++) {
				grid[startCol][j] = Cell.rock;
			}
			for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
				grid[j][startRow] = Cell.rock;
			}
		}
	}
	const floor = maxRow + 2;
	for (let i = 0; i < 200; i++) {
		grid[i][floor] = Cell.rock;
	}
	return [grid, floor];
}

function getRockCoors(line: string): [number,number][] {
	const coors: [number, number][] = line.split('->').map(x => {
		const foo = x.trim().split(',')
		return [Number(foo[0]), Number(foo[1])];
	});
	return coors;
}

function dropSand1(grid: Cell[][]): boolean {
	let count = 0;
	let pos = HOLE;
	while (count <= 1000) {
		if (pos[1] >= 199) {
			return false;
		}
		if (grid[pos[0]]?.[pos[1] + 1] == Cell.air) {
			pos = [pos[0], pos[1] + 1];
		} else if (grid[pos[0]-1]?.[pos[1]+1] == Cell.air) {
			pos = [pos[0]-1, pos[1]+1];
		} else if (grid[pos[0]+1]?.[pos[1]+1] == Cell.air) {
			pos = [pos[0]+1,pos[1]+1];
		} else {
			grid[pos[0]][pos[1]] = Cell.sand;
			return true;
		}		
		count++;
	}
	throw Error('crap')
}

async function p2022day14_part1(input: string, ...params: any[]) {
	const grid = createGrid1(input);
	let count = 0;	
	while (dropSand1(grid)) count++
	return count;
}

async function dropSand(grid: Cell[][], floor: number): Promise<boolean> {
	let count = 0;
	let pos = HOLE;
	while (count <= 1000) {
		await sleep(5);
		console.log('\x1B[10;0H')
		printGrid(grid, floor, pos);
		if (pos[0] == 0) {
			grid.unshift(Array(200).fill(Cell.air));
			grid[0][floor] = Cell.rock
			HOLE = [HOLE[0] + 1, HOLE[1]];
		} else if (pos[0] == grid.length -1) {
			grid.push(Array(200).fill(Cell.air))
			grid[grid.length-1][floor] = Cell.rock
		}
		if (grid[pos[0]]?.[pos[1] + 1] == Cell.air) {
			pos = [pos[0], pos[1] + 1];
		} else if (grid[pos[0]-1]?.[pos[1]+1] == Cell.air) {
			pos = [pos[0]-1, pos[1]+1];
		} else if (grid[pos[0]+1]?.[pos[1]+1] == Cell.air) {
			pos = [pos[0]+1,pos[1]+1];
		} else if(pos[0] == HOLE[0] && pos[1] == HOLE[1]) {
			return false;
		} else {			
			grid[pos[0]][pos[1]] = Cell.sand;
			return true;
		}
		count++;
	}
	return false;
	throw Error('crap')
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function p2022day14_part2(input: string, ...params: any[]) {
	const [grid, floor] = createGrid(input);	
	let count = 0;		
	printGrid(grid, floor);
	while (await dropSand(grid, floor) && count <= 50000) {		
		// await sleep(500);
		console.log('\x1B[10;0H')
		printGrid(grid, floor);
		count++
	}
	console.log(`\x1B[${floor+19};0H`)
	return count+1;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9`,
			extraArgs: [],
			expected: `24`
		}
	];
	const part2tests: TestCase[] = [
		// {
		// 	input: `498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9`,
		// 	extraArgs: [],
		// 	expected: `93`
		// }
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day14_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day14_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day14_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day14_part2(input));
	const part2After = performance.now();

	logSolution(14, 2022, part1Solution, part2Solution);

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
