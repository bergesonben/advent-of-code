import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 23;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/23/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/23/data.txt
// problem url  : https://adventofcode.com/2022/day/23

type Coor = [number,number];

type Direction = [number,number];
const N: Direction = [-1,0];
const W: Direction = [0,-1];
const S: Direction = [1,0];
const E: Direction = [0,1];
const NW: Direction = [-1,-1];
const NE: Direction = [-1, 1];
const SW: Direction = [1, -1];
const SE: Direction = [1, 1];
const ALL_8_DIRECTIONS: Direction[] = [N,W,S,E,NW,NE,SW,SE];
const NORTHERN: Direction[] = [N, NW, NE];
const SOUTHERN: Direction[] = [S, SW, SE];
const EASTERN: Direction[] = [E, SE, NE];
const WESTERN: Direction[] = [W,SW,NW];

function rotateDirections(directions: Direction[][]): void {
	directions.push(directions.shift()!);
}

function initElves(input: string): Set<string> {
	const elves: Set<string> = new Set(); // strigified Coors	
	const lines = input.split("\n");
	for (const [row, line] of lines.entries()) {
		for (let col = 0; col < line.length; col++) {
			const cell = line[col];
			if (cell == '#') {
				elves.add([row,col].toString());
			}
		}			
	}
	return elves;
}

function decode(str: string): Coor {
	return str.split(',').map(Number) as Coor;
}

function getNSEWMaxes(elves: Set<string>): [number,number,number,number] {
	let minRow = Number.MAX_SAFE_INTEGER;
	let maxRow = Number.MIN_SAFE_INTEGER;
	let minCol = Number.MAX_SAFE_INTEGER;
	let maxCol = Number.MIN_SAFE_INTEGER;
	
	for (let elfStr of elves) {
		const elf = decode(elfStr);
		minRow = Math.min(minRow, elf[0]);
		maxRow = Math.max(maxRow, elf[0]);
		minCol = Math.min(minCol, elf[1]);
		maxCol = Math.max(maxCol, elf[1]);
	}		
	return [minRow, maxRow, minCol, maxCol];
}

function printMap(elves: Set<string>): void {
	let [rowMin, rowMax, colMin, colMax] = getNSEWMaxes(elves);
	for (let row = rowMin;row < rowMax + 1; row++) {
		let line = '';
		for (let col = colMin; col < colMax + 1; col++) {
			if (elves.has([row,col].toString())) {
				line += '#';
			} else {
				line += '.';
			}
		}
		console.log(line);
	}
}

function needToMove(elf: Coor, elves: Set<string>): boolean {
	for (let dir of ALL_8_DIRECTIONS) {
		const newCoor: Coor = [elf[0] + dir[0], elf[1] + dir[1]];
		if (elves.has(newCoor.toString())) return true;
	}
	return false;
}

function proposeMove(elf: Coor, dirs: Direction[][], elves: Set<string>): string | null {
	for (let generalDir of dirs) {
		let valid = true;
		for (let specificDir of generalDir) {
			const newCoor = [elf[0] + specificDir[0], elf[1] + specificDir[1]];
			if (elves.has(newCoor.toString())) {
				valid = false;
				break;
			}
		}
		if (valid) {
			const newCoor = [elf[0] + generalDir[0][0], elf[1] + generalDir[0][1]];
			return newCoor.toString();
		}
	}
	return null;
}	

function round(elves: Set<string>, dirs: Direction[][]): boolean {
	const validMoves: Map<string, string> = new Map();
	const invalidMoves: Set<string> = new Set();
	for (let elfStr of elves.keys()) {
		const elf = decode(elfStr);
		if (needToMove(elf, elves)) {
			const proposed = proposeMove(elf, dirs, elves);
			if (proposed == null) continue;
			if (validMoves.has(proposed)) {
				invalidMoves.add(proposed);
				validMoves.delete(proposed);
			} else if (!invalidMoves.has(proposed)) {
				validMoves.set(proposed, elfStr);
			}
		}
	}

	if (validMoves.size == 0) {return false;}

	for (let [destination, origin] of validMoves.entries()) {
		elves.delete(origin);
		elves.add(destination);
	}

	rotateDirections(dirs);
	return true;
}	

async function p2022day23_part1(input: string, ...params: any[]) {
	let dirs: Direction[][] = [NORTHERN, SOUTHERN, WESTERN, EASTERN];
	const elves: Set<string> = initElves(input);
	const ROUNDS = 10;
	for (let i = 0; i < ROUNDS; i++) {
		round(elves, dirs);
	}
	
	const area = getSmallestRectArea();
	const elvesCount = elves.size;
	const answer = area - elvesCount;
	return answer;	

	function getSmallestRectArea(): number {
		let [rowMin, rowMax, colMin, colMax] = getNSEWMaxes(elves);
		const width = rowMax - rowMin + 1;
		const height = colMax - colMin + 1;
		return width * height;
	}
}

async function p2022day23_part2(input: string, ...params: any[]) {
	let dirs: Direction[][] = [NORTHERN, SOUTHERN, WESTERN, EASTERN];
	const elves: Set<string> = initElves(input);
	let rounds = 1;
	while (round(elves, dirs)) {
		rounds++;
	}
	return rounds;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `....#..\n..###.#\n#...#.#\n.#...##\n#.###..\n##.#.##\n.#..#..`,
			extraArgs: [],
			expected: `110`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `....#..\n..###.#\n#...#.#\n.#...##\n#.###..\n##.#.##\n.#..#..`,
			extraArgs: [],
			expected: `20`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day23_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day23_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	// const input = await util.getInput(DAY, YEAR);

	// const part1Before = performance.now();
	// const part1Solution = String(await p2022day23_part1(input));
	// const part1After = performance.now();

	// const part2Before = performance.now()
	// const part2Solution = String(await p2022day23_part2(input));
	// const part2After = performance.now();

	// logSolution(23, 2022, part1Solution, part2Solution);

	// log(chalk.gray("--- Performance ---"));
	// log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	// log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	// log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
