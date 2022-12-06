import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 3;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/03/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/03/data.txt
// problem url  : https://adventofcode.com/2022/day/3

async function p2022day3_part1(input: string, ...params: any[]) {
	const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lines = input.split("\n");
	let sum = 0;
	for (const line of lines) {
		const first: Set<string> = new Set();
		const second: Set<string> = new Set();
		for (let i = 0; i < line.length/2; i++) {
			first.add(line.charAt(i));
			second.add(line.charAt(line.length-1-i));
		}
		const foo: Set<string> = new Set();
		for (let x of first) {
			if (second.has(x)) foo.add(x);
		}
		for (let x of foo) {
			sum += str.indexOf(x) + 1
		}		
	}

	return sum;
}

async function p2022day3_part2(input: string, ...params: any[]) {
	const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lines = input.split("\n");
	let count = 0;
	const first: Set<string> = new Set();
	const second: Set<string> = new Set();
	const third: Set<string> = new Set();
	let sum = 0;

	for (const line of lines) {
		if (count == 0) {
			for (let x of line) {
				first.add(x);
			}
			count++;
		} else if (count == 1) {
			for (let x of line) {
				second.add(x);
			}
			count++;
		} else {
			for (let x of line) {
				third.add(x);
			}		

			for (let x of first) {
				if (second.has(x) && third.has(x)) {
					sum += str.indexOf(x) + 1;
					break;
				}
			}
			first.clear();
			second.clear();
			third.clear();
			count = 0;	
		} 
	}
	
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
		extraArgs: [],
		expected: `157`
	}];
	const part2tests: TestCase[] = [
		{
			input: `vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw`,
			extraArgs: [],
			expected: `70`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2022, part1Solution, part2Solution);

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
