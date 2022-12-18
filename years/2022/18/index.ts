import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 18;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/18/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/18/data.txt
// problem url  : https://adventofcode.com/2022/day/18

type Coor = [number,number,number];

function sharesSide(coor1: Coor, coor2: Coor): boolean {
	let common = 0;
	let diff;
	for (let i = 0; i < 3; i++) {
		if (coor1[i] == coor2[i]) common++;
		else if (diff == undefined)	{
			diff = Math.abs(coor1[i] - coor2[i])
			if (diff > 1) return false;
		} else return false;
	}
	return true;
}

function getSurfaceArea(coors: Coor[]): number {	
	let sharedSides = 0;
	for (let i = 0; i < coors.length-1; i++) { 
		for (let j = i+1; j < coors.length; j++) {
			if (sharesSide(coors[i], coors[j])) sharedSides++;
		}
	}

	return (coors.length * 6) - (sharedSides*2);
}

function decode(str: string): Coor {
	return str.split(',').map(Number) as Coor;
}

async function p2022day18_part1(input: string, ...params: any[]) {
	const droplets: [number,number,number][] = [];
	const coors = input.split('\n').map(decode);

	const answer = getSurfaceArea(coors);
	return answer;
}

function getCavitiesSurfaceArea(droplets: Set<string>, maxCoor: Coor): number {
	const visited = new Set([...droplets]);
	const cavities: Set<string>[] = [];
	const outsideSpace: Set<string>[] = [];
	for (let x = 0; x < maxCoor[0]; x++) {
		for (let y = 0; y < maxCoor[1]; y++) {
			for (let z = 0; z < maxCoor[2]; z++) {
				if (visited.has([x,y,z].toString())) continue;
				const cavity: Set<string> = new Set();
				const enclosed = findCavity([x,y,z], cavity);
				if (enclosed) {
					cavities.push(cavity);
				} else {
					outsideSpace.push(cavity);
				}
				for (let coor of cavity) visited.add(coor);
			}
		}		
	}
	let totalSurfaceArea = 0;
	for (let cavity of cavities) {
		const surfaceArea = getSurfaceArea([...cavity].map(decode));
		totalSurfaceArea += surfaceArea;
	}
	return totalSurfaceArea;

	// returns if the cavity is enclosed
	function findCavity(coor: Coor, path: Set<string>): boolean {
		const dirs = directions(coor);
		path.add(coor.toString());
		let enclosed = true;
		for (let dir of dirs) {
			if (visited.has(dir.toString()) || path.has(dir.toString())) continue;
			if (!dir.every((x,index) => x >= 0 && x <= maxCoor[index])) {
				enclosed = false;
				continue;
			}
			if (!findCavity(dir, path)) enclosed = false;
		}
		return enclosed;
	}
}

function directions(coor: Coor): Coor[] {
	const retval: Coor[] = [];
	const [x,y,z] = coor;
	retval.push([x-1,y,z]);
	retval.push([x+1,y,z]);
	retval.push([x,y-1,z]);
	retval.push([x,y+1,z]);
	retval.push([x,y,z-1]);
	retval.push([x,y,z+1]);
	return retval;
}

async function p2022day18_part2(input: string, ...params: any[]) {
	const droplets: Set<string> = new Set();
	let sharedSides = 0;
	const lines = input.split("\n");
	let max: Coor = [0,0,0]
	for (const line of lines) {
		const curr: Coor = decode(line);
		max[0] = Math.max(max[0], curr[0]);
		max[1] = Math.max(max[1], curr[1]);
		max[2] = Math.max(max[2], curr[2]);
		for (let droplet of droplets) {
			if (sharesSide(curr, decode(droplet))) sharedSides++;
		}
		droplets.add(curr.join(','));
	}

	const cavitiesSurfaceArea = getCavitiesSurfaceArea(droplets, max);

	return (droplets.size * 6) - (sharedSides*2) - cavitiesSurfaceArea;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5`,
			extraArgs: [],
			expected: `64`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `2,2,2\n1,2,2\n3,2,2\n2,1,2\n2,3,2\n2,2,1\n2,2,3\n2,2,4\n2,2,6\n1,2,5\n3,2,5\n2,1,5\n2,3,5`,
			extraArgs: [],
			expected: `58`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day18_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day18_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day18_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day18_part2(input));
	const part2After = performance.now();

	logSolution(18, 2022, part1Solution, part2Solution);

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
