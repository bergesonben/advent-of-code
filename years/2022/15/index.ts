import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import {IntRange, flattenRanges} from "../../../util/range";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 15;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/15/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/15/data.txt
// problem url  : https://adventofcode.com/2022/day/15

const X = 0
const Y = 1
class Sensor {
	public distance: number;
	constructor(public x: number, public y: number, public beacon: [number,number]){
		const xDiff = Math.abs(x - beacon[X]);
		const yDiff = Math.abs(y - beacon[Y]);
		this.distance = xDiff + yDiff;
	}	

	public getImpossibleXsForLine(line: number): number[] {
		if (Math.abs(line - this.y) > this.distance) return [];
		const answer: number[] = []
		const vertDiff = Math.abs(this.y - line);
		const xCount = this.distance - vertDiff;
		for (let i = this.x - xCount; i < this.x + xCount+1; i++) {
			if (this.beacon[Y] == line && this.beacon[X] == i) continue;
			answer.push(i);
		}
		
		return answer;
	}

	public getImpossibleRange(line: number): IntRange | undefined {
		if (Math.abs(line - this.y) > this.distance) return;
		
		const vertDiff = Math.abs(this.y - line);
		const xCount = this.distance - vertDiff;
		return new IntRange(this.x - xCount, this.x + xCount);
	}
}

async function p2022day15_part1(input: string, ...params: any[]) {
	const [sensors, line] = init(input);
	const answer = findAnswerForLine(line);
	return answer;

	function findAnswerForLine(line: number): number {
		const impossible: Set<number> = new Set();
		for (let sensor of sensors) {
			const xS = sensor.getImpossibleXsForLine(line);
			for (let x of xS) {
				impossible.add(x);
			}
		}
		return impossible.size;
	}

	
	
	function init(input: string): [Sensor[], number] {
		const sensors: Sensor[] = [];
		const lines = input.split("\n");
		const retLine = lines.shift();
		for (const line of lines) {
			const foo = line.split(',');
			const sensorX = Number(foo[0].split('=').pop());
			const beaconX = Number(foo[1].split('=').pop());
			const bar = line.split(':');
			const sensorY = Number(bar[0].split('=').pop());
			const beaconY = Number(bar[1].split('=').pop());
			const newSensor = new Sensor(sensorX, sensorY, [beaconX, beaconY]);
			sensors.push(newSensor);
		}
		return [sensors, Number(retLine)];
	}
}

async function p2022day15_part2(input: string, ...params: any[]) {
	const [sensors, line] = init(input);
	const max = line;
	const coor = findBeaconCoor();	
	return coor[X] * 4000000 + coor[Y];

	function findEmptySpotForLine(line: number): number | undefined {
		let impossible: IntRange[] =  [];
		for (let sensor of sensors) {
			const newRange = sensor.getImpossibleRange(line);
			newRange != undefined && impossible.push(newRange);
		}
		impossible = flattenRanges(impossible);
		if (impossible.length > 1) {
			if (impossible[0].end < impossible[1].start) {
				return impossible[0].end+1;
			} else {
				return impossible[1].end+1;
			}
		}
		if (impossible[0].start > 0) return 0;
		if (impossible[0].end < max) return max;		
		return;
	}

	function findBeaconCoor(): [number,number] {
		for (let i = 0; i <= line; i++) {
			// if (i % 1000 == 0) console.log(i);
			const empty = findEmptySpotForLine(i);
			if (empty != undefined) {
				return [empty, i];
			}
		}
		throw Error('crap')
	}	
	
	function init(input: string): [Sensor[], number] {
		const sensors: Sensor[] = [];
		const lines = input.split("\n");
		const retLine = lines.shift();
		for (const line of lines) {
			const foo = line.split(',');
			const sensorX = Number(foo[0].split('=').pop());
			const beaconX = Number(foo[1].split('=').pop());
			const bar = line.split(':');
			const sensorY = Number(bar[0].split('=').pop());
			const beaconY = Number(bar[1].split('=').pop());
			const newSensor = new Sensor(sensorX, sensorY, [beaconX, beaconY]);
			sensors.push(newSensor);
		}
		return [sensors, Number(retLine)];
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `10\nSensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
			extraArgs: [],
			expected: `26`
		}
	];
	const part2tests: TestCase[] = [
		// {
		// 	input: `10\nSensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
		// 	extraArgs: [],
		// 	expected: `26`
		// },
		{
			input: `20\nSensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
			extraArgs: [],
			expected: `56000011`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day15_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day15_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day15_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day15_part2(input));
	const part2After = performance.now();

	logSolution(15, 2022, part1Solution, part2Solution);

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
