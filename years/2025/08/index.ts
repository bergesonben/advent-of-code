import _ from "lodash";
import * as util from "../../../util/util";
import { mapAdd } from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { normalizeTestCases } from "../../../util/test";

const YEAR = 2025;
const DAY = 8;

// solution path: /home/benjamin/advent-of-code/years/2025/08/index.ts
// data path    : /home/benjamin/advent-of-code/years/2025/08/data.txt
// problem url  : https://adventofcode.com/2025/day/8

class Point {
	constructor(public x: number, public y: number, public z: number){}

	static fromString(pointStr: string): Point {
		const foo =  pointStr.split(',').map(Number);
		return new Point(foo[0], foo[1], foo[2]);
	}

	public distanceFrom(otherPoint: Point): number {
		const xDiff = this.x - otherPoint.x;
		const yDiff = this.y - otherPoint.y;
		const zDiff = this.z - otherPoint.z;
		return (xDiff * xDiff) + (yDiff * yDiff) + (zDiff * zDiff);
	}

	public toString(): string {
		return `(${this.x},${this.y},${this.z})`;
	}
}

function splitIntoCircuits(topN: number[], distances: Map<number, [Point,Point]>): Set<Point>[] {
	let circuits: Set<Point>[] = [];
	for (let i = 0; i < topN.length; i++) {
		const pointPair = distances.get(topN[i])!;
		const connectedCircuits = circuits.filter((circuit: Set<Point>) => {
			return circuit.has(pointPair[0]) || circuit.has(pointPair[1]);
		})
		const newCircuit: Set<Point> = connectedCircuits.reduce((circuit1: Set<Point>, circuit2: Set<Point>) => {
			return circuit1.union(circuit2);
		}, new Set());
		newCircuit.add(pointPair[0]);
		newCircuit.add(pointPair[1]);
		const tempCircuits = circuits.filter((circuit: Set<Point>) => {
			return !connectedCircuits.includes(circuit);
		});
		circuits = tempCircuits;
		circuits.push(newCircuit);
	}
	return circuits;
}

async function p2025day8_part1(input: string, ...params: any[]) {
	const N = 1000;
	const lines = input.split('\n');
	const points: Point[] = lines.map((line) => {
		return Point.fromString(line);
	});

	const distances: Map<number, [Point,Point]> = new Map();
	for (let i = 0; i < points.length; i++) {
		const pointA = points[i];
		for (let j = i+1; j < points.length; j++) {
			const pointB = points[j];
			const dist = pointA.distanceFrom(pointB);
			mapAdd(distances, dist, [pointA, pointB], (a,b)=>{return[]})			
		}
	}

	const topN = [...distances.keys()].sort((a,b) => a-b).slice(0,N);
	
	const circuits = splitIntoCircuits(topN, distances);

	circuits.sort((a: Set<Point>,b: Set<Point>) => {
		return b.size - a.size;
	});

	// for (let circuit of circuits) {
	// 	console.log(`${Array.from(circuit)}`);
	// }
	
	return circuits[0].size * circuits[1].size * circuits[2].size;
}

function getLastBoxes(sortedKeys: number[], numPoints: number, distances: Map<number, [Point,Point]>): [Point, Point] {
	let circuits: Set<Point>[] = [];
	let i = 0;
	let pointPair: [Point, Point];
	do {
		pointPair = distances.get(sortedKeys[i])!;
		const connectedCircuits = circuits.filter((circuit: Set<Point>) => {
			return circuit.has(pointPair[0]) || circuit.has(pointPair[1]);
		})
		const newCircuit: Set<Point> = connectedCircuits.reduce((circuit1: Set<Point>, circuit2: Set<Point>) => {
			return circuit1.union(circuit2);
		}, new Set());
		newCircuit.add(pointPair[0]);
		newCircuit.add(pointPair[1]);
		const tempCircuits = circuits.filter((circuit: Set<Point>) => {
			return !connectedCircuits.includes(circuit);
		});
		circuits = tempCircuits;
		circuits.push(newCircuit);
		i++;
	} while (circuits[0]?.size != numPoints) 
	return pointPair;
}

async function p2025day8_part2(input: string, ...params: any[]) {
	const lines = input.split('\n');
	const points: Point[] = lines.map((line) => {
		return Point.fromString(line);
	});

	const distances: Map<number, [Point,Point]> = new Map();
	for (let i = 0; i < points.length; i++) {
		const pointA = points[i];
		for (let j = i+1; j < points.length; j++) {
			const pointB = points[j];
			const dist = pointA.distanceFrom(pointB);
			mapAdd(distances, dist, [pointA, pointB], (a,b)=>{return[]})			
		}
	}

	const sortedKeys = [...distances.keys()].sort((a,b) => a-b);
	
	const lastBoxes = getLastBoxes(sortedKeys, points.length, distances);
	
	return lastBoxes[0].x * lastBoxes[1].x;
}

async function run() {
	const part1tests: TestCase[] = [
// 				{ input: `162,817,812
// 57,618,57
// 906,360,560
// 592,479,940
// 352,342,300
// 466,668,158
// 542,29,236
// 431,825,988
// 739,650,466
// 52,470,668
// 216,146,977
// 819,987,18
// 117,168,530
// 805,96,715
// 346,949,466
// 970,615,88
// 941,993,340
// 862,61,35
// 984,92,344
// 425,690,689`, expected: `40`, },
	];
	const part2tests: TestCase[] = [
// 		{ input: `162,817,812
// 57,618,57
// 906,360,560
// 592,479,940
// 352,342,300
// 466,668,158
// 542,29,236
// 431,825,988
// 739,650,466
// 52,470,668
// 216,146,977
// 819,987,18
// 117,168,530
// 805,96,715
// 346,949,466
// 970,615,88
// 941,993,340
// 862,61,35
// 984,92,344
// 425,690,689`, expected: `25272`, },
	];

	const [p1testsNormalized, p2testsNormalized] = normalizeTestCases(part1tests, part2tests);

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of p1testsNormalized) {
			test.logTestResult(testCase, String(await p2025day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of p2testsNormalized) {
			test.logTestResult(testCase, String(await p2025day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2025day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2025day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2025, part1Solution, part2Solution);

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
