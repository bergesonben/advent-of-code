import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
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
}

async function p2022day15_part1(input: string, ...params: any[]) {
	const sensors = getSensors(input);
	const answer = findAnswerForLine(2000000);
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

	
	
	function getSensors(input: string): Sensor[] {
		const sensors: Sensor[] = [];
		const lines = input.split("\n");
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
		return sensors;
	}


}

async function p2022day15_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15\nSensor at x=9, y=16: closest beacon is at x=10, y=16\nSensor at x=13, y=2: closest beacon is at x=15, y=3\nSensor at x=12, y=14: closest beacon is at x=10, y=16\nSensor at x=10, y=20: closest beacon is at x=10, y=16\nSensor at x=14, y=17: closest beacon is at x=10, y=16\nSensor at x=8, y=7: closest beacon is at x=2, y=10\nSensor at x=2, y=0: closest beacon is at x=2, y=10\nSensor at x=0, y=11: closest beacon is at x=2, y=10\nSensor at x=20, y=14: closest beacon is at x=25, y=17\nSensor at x=17, y=20: closest beacon is at x=21, y=22\nSensor at x=16, y=7: closest beacon is at x=15, y=3\nSensor at x=14, y=3: closest beacon is at x=15, y=3\nSensor at x=20, y=1: closest beacon is at x=15, y=3`,
			extraArgs: [],
			expected: `26`
		}
	];
	const part2tests: TestCase[] = [];

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
