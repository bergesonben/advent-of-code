import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 4;

// solution path: /home/benjamin/advent-of-code/years/2025/04/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/04/data.txt
// problem url  : https://adventofcode.com/2025/day/4

type Direction = [number, number];

const DIRS: Record<string, Direction> = {
	N: [-1, 0],
	NE: [-1, 1],
	E: [0, 1],
	SE: [1, 1],
	S: [1, 0],
	SW: [1, -1],
	W: [0, -1],
	NW: [-1, -1],
};

async function p2025day4_part1(input: string, ...params: any[]) {
	const grid = input.split("\n");

	function isDirectionOutOfBounds(row: number, col: number, dir: Direction): boolean {
		const newRow = row + dir[0];
		const newCol = col + dir[1];
		if (newRow < 0 || newRow >= grid.length) {
			return true;
		}
		if (newCol < 0 || newCol >= grid[0].length) {
			return true;
		}
		return false;
	}

	function isPaper(row: number, col: number, dir: Direction): boolean {
		if (isDirectionOutOfBounds(row, col, dir)) {
			return false;
		}
		const newRow = row + dir[0];
		const newCol = col + dir[1];
		if (grid[newRow][newCol] === "@") {
			return true;
		}
		return false;
	}

	function adjPaperCount(row: number, col: number): number {
		let count = 0;
		for (const dir of Object.values(DIRS)) {
			if (isPaper(row, col, dir)) {
				count++;
			}
		}
		return count;
	}

	function canBeReached(row: number, col: number): boolean {
		if (isPaper(row, col, [0,0]) && adjPaperCount(row, col) < 4) {
			return true;
		}
		return false;
	}

	let count = 0;

	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[row].length; col++) {
			if (canBeReached(row, col)) {
				// console.log(`Can be reached at ${row},${col}`);
				count++;
			}
		}
	}
	return count;
}

async function p2025day4_part2(input: string, ...params: any[]) {
	const grid = input.split("\n");

	function isDirectionOutOfBounds(row: number, col: number, dir: Direction): boolean {
		const newRow = row + dir[0];
		const newCol = col + dir[1];
		if (newRow < 0 || newRow >= grid.length) {
			return true;
		}
		if (newCol < 0 || newCol >= grid[0].length) {
			return true;
		}
		return false;
	}

	function isPaper(row: number, col: number, dir: Direction): boolean {
		if (isDirectionOutOfBounds(row, col, dir)) {
			return false;
		}
		const newRow = row + dir[0];
		const newCol = col + dir[1];
		if (grid[newRow][newCol] === "@") {
			return true;
		}
		return false;
	}

	function adjPaperCount(row: number, col: number): number {
		let count = 0;
		for (const dir of Object.values(DIRS)) {
			if (isPaper(row, col, dir)) {
				count++;
			}
		}
		return count;
	}

	function canBeReached(row: number, col: number): boolean {
		if (isPaper(row, col, [0,0]) && adjPaperCount(row, col) < 4) {
			return true;
		}
		return false;
	}

	let count = 0;
	let shouldRepeat = true;
	while (shouldRepeat) {
		shouldRepeat = false;
		for (let row = 0; row < grid.length; row++) {
			for (let col = 0; col < grid[row].length; col++) {
				if (canBeReached(row, col)) {
					// console.log(`Can be reached at ${row},${col}`);
					shouldRepeat = true;
					grid[row] = grid[row].substring(0, col) + "." + grid[row].substring(col + 1);
					count++;
				}
			}
		}
	}

	
	return count;
}

async function run() {
	const part1tests: TestCase[] = [
// 		{ input: `..@@.@@@@.
// @@@.@.@.@@
// @@@@@.@.@@
// @.@@@@..@.
// @@.@@@@.@@
// .@@@@@@@.@
// .@.@.@.@@@
// @.@@@.@@@@
// .@@@@@@@@.
// @.@.@@@.@.`, expected: `13` },
	];
	const part2tests: TestCase[] = [
		{ input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`, expected: `43` },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2025, part1Solution, part2Solution);

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
