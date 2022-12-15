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

	public getImpossibleRange(line: number): Range | undefined {
		if (Math.abs(line - this.y) > this.distance) return;
		
		const vertDiff = Math.abs(this.y - line);
		const xCount = this.distance - vertDiff;
		return new Range(this.x - xCount, this.x + xCount);
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

class Range {
	public length: number;
	constructor(public start: number, public end: number){
		this.length = end - start;
	}

	public overlaps(otherRange: Range): boolean {
		return this.start <= otherRange.end && otherRange.start <= this.end;
	}

	public getOverlapLength(otherRange: Range): number {
		if (!this.overlaps(otherRange)) return 0;

		return 0;
	}

	public combine(otherRange: Range): Range {
		return new Range(Math.min(this.start, otherRange.start), Math.max(this.end, otherRange.end));
	}
}

async function p2022day15_part2(input: string, ...params: any[]) {
	const [sensors, line] = init(input);
	const answer = findAnswerForLine(line);
	return answer;

	

	function findAnswerForLine(line: number): number {
		const impossible: Range[] =  [];
		for (let sensor of sensors) {
			const newRange = sensor.getImpossibleRange(line);
			newRange != undefined && impossible.push(newRange);
		}
		return sumRanges(impossible);
	}

	function sumRanges(ranges: Range[]): number {
		if (ranges.length == 0) return 0;
		const newRanges = flattenRanges(ranges);

		const sum = newRanges.reduce((prev, curr) => {return prev + curr.length}, 0)

		return sum;
	}

	function flattenRanges(ranges: Range[]): Range[] {
		if (ranges.length <= 1) return ranges;
		const retval = [...ranges];
		let again = true;
		
		while (again) {
			again = false;
			for (let i = 0; i < retval.length-1; i++) {				
				const curr = retval[i];
				for (let j = i+1; j < retval.length; j++) {
					const other = retval[j];
					if (curr.overlaps(other)) {
						const newRange = curr.combine(other);
						retval.splice(j,1);						
						retval.splice(i,1);
						retval.push(newRange);
						again = true;
						break;
					}
				}
				if (again) break;				
			}
		}

		return retval;
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
