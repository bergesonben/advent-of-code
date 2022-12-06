import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import {
	PriorityQueue,
	MinPriorityQueue,
	MaxPriorityQueue,
	ICompare,
	IGetCompareValue,
  } from '@datastructures-js/priority-queue';

const YEAR = 2022;
const DAY = 1;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/01/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/01/data.txt
// problem url  : https://adventofcode.com/2022/day/1

async function p2022day1_part1(input: string, ...params: any[]) {	
	let max = 0;
	const lines = input.split(/\r?\n/);
	let sum = 0;
	for (let line of lines) {
		if (line.trim().length == 0) {
			max = Math.max(sum, max);
			sum = 0;
		} else {
			sum += Number(line.trim());
		}
	}
	return max;	
}

async function p2022day1_part2(input: string, ...params: any[]) {
	const maxes = new MaxPriorityQueue<number>();
	const lines = input.split(/\r?\n/);
	let sum = 0;
	for (let line of lines) {
		if (line.trim().length == 0) {
			maxes.enqueue(sum);
			sum = 0;
		} else {
			sum += Number(line.trim());
		}
	}
	maxes.enqueue(sum);
	
	sum = maxes.dequeue() + maxes.dequeue() + maxes.dequeue();
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: 
			`1000
			2000
			3000
			
			4000
			
			5000
			6000
			
			7000
			8000
			9000
			
			10000`,
			expected: '24000'
		}
	];
	const part2tests: TestCase[] = [
		{
			input: 
			`1000
			2000
			3000
			
			4000
			
			5000
			6000
			
			7000
			8000
			9000
			
			10000`,
			expected: '45000'
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day1_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day1_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day1_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day1_part2(input));
	const part2After = performance.now();

	logSolution(1, 2022, part1Solution, part2Solution);

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