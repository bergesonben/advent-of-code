import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 4;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/04/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/04/data.txt
// problem url  : https://adventofcode.com/2022/day/4

async function p2022day4_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let count = 0;
	for (const line of lines) {
		const foo = line.split(',');
		const range1 = foo[0];
		const range2 = foo[1];
		let bar = range1.split('-')
		const start1 = Number(bar[0]);
		const end1 = Number(bar[1]);
		bar = range2.split('-')
		const start2 = Number(bar[0]);
		const end2 = Number(bar[1]);

		if ((start1 <= start2 && start2 <= end1 && start1 <= end2  && end2 <= end1) || (start2 <= start1 && start2 <= end1 && start1 <= end2 && end1 <= end2)) {
			count++;
		}
	}
	return count;
}

async function p2022day4_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let count = 0;
	for (const line of lines) {
		const foo = line.split(',');
		const range1 = foo[0];
		const range2 = foo[1];
		let bar = range1.split('-')
		const start1 = Number(bar[0]);
		const end1 = Number(bar[1]);
		bar = range2.split('-')
		const start2 = Number(bar[0]);
		const end2 = Number(bar[1]);

		if ((start1 <= start2 && start2 <= end1) || (start2 <= start1 && start1 <= end2)) {
			count++;
		}
	}
	return count;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
			extraArgs: [],
			expected: `2`
		},
		{
			input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8\n20-20,20-100`,
			extraArgs: [],
			expected: `3`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8`,
			extraArgs: [],
			expected: `4`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2022, part1Solution, part2Solution);

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
