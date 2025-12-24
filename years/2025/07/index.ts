import _, { over } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 7;

// solution path: /home/benjamin/advent-of-code/years/2025/07/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/07/data.txt
// problem url  : https://adventofcode.com/2025/day/7

function getStartingCol(input: string): number {
	return input.indexOf('S');
}

function printDiagram(lines: string[]): void {
	for (let line of lines) {
		console.log(line);
	}
}

function getAllSplitterIndexes(line: string): number[] {
	const results: number[] = [];
	for (let i = 0; i < line.length; i++) {
		if (line.charAt(i) == '^') {
			results.push(i);
		}
	}	
	return results;
}

function getSplitCount(cols: number[], caretIndexes: number[]): number {
	return caretIndexes.filter(val => cols.includes(val)).length;
}

function getNewCols(cols: number[], caretIndexes: number[]): number[] {
	const caretsToHit = caretIndexes.filter(val => cols.includes(val));
	const blankSpaces = cols.filter(val => !caretsToHit.includes(val));
	const result: Set<number> = new Set(blankSpaces);
	
	for (let caretIndex of caretsToHit) {
		result.add(caretIndex-1)
		result.add(caretIndex+1)
	}

	return Array.from(result);
}

function getNewColsAndSplitCount(cols: number[], line: string): [number[], number] {
	const caretIndexes = getAllSplitterIndexes(line);
	const splitCount = getSplitCount(cols, caretIndexes);
	const newCols = getNewCols(cols, caretIndexes);
	return [newCols, splitCount];
}

function getLinePossibilities(cols: number[], carets: number[]): number {
	let possibilities = 1;
	const overlap = carets.filter(val => cols.includes(val));
	possibilities += (overlap.length * 2);
	return possibilities;
}



async function p2025day7_part1(input: string, ...params: any[]) {
	let cols: number[] = [];
	cols.push(getStartingCol(input));
	const lines = input.split('\n');
	lines.shift();
	let totalSplitCount = 0;
	
	for (let line of lines) {
		let lineSplitCount = 0;
		[cols, lineSplitCount] = getNewColsAndSplitCount(cols, line);
		totalSplitCount += lineSplitCount;
	}
	
	return totalSplitCount;
}

function addBeam(beams: Map<number, number>, col: number, weight: number): void {
	if (beams.has(col)) {
		beams.set(col, beams.get(col)! + weight);
	} else {
		beams.set(col, weight);
	}	
}

function getNewBeams(beams: Map<number, number>, splitters: number[]): Map<number, number> {
	let newBeams: Map<number, number> = new Map();
	beams.forEach((weight, col) => {
		if (splitters.includes(col)) {
			addBeam(newBeams, col - 1, weight);
			addBeam(newBeams, col + 1, weight);
		} else {
			addBeam(newBeams, col, weight);
		}
	});
	return newBeams;
}

async function p2025day7_part2(input: string, ...params: any[]) {
	let beams: Map<number, number> = new Map();

	beams.set(getStartingCol(input), 1);
	
	const lines = input.split('\n');
	const wip: string[] = [];
	wip.push(lines.shift()!);

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const splitters = getAllSplitterIndexes(line);
		const newBeams = getNewBeams(beams, splitters);
		beams = newBeams;
	}
	
	return [...beams.values()].reduce((a,b) => a+b);
}

async function run() {
	const part1tests: TestCase[] = [
								{ input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`, expected: `21`, },
	];
	const part2tests: TestCase[] = [
		{ input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`, expected: `40`, },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2025, part1Solution, part2Solution);

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
