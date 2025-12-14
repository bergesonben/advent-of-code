import _, { max } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 3;

// solution path: /home/benjamin/advent-of-code/years/2025/03/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/03/data.txt
// problem url  : https://adventofcode.com/2025/day/3

async function p2025day3_part1(input: string, ...params: any[]) {
	return "Not implemented";
	let total = 0;
	for (const line of input.split("\n")) {
		let maxFirst = -1;
		let maxSecond = -1;
		for (let i = 0; i < line.length - 1; i++) {
			const digit = parseInt(line[i], 10);
			if (digit > maxFirst) {
				maxFirst = digit;
				maxSecond = parseInt(line[i + 1], 10);
			} else if (digit > maxSecond) {
				maxSecond = digit;
			}
		}
		const lastDigit = parseInt(line[line.length-1], 10);
		if (lastDigit > maxSecond) {
			maxSecond = lastDigit;
		}
		// console.log(`Line: ${line} => Max Jolt: ${maxFirst}${maxSecond}`);
		const maxJolt = maxFirst * 10 + maxSecond;
		total += maxJolt;
	}
	return total;
}

async function p2025day3_part2(input: string, ...params: any[]) {
	let total = 0;
	for (const line of input.split("\n")) {
		const maxArray: number[] = new Array(12).fill(-1);	
		for (let i = 0; i < line.length; i++) {			
			const digit = parseInt(line[i], 10);
			let reset = false;
			const foo = line.length - i;
			const bar = 12 - foo;
			const baz = Math.max(0, bar);
			for (let j = baz; j < 12; j++) {
				if (reset) {
					maxArray[j] = -1;
				} else if (digit > maxArray[j]) {
					maxArray[j] = digit;
					reset = true;
				}
			}			
			// console.log(`After processing digit ${digit} => ${maxArray}`);
		}
		let maxJoltStr = '';
		for (let i = 0; i < 12; i++) {
			maxJoltStr += String(maxArray[i]);
		}
		const maxJolt = parseInt(maxJoltStr, 10);
		// console.log(`Line: ${line} => Max Jolt: ${maxJoltStr}`);
		total += maxJolt;
	}
	return total;
}

async function run() {
	const part1tests: TestCase[] = [
// 		{ input: `987654321111111
// 811111111111119
// 234234234234278
// 818181911112111`, expected: `357` },
	];
	const part2tests: TestCase[] = [
// 				{ input:  `987654321111111
// 811111111111119
// 234234234234278
// 818181911112111`, expected: `3121910778619` },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2025, part1Solution, part2Solution);

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
