import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 5;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/05/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/05/data.txt
// problem url  : https://adventofcode.com/2022/day/5

async function p2022day5_part1(input: string, ...params: any[]) {
	const groups = input.split("\n\n");
	const lines = groups[0].split('\n');
	const columns:string  = lines.pop() ?? '';
	const indexes = [];
	let count = 1;
	let ind = columns.indexOf(count.toString())
	while (ind != -1) {
		indexes.push(ind);
		count++;
		ind = columns.indexOf(count.toString());
	}

	const stacks = Array(indexes.length).fill([]).map(_ => new Array());
	
	for (let line of lines) {
		for (let i = 0; i < indexes.length; i++) {
			const index = indexes[i];
			const letter = line.charAt(index).trim();
			if (letter.length != 0) {
				stacks[i].push(letter);
			}
		}	
	}
	
	const instructions = groups[1].split('\n');
	for (let line of instructions) {
		const foo = line.split(' ')	;
		const count = Number(foo[1]);
		const start = Number(foo[3]);
		const end = Number(foo[5]);

		for (let i = 0; i < count; i++) {
			const item = stacks[start-1].shift();
			stacks[end-1].unshift(item);
		}
	}

	const yeet = stacks.map(x => x[0]).join('');
	return yeet;

}

async function p2022day5_part2(input: string, ...params: any[]) {
	const groups = input.split("\n\n");
	const lines = groups[0].split('\n');
	const columns:string  = lines.pop() ?? '';
	const indexes = [];
	let count = 1;
	let ind = columns.indexOf(count.toString())
	while (ind != -1) {
		indexes.push(ind);
		count++;
		ind = columns.indexOf(count.toString());
	}

	const stacks = Array(indexes.length).fill([]).map(_ => new Array());
	
	for (let line of lines) {
		for (let i = 0; i < indexes.length; i++) {
			const index = indexes[i];
			const letter = line.charAt(index).trim();
			if (letter.length != 0) {
				stacks[i].push(letter);
			}
		}	
	}
	
	const instructions = groups[1].split('\n');
	for (let line of instructions) {
		const foo = line.split(' ')	;
		const count = Number(foo[1]);
		const start = Number(foo[3]);
		const end = Number(foo[5]);

		const yote = [];
		for (let i = 0; i < count; i++) {
			yote.unshift(stacks[start-1].shift());
		}
		for (let x of yote) {
			stacks[end-1].unshift(x);
		}		
	}

	const yeet = stacks.map(x => x[0]).join('');
	return yeet;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `    [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2`,
			extraArgs: [],
			expected: `CMZ`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `    [D]    \n[N] [C]    \n[Z] [M] [P]\n 1   2   3 \n\nmove 1 from 2 to 1\nmove 3 from 1 to 3\nmove 2 from 2 to 1\nmove 1 from 1 to 2`,
			extraArgs: [],
			expected: `MCD`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2022, part1Solution, part2Solution);

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
