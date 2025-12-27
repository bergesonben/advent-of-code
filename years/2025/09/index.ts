import _ from "lodash";
import * as util from "../../../util/util";
import { mapAdd } from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 9;

// solution path: /home/benjamin/advent-of-code/years/2025/09/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/09/data.txt
// problem url  : https://adventofcode.com/2025/day/9

class Tile {
	constructor(public x: number, public y: number){}

	static fromString(pointStr: string): Tile {
		const foo =  pointStr.split(',').map(Number);
		return new Tile(foo[0], foo[1]);
	}
	
	public areaBetween(tile2: Tile): number {
		const width = Math.abs(this.x - tile2.x) + 1;
		const height = Math.abs(this.y - tile2.y) + 1;
		return width * height;
	}

	public toString(): string {
		return `(${this.x},${this.y})`;
	}
}

async function p2025day9_part1(input: string, ...params: any[]) {
	const tiles: Tile[] = input.split('\n').map(line => Tile.fromString(line));

	const areas: Map<number, [Tile, Tile]> = new Map();
	let count =0;
	for (let i = 0; i < tiles.length; i++) {
		const tile1 = tiles[i];
		for (let j = i + 1; j < tiles.length; j++) {
			const tile2 = tiles[j];
			const area = tile1.areaBetween(tile2);
			mapAdd(areas, area, [tile1, tile2], (a,b) => {
				count++;
				return a;
			});
		}
	}
		
	const largestArea = [...areas.keys()].sort((a,b) => b-a)[0];
	return largestArea;
}

async function p2025day9_part2(input: string, ...params: any[]) {
	const tiles: Tile[] = input.split('\n').map(line => Tile.fromString(line));
	tiles.sort((a, b) => a.x - b.x);
	const leftMostTile = tiles[0];
	const rightMostTile = tiles.at(-1)!;
	tiles.sort((a, b) => a.y - b.y);
	const topMostTile = tiles[0];
	const bottomMostTile = tiles.at(-1)!;
	console.log(`left: ${leftMostTile}, right: ${rightMostTile}, top: ${topMostTile}, bottom: ${bottomMostTile}`);


	
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
// 		{ input: `7,1
// 11,1
// 11,7
// 9,7
// 9,5
// 2,5
// 2,3
// 7,3`, expected: `50`, },
	];
	const part2tests: TestCase[] = [
		{ input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`, expected: `24`, },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	// const input = await util.getInput(DAY, YEAR);

	// const part1Before = performance.now();
	// const part1Solution = String(await p2025day9_part1(input));
	// const part1After = performance.now();

	// const part2Before = performance.now()
	// const part2Solution = String(await p2025day9_part2(input));
	// const part2After = performance.now();

	// logSolution(9, 2025, part1Solution, part2Solution);

	// log(chalk.gray("--- Performance ---"));
	// log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	// log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	// log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
