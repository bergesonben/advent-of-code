import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 17;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/17/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/17/data.txt
// problem url  : https://adventofcode.com/2022/day/17

const ROCKS = [
	['@@@@'],
	['.@.', '@@@', '.@.'],
	['..@', '..@', '@@@'],
	['@','@','@','@'],
	['@@', '@@']
]

function spawn(rock: string[], cave: string[]): void {
	let floor = 0;
	for (let i = 0; i < cave.length; i++) {
		if (cave[i].trim().length != 0) {
			floor = i;
		}
	}
	for (let i = 0; i < 3; i++) cave.unshift('.......');
	for (let i = rock.length-1; i >= 0; i--) {
		const line = ('..' + rock[i]).padEnd(7, '.');		
		cave.unshift(line);
	}	
	return;
}

function blown(cave: string, direction: string): string {
	return '';
}

function drop(cave: string): boolean {
	return false;
}

function lineIsFull(line: string): boolean {
	for (let i = 0; i < line.length; i++) {
		if (line.charAt(i) == '.') return false;
	}
	return true;
}

function lineIsEmpty(line:string): boolean {
	for (let i = 0; i < line.length; i++) {
		if (line.charAt(i) != '.') return false;		
	}
	return true;
}

function trimCave(cave: string[]): number {
	while (cave[0].trim().length == 0) {cave.shift()};

	let count = 0;
	for (let i = cave.length-1; i >= 0; i--) {
		if (lineIsFull(cave[i])) {
			cave.pop();
			count++;
		}
	}
	return count;
}

async function p2022day17_part1(input: string, ...params: any[]) {
	const directions = input;
	const cave: string[] = [];
	let dirIndex = 0;
	let height = 0;
	for (let i = 0; i < 5; i++) {
		const rock = ROCKS[i%5];
		spawn(rock, cave);
		const add = trimCave(cave);
		
		// do {
		// 	blown(cave, input.charAt(dirIndex%input.length));
		// 	dirIndex++;
		// } while (!drop(cave))		
	}
	return height;
}

async function p2022day17_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
			extraArgs: [],
			expected: `3068`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day17_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day17_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day17_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day17_part2(input));
	const part2After = performance.now();

	logSolution(17, 2022, part1Solution, part2Solution);

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
