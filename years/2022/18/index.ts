import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 18;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/18/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/18/data.txt
// problem url  : https://adventofcode.com/2022/day/18

type Coor = [number,number,number];

function sharesSide(coor1: Coor, coor2: Coor): boolean {
	let common = 0;
	let diff;
	for (let i = 0; i < 3; i++) {
		if (coor1[i] == coor2[i]) common++;
		else if (diff == undefined)	{
			diff = Math.abs(coor1[i] - coor2[i])
			if (diff > 1) return false;
		} else return false;
	}
	return true;
}

async function p2022day18_part1(input: string, ...params: any[]) {
	const droplets: [number,number,number][] = [];
	let sharedSides = 0;
	const lines = input.split("\n");
	for (const line of lines) {
		const curr: Coor = line.split(',').map(Number) as Coor;
		for (let droplet of droplets) {
			if (sharesSide(curr, droplet)) sharedSides++;
		}
		droplets.push(curr);
	}

	return (droplets.length * 6) - (sharedSides*2);
}

async function p2022day18_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5`,
			extraArgs: [],
			expected: `64`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day18_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day18_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day18_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day18_part2(input));
	const part2After = performance.now();

	logSolution(18, 2022, part1Solution, part2Solution);

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
