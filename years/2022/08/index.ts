import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid } from "../../../util/grid";

const YEAR = 2022;
const DAY = 8;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/08/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/08/data.txt
// problem url  : https://adventofcode.com/2022/day/8

async function p2022day8_part1(input: string, ...params: any[]) {
	const lines = input.split('\n');
	const cols = lines[0].length;
	const rows = lines.length;
	let sum = (cols * 2) + ((rows - 2) * 2);
	for (let row = 1; row < rows-1; row++) {
		for (let col = 1; col < cols-1; col++) {
			if (isVisible(row, col)) sum++;
		}
	}
	
	return sum;

	function isVisible(row: number, col: number): boolean {
		const val = lines[row][col];
		//check up
		let visible = true;
		for (let i = row-1; i >= 0; i--) {
			if (lines[i][col] >= val) {
				visible = false;
				break;
			}
		}
		if (visible) return true;
		
		//check up
		visible = true;
		for (let i = row+1; i < rows; i++) {
			if (lines[i][col] >= val) {
				visible = false;
				break;
			}
		}
		if (visible) return true;
		
		//check left
		visible = true;
		for (let i = col-1; i >= 0; i--) {
			if (lines[row][i] >= val) {
				visible = false;
				break;
			}
		}
		if (visible) return true;
		
		// check right
		visible = true;
		for (let i = col + 1; i < cols; i++) {
			if (lines[row][i] >= val) {
				visible = false;
				break;
			}
		}		
		return visible;
	}
}

async function p2022day8_part2(input: string, ...params: any[]) {
	const lines = input.split('\n');
	const cols = lines[0].length;
	const rows = lines.length;
	let max = -1;
	for (let row = 1; row < rows-1; row++) {
		for (let col = 1; col < cols-1; col++) {
			max = Math.max(getScenicScore(row, col), max);
		}
	}
	
	return max;

	function getScenicScore(row: number, col: number): number {
		const val = lines[row][col];
		let up = countUp(row, col);
		if (up == 0) return 0;
		let down = countDown(row, col);
		if (down == 0) return 0;
		let left = countLeft(row, col);
		if (left == 0) return 0;
		let right = countRight(row, col);
		const product =  up * down * left * right;
		return product;
	}

	function countUp(row: number, col: number): number {
		let curr = '/';
		let count = 0;
		for (let i = row -1; i >= 0; i--) { 
			// if (lines[i][col] >= curr) count++;
			count++;
			if (lines[i][col] >= lines[row][col]) break;
			curr = lines[i][col];
		}
		return count;
	}

	function countDown(row: number, col: number): number {
		let curr = '/';
		let count = 0;
		for (let i = row + 1; i < rows; i++) { 
			// if (lines[i][col] >= curr) count++;
			count++;
			if (lines[i][col] >= lines[row][col]) break;
			curr = lines[i][col];
		}
		return count;
	}

	function countLeft(row: number, col: number): number {
		let curr = '/';
		let count = 0;
		for (let i = col - 1; i >= 0; i--) { 
			// if (lines[row][i] >= curr) count++;
			count++;
			if (lines[row][i] >= lines[row][col]) break;
			curr = lines[row][i];
		}
		return count;
	}

	function countRight(row: number, col: number): number {
		let curr = '/';
		let count = 0;
		for (let i = col + 1; i < cols; i++) { 
			// if (lines[row][i] >= curr) count++;
			count++;
			if (lines[row][i] >= lines[row][col]) break;
			curr = lines[row][i];
		}
		return count;
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `30373\n25512\n65332\n33549\n35390`,
			extraArgs: [],
			expected: `21`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `30373\n25512\n65332\n33549\n35390`,
			extraArgs: [],
			expected: `8`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2022, part1Solution, part2Solution);

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
