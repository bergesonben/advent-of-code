import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 2;

// solution path: /home/benjamin/advent-of-code/years/2025/02/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/02/data.txt
// problem url  : https://adventofcode.com/2025/day/2

function isInvalidID(id: number): boolean {
	const idString = id.toString();
	const numDigits = idString.length;
	if (numDigits % 2 === 1) {
		return false;
	}

	const half = numDigits / 2;
	const firstHalf = idString.slice(0, half);
	const secondHalf = idString.slice(half);

	if (firstHalf === secondHalf) {
		return true;
	} else {
		return false;
	}
}

function isInvalidIDv2(id: number): boolean {
	const idString = id.toString();
	const numDigits = util.numDigits(id);
	const half = numDigits / 2;
	for (let i = 1; i <= half; i++) {
		const substr = idString.substring(0, i);
		const repeated = substr.repeat(idString.length / (i));
		if (idString === repeated) {
			return true;
		}
	}
	return false;
}


async function p2025day2_part1(input: string, ...params: any[]) {
	return "Not implemented";
	const ranges = input.split(",").map(x => x.split("-").map(Number));
	const invalidIDs: number[] = [];
	for (let range of ranges) {
		for (let i = range[0]; i <= range[1]; i++) {
			if (isInvalidID(i)) {
				invalidIDs.push(i);
			}
		}
	}
	const sum = invalidIDs.reduce((a, b) => a + b, 0);
	return sum;
}

async function p2025day2_part2(input: string, ...params: any[]) {
	const ranges = input.split(",").map(x => x.split("-").map(Number));
	const invalidIDs: number[] = [];
	for (let range of ranges) {
		for (let i = range[0]; i <= range[1]; i++) {
			if (isInvalidIDv2(i)) {
				invalidIDs.push(i);
			}
		}
	}
	console.log(invalidIDs);
	const sum = invalidIDs.reduce((a, b) => a + b, 0);
	console.log(sum);
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [
		{ input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`, expected: `1227775554`},
	];
	const part2tests: TestCase[] = [
		{ input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`, expected: `4174379265`},
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2025, part1Solution, part2Solution);

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
