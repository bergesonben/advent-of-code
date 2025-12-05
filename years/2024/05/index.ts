import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";
import { error } from "console";

const YEAR = 2024;
const DAY = 5;

// solution path: /home/trevorsg/dev/t-hugs/advent-of-code/years/2024/05/index.ts
// data path    : /home/trevorsg/dev/t-hugs/advent-of-code/years/2024/05/data.txt
// problem url  : https://adventofcode.com/2024/day/5

function mySort(nums: number[], pairs: [number, number][]) {
	const sorted = [...nums];
	sorted.sort((a, b) => {
		if (a === b) {
			return 0;
		}
		for (const p of pairs) {
			if (p[0] === a && p[1] === b) {
				return -1;
			} else if (p[0] === b && p[1] === a) {
				return 1;
			}
		}
		throw new Error("oops");
	});
	return sorted;
}

async function p2024day5_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const pairs: [number, number][] = [];
	const runs: number[][] = [];
	for (const line of lines) {
		if (line.trim() === "") {
			continue;
		}
		if (line.indexOf("|") > 0) {
			pairs.push(line.split("|").map(Number) as [number, number]);
		} else {
			runs.push(line.split(",").map(Number));
		}
	}

	const pageNums: Set<number> = new Set();
	const pageMap: Map<number, [number, number][]> = new Map();
	for (const pair of pairs) {
		pageNums.add(pair[0]);
		pageNums.add(pair[1]);

		if (!pageMap.has(pair[0])) {
			pageMap.set(pair[0], []);
		}
		if (!pageMap.has(pair[1])) {
			pageMap.set(pair[1], []);
		}

		pageMap.get(pair[0])!.push(pair);
		pageMap.get(pair[1])!.push(pair);
	}
	let sum = 0;
	for (const run of runs) {
		let bad = false;
		for (let i = 0; i < run.length; ++i) {
			const num = run[i];
			const relevantPairs = pageMap.get(num);
			if (relevantPairs) {
				for (const pair of relevantPairs) {
					if (pair[0] === num) {
						// if pair[1] exists, it needs to be after
						for (let j = 0; j < i - 1; ++j) {
							if (run[j] === pair[1]) {
								bad = true;
								break;
							}
						}
					} else if (pair[1] === num) {
						// if pair[0] exists, it needs to be before
						for (let j = i + 1; j < run.length; ++j) {
							if (run[j] === pair[0]) {
								bad = true;
								break;
							}
						}
					} else {
						throw new Error("Whoops.");
					}
					if (bad) {
						break;
					}
				}
			}
		}
		if (!bad) {
			sum += run[Math.floor(run.length / 2)];
		}
	}
	return sum;
}

async function p2024day5_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const pairs: [number, number][] = [];
	const runs: number[][] = [];
	for (const line of lines) {
		if (line.trim() === "") {
			continue;
		}
		if (line.indexOf("|") > 0) {
			pairs.push(line.split("|").map(Number) as [number, number]);
		} else {
			runs.push(line.split(",").map(Number));
		}
	}

	const pageNums: Set<number> = new Set();
	const pageMap: Map<number, [number, number][]> = new Map();
	for (const pair of pairs) {
		pageNums.add(pair[0]);
		pageNums.add(pair[1]);

		if (!pageMap.has(pair[0])) {
			pageMap.set(pair[0], []);
		}
		if (!pageMap.has(pair[1])) {
			pageMap.set(pair[1], []);
		}

		pageMap.get(pair[0])!.push(pair);
		pageMap.get(pair[1])!.push(pair);
	}

	let sum = 0;
	for (const run of runs) {
		const sorted = mySort([...run], pairs);
		if (run.join(",") !== sorted.join(",")) {
			sum += sorted[Math.floor(run.length / 2)];
		}
	}
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
			extraArgs: [],
			expected: `143`,
			expectedPart2: `123`,
		},
	];
	const part2tests: TestCase[] = [];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2024day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2024day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2024day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2024, part1Solution, part2Solution);

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
