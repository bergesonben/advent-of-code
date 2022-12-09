import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 9;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/09/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/09/data.txt
// problem url  : https://adventofcode.com/2022/day/9

async function p2022day9_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const visited: Set<string> = new Set([encode(0,0)]);
	let head: number[] = [0,0];
	let tail: number[] = [0,0];

	for (const line of lines) {
		const yeet = line.split(' ');
		const dir = yeet[0];
		const steps = Number(yeet[1]);
		takeSteps(dir, steps);
	}
	return visited.size;

	function takeSteps(dir: string, steps: number): void {
		for (let i = 0; i < steps; i++) {
			takeSingleStep(dir);
		}
	}

	function takeSingleStep(dir: string): void {
		switch (dir) {
			case 'R': 
				head = [head[0], head[1] + 1];
				break;
			case 'L':
				head = [head[0], head[1] -1];
				break;
			case 'U': 
				head = [head[0] + 1, head[1]];
				break;
			case 'D': 
				head = [head[0] - 1, head[1]];
		}
		moveTail();
	}

	function moveTail(): void {
		if (areAdjacent()) return;

		const rowDiff = head[0] - tail[0];
		const colDiff = head[1] - tail[1];

		let rowChange = 0;
		let colChange = 0;

		if (rowDiff == 0) { // on same row
			if (colDiff > 1) {
				colChange = 1
			} else if (colDiff < -1) {
				colChange = -1;
			}
		} else if (colDiff == 0) { // on same col
			if (rowDiff > 1) {
				rowChange = 1;
			} else if (rowDiff < -1) {
				rowChange = -1;
			}
		} else { // diagonal
			if (colDiff >= 1) {
				colChange = 1
			} else if (colDiff <= -1) {
				colChange = -1;
			}
			if (rowDiff >= 1) {
				rowChange = 1;
			} else if (rowDiff <= -1) {
				rowChange = -1;
			}
		}

		tail = [tail[0] + rowChange,tail[1] + colChange];
		visited.add(encode(tail[0], tail[1]));
	}

	function areAdjacent(): boolean {
		const rowDiff = Math.abs(head[0] - tail[0]);
		const colDiff = Math.abs(head[1] - tail[1]);
		return rowDiff <= 1 && colDiff <= 1;
	}

	function encode(row: number, col: number): string {
		return row.toString() + ',' + col.toString();
	}	
}

async function p2022day9_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	const visited: Set<string> = new Set([encode(0,0)]);
	let rope: number[][] = new Array(10).fill(1);
	rope = rope.map(_ => [0,0]);

	for (const line of lines) {
		const yeet = line.split(' ');
		const dir = yeet[0];
		const steps = Number(yeet[1]);
		takeSteps(dir, steps);
	}
	return visited.size;

	function takeSteps(dir: string, steps: number): void {
		for (let i = 0; i < steps; i++) {
			takeSingleStep(dir);			
		}
	}

	function takeSingleStep(dir: string): void {
		switch (dir) {
			case 'R': 
				rope[0] = [rope[0][0], rope[0][1] + 1];
				break;
			case 'L':
				rope[0] = [rope[0][0], rope[0][1] -1];
				break;
			case 'U': 
				rope[0] = [rope[0][0] + 1, rope[0][1]];
				break;
			case 'D': 
				rope[0] = [rope[0][0] - 1, rope[0][1]];
		}
		for (let i = 1; i < 10; i++) {
			moveSegment(i);
		}
	}
	
	function moveSegment(segment: number): void {
		if (areAdjacent(segment - 1, segment)) return;

		const prev = rope[segment - 1];
		const curr = rope[segment];

		const rowDiff = prev[0] - curr[0];
		const colDiff = prev[1] - curr[1];

		let rowChange = 0;
		let colChange = 0;

		if (rowDiff == 0) { // on same row
			if (colDiff > 1) {
				colChange = 1
			} else if (colDiff < -1) {
				colChange = -1;
			}
		} else if (colDiff == 0) { // on same col
			if (rowDiff > 1) {
				rowChange = 1;
			} else if (rowDiff < -1) {
				rowChange = -1;
			}
		} else { // diagonal
			if (colDiff >= 1) {
				colChange = 1
			} else if (colDiff <= -1) {
				colChange = -1;
			}
			if (rowDiff >= 1) {
				rowChange = 1;
			} else if (rowDiff <= -1) {
				rowChange = -1;
			}
		}

		rope[segment] = [curr[0] + rowChange,curr[1] + colChange];
		if (segment == 9) {
			visited.add(encode(rope[segment][0], rope[segment][1]));
		}
	}

	function areAdjacent(segment1: number, segment2: number): boolean {
		const rowDiff = Math.abs(rope[segment1][0] - rope[segment2][0]);
		const colDiff = Math.abs(rope[segment1][1] - rope[segment2][1]);
		return rowDiff <= 1 && colDiff <= 1;
	}

	function encode(row: number, col: number): string {
		return row.toString() + ',' + col.toString();
	}	
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2`,
			extraArgs: [],
			expected: `13`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2`,
			extraArgs: [],
			expected: `1`
		},
		{
			input: `R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20`,
			extraArgs: [],
			expected: `36`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2022, part1Solution, part2Solution);

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
