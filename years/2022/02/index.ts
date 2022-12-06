import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 2;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/02/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/02/data.txt
// problem url  : https://adventofcode.com/2022/day/2

const points = {
	'X': 0,
	'Y': 3,
	'Z': 6,	
	rock: 1,
	paper: 2, 
	scissors: 3
}

enum Result {
	win = 6,
	lose = 0,
	draw = 3
}

async function p2022day2_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let score = 0;
	for (const line of lines) {
		const [elf, me] = line.split(/\s+/);
		const round = await result(elf, me);
		score += points[me as ('X'|'Y'|'Z')] + Number(round);
	}
	return score;
}

async function result(elf: string, me: string): Promise<Result> {
	if (elf == 'A') { // rock
		if (me == 'X') return Result.draw
		if (me == 'Y') return Result.win
		if (me == 'Z') return Result.lose
		trace('nono');
		return Result.lose;		
	} else if (elf == 'B') { //paper
		if (me == 'X') return Result.lose // rock
		if (me == 'Y') return Result.draw //paper
		if (me == 'Z') return Result.win // scissor
		trace('nono');
		return Result.lose;		
	} else if (elf == 'C') { //scissor
		if (me == 'X') return Result.win // rock
		if (me == 'Y') return Result.lose //paper
		if (me == 'Z') return Result.draw // scissor
		trace('nono');
		return Result.lose;	
	} else {
		trace('ohno');
	}
	return Result.lose;
}

async function p2022day2_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let score = 0;
	for (const line of lines) {
		const [elf, res] = line.split(/\s+/);
		if (elf == 'A') { // rock
			if (res == 'X') // lose
				score += points.scissors + points['X'];
			if (res == 'Y') // draw
				score += points.rock + points['Y'];
			if (res == 'Z') // win
				score += points.paper + points['Z'];
		} else if (elf == 'B') { // paper
			if (res == 'X') // lose
				score += points.rock + points['X'];
			if (res == 'Y') // draw
				score += points.paper + points['Y'];
			if (res == 'Z') // win
				score += points.scissors + points['Z'];
		} else { //scissor
			if (res == 'X') // lose
				score += points.paper + points['X'];
			if (res == 'Y') // draw
				score += points.scissors + points['Y'];
			if (res == 'Z') // win
				score += points.rock + points['Z'];
		}
		
	}
	return score;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `A Y\nB X\nC Z`,
			extraArgs: [],
			expected: `15`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `A Y\nB X\nC Z`,
			extraArgs: [],
			expected: `12`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2022, part1Solution, part2Solution);

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
