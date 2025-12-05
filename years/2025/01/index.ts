import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 1;

// solution path: /home/benjamin/advent-of-code/years/2025/01/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/01/data.txt
// problem url  : https://adventofcode.com/2025/day/1

async function p2025day1_part1(input: string, ...params: any[]) {
	let position: number = 50;
	let count = 0;

	for(let line of input.split("\n")) {
		line = line.trim();
		const isRight = line[0] === "R";
		if (isRight) {
			position += parseInt(line.slice(1), 10);
		} else {
			position -= parseInt(line.slice(1), 10);
		}
		if (position % 100 == 0) count++;
	}

	return count;
}

async function p2025day1_part2(input: string, ...params: any[]) {
	let position: number = 50;
	let count = 0;

	for(let line of input.split("\n")) {
		line = line.trim();
		const isRight = line[0] === "R";
		const movement = parseInt(line.slice(1), 10);
		for (let i = 1; i <= movement; i++) {
			if (isRight) {
				if ((i + position) % 100 == 0) count++;
			} else {
				if ((position - i)% 100 == 0) count++;
			}
			
		}
		position = isRight ? position + movement : position - movement;
	}

	return count;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	part1tests.push(
		{
			input: 
			`L68
			L30
			R48
			L5
			R60
			L55
			L1
			L99
			R14
			L82`,
			expected: `3`
		}
	);

	part2tests.push(
		{
			input: 
			`L68
			L30
			R48
			L5
			R60
			L55
			L1
			L99
			R14
			L82`,
			expected: `6`
		}, 
		{
			input: 
			`R1000`,
			expected: `10`
		}
	);

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2025, part1Solution, part2Solution);

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
