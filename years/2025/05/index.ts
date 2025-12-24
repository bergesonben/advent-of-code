import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { flattenRanges, IntRange } from "../../../util/range";

const YEAR = 2025;
const DAY = 5;

// solution path: /home/benjamin/advent-of-code/years/2025/05/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/05/data.txt
// problem url  : https://adventofcode.com/2025/day/5

type Range = [number, number];

function inRange(id:number, range: Range): boolean {
	return id >= range[0] && id <= range[1]
}

async function p2025day5_part1(input: string, ...params: any[]) {
	const parts = input.split("\n\n");
	const ranges: Range[] = [];
	for (let line of parts[0].split('\n')) {
		const nums = line.split('-').map(Number);
		ranges.push([nums[0], nums[1]]);
	}
	const ids = parts[1].split("\n").map(Number);

	let count = 0;

	// console.log(`ids: ${ids}`);
	// console.log(`ranges: ${ranges}`);

	for (let id of ids) {
		// console.log(`checking id: ${id}`);
		for (let range of ranges) {
			// console.log(`\tchecking range: ${range}`);
			if (inRange(id, range)) {
				// console.log(`\tin range`);
				count++;
				break;
			}
		}
	}

	return count;
}

function overlaps(range1: Range, range2: Range): boolean {
	return (range1[0] >= range2[0] && range1[0] <= range2[1]) || 
		(range1[1] >= range2[0] && range1[1] <= range2[1]) || 
		(range2[0] >= range1[0] && range2[0] <= range1[1]) || 
		(range2[1] >= range1[0] && range2[1] <= range1[1]);
}

function combineRanges(range1: Range, range2: Range): Range {
	const newMin = Math.min(range1[0], range2[0]);
	const newMax= Math.max(range1[1], range2[1]);
	return [newMin, newMax];
}

async function p2025day5_part2(input: string, ...params: any[]) {
	const parts = input.split("\n\n");
	let ranges: IntRange[] = [];
	for (let line of parts[0].split('\n')) {
		const nums = line.split('-').map(Number);
		ranges.push(new IntRange(nums[0], nums[1]));
	}

	const flattenedRanges = flattenRanges(ranges);
	let count = 0;
	for (let range of flattenedRanges) {
		count += range.length + 1;
	}
	

	return count;
}

async function run() {
	const part1tests: TestCase[] = [
// 		{ input: `3-5
// 10-14
// 16-20
// 12-18

// 1
// 5
// 8
// 11
// 17
// 32`, expected: `3`, },
	];
	const part2tests: TestCase[] = [
		{ input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`, expected: `14`, },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2025, part1Solution, part2Solution);

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
