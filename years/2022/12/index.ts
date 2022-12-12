import _, { initial, union } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

const YEAR = 2022;
const DAY = 12;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/12/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/12/data.txt
// problem url  : https://adventofcode.com/2022/day/12

async function p2022day12_part1(input: string, ...params: any[]) {
	const grid: number[][] = [];	
	const distances: number[][] = [];
	let start: [number,number] = [0,0];
	let end: [number,number] = [0,0];	

	init();

	const unvisited: [number,number][] = [];
	unvisited.push(start);	
	for (let i = 0; i < grid.length; i++) {
		distances.push([]);
		for (let j = 0; j < grid[0].length; j++) {
			if (i != start[0] || j != start[1])	unvisited.push([i,j]);			
			distances[i].push(Number.MAX_SAFE_INTEGER);
		}
	}
	
	distances[start[0]][start[1]] = 0;

	while (unvisited.length > 0) {
		const curr = unvisited.shift()!;
		if (curr[0] == end[0] && curr[1] == end[1]) break;
		const neighbors = getNeighbors(curr);
		const currDistance = distances[curr[0]][curr[1]];
		for (let neighbor of neighbors) {
			const currHeight = grid[curr[0]][curr[1]];
			const nHeight = grid[neighbor[0]][neighbor[1]];
			if (currHeight - nHeight >= -1) {// valid move
				const newDistance = currDistance + 1;
				const neighborDistance = distances[neighbor[0]][neighbor[1]];
				if (newDistance < neighborDistance) {
					distances[neighbor[0]][neighbor[1]] = newDistance;
				}
			}
		}
		unvisited.sort((a,b) => {
			return distances[a[0]][a[1]] - distances[b[0]][b[1]];
		})
	}

	
	return distances[end[0]][end[1]];

	function init(): void {
		const lines = input.split("\n");
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const row: number[] = [];
			for (let j = 0; j < line.length; j++) {
				if (line.charAt(j) == 'S') {
					start = [i,j];
					row.push('a'.charCodeAt(0));
				} else if (line.charAt(j) == 'E') {
					end = [i,j];
					row.push('z'.charCodeAt(0));
				} else {
					row.push(line.charCodeAt(j));
				}				
			}
			grid.push(row);
		}
	}

	function getNeighbors(coor: [number, number]): [number,number][] {
		const retval: [number,number][] = [];
		if (coor[0] > 0) retval.push([coor[0]-1, coor[1]]); // up
		if (coor[0] < grid.length-1) retval.push([coor[0]+1, coor[1]]); // down
		if (coor[1] > 0) retval.push([coor[0], coor[1]-1]); // left
		if (coor[1] < grid[0].length-1) retval.push([coor[0], coor[1]+1]); // right
		return retval;
	}
}

function shortestPath(grid: number[][], start: [number,number], end: [number,number]): number {
	const distances: number[][] = [];

	const unvisited: [number,number][] = [];
	unvisited.push(start);	
	for (let i = 0; i < grid.length; i++) {
		distances.push([]);
		for (let j = 0; j < grid[0].length; j++) {
			if (i != start[0] || j != start[1])	unvisited.push([i,j]);			
			distances[i].push(Number.MAX_SAFE_INTEGER);
		}
	}
	
	distances[start[0]][start[1]] = 0;

	while (unvisited.length > 0) {
		const curr = unvisited.shift()!;
		if (curr[0] == end[0] && curr[1] == end[1]) break;
		const neighbors = getNeighbors(curr);
		const currDistance = distances[curr[0]][curr[1]];
		for (let neighbor of neighbors) {
			const currHeight = grid[curr[0]][curr[1]];
			const nHeight = grid[neighbor[0]][neighbor[1]];
			if (currHeight - nHeight >= -1) {// valid move
				const newDistance = currDistance + 1;
				const neighborDistance = distances[neighbor[0]][neighbor[1]];
				if (newDistance < neighborDistance) {
					distances[neighbor[0]][neighbor[1]] = newDistance;
				}
			}
		}
		unvisited.sort((a,b) => {
			return distances[a[0]][a[1]] - distances[b[0]][b[1]];
		})
	}

	
	return distances[end[0]][end[1]];

	function getNeighbors(coor: [number, number]): [number,number][] {
		const retval: [number,number][] = [];
		if (coor[0] > 0) retval.push([coor[0]-1, coor[1]]); // up
		if (coor[0] < grid.length-1) retval.push([coor[0]+1, coor[1]]); // down
		if (coor[1] > 0) retval.push([coor[0], coor[1]-1]); // left
		if (coor[1] < grid[0].length-1) retval.push([coor[0], coor[1]+1]); // right
		return retval;
	}
}

async function p2022day12_part2(input: string, ...params: any[]) {
	const grid: number[][] = [];	
	const startPoints: [number,number][] = [];
	let end: [number,number] = [0,0];
	init();
	
	let min: number = Number.MAX_SAFE_INTEGER;
	for (let i = 0; i < startPoints.length; i++) {
		console.log(`trying ${i} of ${startPoints.length}`);
		const startPoint = startPoints[i];
		const newMin = shortestPath(grid, startPoint, end);
		if (newMin < min) min = newMin;
	}
	
	return min;

	function init(): void {
		const lines = input.split("\n");
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const row: number[] = [];
			for (let j = 0; j < line.length; j++) {
				if (line.charAt(j) == 'S') {
					startPoints.push([i,j]);
					row.push('a'.charCodeAt(0));
				} else if (line.charAt(j) == 'E') {
					end = [i,j];
					row.push('z'.charCodeAt(0));
				} else {
					if (line.charAt(j) == 'a') {
						startPoints.push([i,j]);
					}
					row.push(line.charCodeAt(j));
				}				
			}
			grid.push(row);
		}
	}
	
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi`,
			extraArgs: [],
			expected: `31`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi`,
			extraArgs: [],
			expected: `29`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day12_part2(input));
	const part2After = performance.now();

	logSolution(12, 2022, part1Solution, part2Solution);

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
