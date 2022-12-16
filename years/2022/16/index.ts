import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 16;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/16/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/16/data.txt
// problem url  : https://adventofcode.com/2022/day/16

class Valve {
	public connected: Valve[] = [];
	constructor(public id: string, public rate: number = 0){}
}

function initValves(input: string): Map<string, Valve> {
	const valves: Map<string, Valve> = new Map();
	const lines = input.split("\n");
	for (const line of lines) {
		const arr = line.split(' ');
		const id = arr[1];
		const rateStr = arr[4];
		const rate = rateStr.slice(5, rateStr.length-1);
		const start = 9;
		const connected: Valve[] = [];
		for (let i = start; i < arr.length; i++) {
			const curr = arr[i].replace(',', '');
			if (!valves.has(curr)) {
				valves.set(curr, new Valve(curr));
			}
			connected.push(valves.get(curr)!);
		}
		if (!valves.has(id)) valves.set(id, new Valve(id));
		const currValve = valves.get(id)!;
		currValve.rate = Number(rate);
		currValve.connected = connected;
	}
	return valves;
}

async function p2022day16_part1(input: string, ...params: any[]) {
	const valves = initValves(input);

	return "Not implemented";
}



async function p2022day16_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB\nValve BB has flow rate=13; tunnels lead to valves CC, AA\nValve CC has flow rate=2; tunnels lead to valves DD, BB\nValve DD has flow rate=20; tunnels lead to valves CC, AA, EE\nValve EE has flow rate=3; tunnels lead to valves FF, DD\nValve FF has flow rate=0; tunnels lead to valves EE, GG\nValve GG has flow rate=0; tunnels lead to valves FF, HH\nValve HH has flow rate=22; tunnel leads to valve GG\nValve II has flow rate=0; tunnels lead to valves AA, JJ\nValve JJ has flow rate=21; tunnel leads to valve II`,
			extraArgs: [],
			expected: `1651`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day16_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day16_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day16_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day16_part2(input));
	const part2After = performance.now();

	logSolution(16, 2022, part1Solution, part2Solution);

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
