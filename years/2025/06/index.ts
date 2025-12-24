import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 6;

// solution path: /home/benjamin/advent-of-code/years/2025/06/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/06/data.txt
// problem url  : https://adventofcode.com/2025/day/6

async function p2025day6_part1(input: string, ...params: any[]) {
	const linesStr = input.split("\n");
	const lines = linesStr.map((line: string) => {
		return line.trim().split(/\s+/);		
	});

	let totalSum = 0;
	for (let i = 0; i < lines[0].length; i++) {		
		let colSum = 0;
		if (lines.at(-1)![i] == '*') {
			colSum = 1;
			for (let j = 0; j < lines.length - 1; j++) {
				colSum *= Number(lines[j][i]);
			}
		} else {
			colSum = 0;
			for (let j = 0; j < lines.length - 1; j++) {
				colSum += Number(lines[j][i]);
			}
		}		
		totalSum += colSum;
	}

	return totalSum;
}

async function p2025day6_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");

	function getNumber(col: number): number {
		let numStr = '';
		for (let row = 0; row < lines.length - 1; row++) {
			numStr += lines[row][col].trim();
		}
		if (numStr == '') {
			return -1;
		}
		return Number(numStr);
	}

	let totalSum = 0;
	let numbers: number[] = []
	for (let col = lines[0].length - 1; col >= 0; col--) {
		const opSymbol = lines.at(-1)![col];		
		const colNum = getNumber(col);
		if (colNum != -1) {
			numbers.push(colNum);
		}

		if (opSymbol == '+') {
			const sectionResult = numbers.reduce((a, b) => {return a + b;});
			totalSum += sectionResult;
			// console.log(`+ found, adding ${numbers} = ${sectionResult}`);
			numbers = [];
		} else if (opSymbol == '*') {
			const sectionResult = numbers.reduce((a, b) => {return a * b;});
			totalSum += sectionResult;
			// console.log(`* found, multiplying ${numbers} = ${sectionResult}`);
			numbers = [];
		} 
	}

	return totalSum;
}

async function run() {
	const part1tests: TestCase[] = [
// 				{ input: `123 328  51 64 
//  45 64  387 23 
//   6 98  215 314
// *   +   *   + `, expected: `4277556`, },
	];
	const part2tests: TestCase[] = [
						{ input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `, expected: `3263827`, },

	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2025, part1Solution, part2Solution);

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
