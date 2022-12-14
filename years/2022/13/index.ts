import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 13;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/13/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/13/data.txt
// problem url  : https://adventofcode.com/2022/day/13

type Sig<T> = Array<Sig<number> | number> | number

enum Result {
	right, 
	wrong,
	continue
}

async function p2022day13_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const indexes: number[] = [];
	for (let i = 0; i < lines.length; i+=3) {
		const left = parse(lines[i]);
		const right = parse(lines[i+1]);
		const result = isOrderRight(left, right);
		if (result == Result.right) {
			indexes.push(Math.floor(i/3) + 1);
		} else if (result == Result.continue) {
			console.log("ohno");
		}
	}
	const sum = indexes.reduce((prev, curr) => prev + curr);
	return sum;

	function parse(line: string): Sig<number> {
		const sig: Sig<number> = JSON.parse(line);
		return sig;
	}

	function isOrderRight(left: Sig<number>, right: Sig<number>): Result {
		if (typeof left === 'number' && typeof right === 'number') {
			if (Number(left) < Number(right)) return Result.right;
			else if (Number(left) == Number(right)) return Result.continue;
			else return Result.wrong;
		}
		if (typeof left === 'number') left = [left];
		if (typeof right === 'number') right = [right];
		for (let i = 0; i < left.length; i++) {
			if (right[i] == undefined) {
				return Result.wrong;
			} else {
				const result = isOrderRight(left[i], right[i]);
				if (result != Result.continue) return result;				
			} 
		}
		return left.length === right.length ? Result.continue : Result.right;
	}
}

async function p2022day13_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `[1,1,3,1,1]\n[1,1,5,1,1]\n\n[[1],[2,3,4]]\n[[1],4]\n\n[9]\n[[8,7,6]]\n\n[[4,4],4,4]\n[[4,4],4,4,4]\n\n[7,7,7,7]\n[7,7,7]\n\n[]\n[3]\n\n[[[]]]\n[[]]\n\n[1,[2,[3,[4,[5,6,7]]]],8,9]\n[1,[2,[3,[4,[5,6,0]]]],8,9]`,
			extraArgs: [],
			expected: `13`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day13_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day13_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day13_part2(input));
	const part2After = performance.now();

	logSolution(13, 2022, part1Solution, part2Solution);

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
