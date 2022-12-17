import _, { isMatch } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 17;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/17/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/17/data.txt
// problem url  : https://adventofcode.com/2022/day/17

const ROCKS = [
	['@@@@'],
	['.@.', '@@@', '.@.'],
	['..@', '..@', '@@@'],
	['@','@','@','@'],
	['@@', '@@']
]

const DIR = {
	'<': -1,
	'>': 1
}

function spawn(rock: string[], cave: string[]): void {
	let floor = 0;
	for (let i = 0; i < cave.length; i++) {
		if (cave[i].trim().length != 0) {
			floor = i;
		}
	}
	for (let i = 0; i < 3; i++) cave.unshift('.......');
	for (let i = rock.length-1; i >= 0; i--) {
		const line = ('..' + rock[i]).padEnd(7, '.');		
		cave.unshift(line);
	}	
	return;
}

function blown(cave: string[], direction: string): void {
	let foundRock = false;
	let lines = 0;
	let end = 1;
	// check if can be blown
	for (let i = 0; i < cave.length; i++) {
		const row = cave[i];
		const edge = direction == '<' ? row.indexOf('@') : row.lastIndexOf('@');
		if (edge != -1) {
			foundRock = true;
			lines++;
			const toCheck = edge + DIR[direction as '<' | '>'];
			if (toCheck < 0 || toCheck >= 7) return;
			if (row.charAt(toCheck) != '.') return;
		} else if (foundRock) {
			end = i;
			break;
		}
	}

	// blow
	for (let i = end-lines; i < end; i++) {
		const offset = DIR[direction as '<' | '>'];
		const row = cave[i];
		let indexes = [];
		for (let i = 0; i < row.length; i++) {
			const cell = row[i];
			if (cell == '@') indexes.push(i);
		}
		while (cave[i].includes('@'))	cave[i] = cave[i].replace('@', '.');
		for (let index of indexes) {
			const newIndex = index + offset;
			cave[i] = cave[i].slice(0, newIndex) + '@' + cave[i].slice(newIndex + 1);
		}
	}
	return;
}

function dropAndKeepDropping(cave: string[]): boolean {
	let foundRock = false;
	let lines = 0;
	let end = 1;
	
	// get range to check
	for (let i = 0; i < cave.length; i++) { 
		const row = cave[i];
		if (row.includes('@')) {
			foundRock = true;
			lines++;
			end = i+1;
		} else if (foundRock) {			
			break;
		}
	}
	// check if possible to drop
	if (end == 0) return false; // on the ground
	for (let i = end-lines; i < end; i++) {
		const row = cave[i];
		if (row == undefined) {
			continue;
		}
		for (let col = 0; col < 7; col++) {
			const cell = row[col];
			if (cell == '@') {
				const toCheck = i + 1;
				if (toCheck >= cave.length) return false;
				if (!'@.'.includes(cave[toCheck][col])) return false; // hit something				
			}
		}		
	}
	// actually drop
	for (let i = end-1; i >= end-lines; i--) {
		while (cave[i].includes('@')) {
			const index = cave[i].indexOf('@');
			cave[i+1] = cave[i+1].slice(0,index) + '@' + cave[i+1].slice(index+1);
			cave[i] = cave[i].replace('@', '.');			
		}		
	}
	return true;
}

function lineIsFull(line: string): boolean {
	for (let i = 0; i < line.length; i++) {
		if (line.charAt(i) == '.') return false;
	}
	return true;
}

function lineIsEmpty(line:string): boolean {
	for (let i = 0; i < line.length; i++) {
		if (line.charAt(i) != '.') return false;		
	}
	return true;
}

function trimCave(cave: string[]): void {
	if (cave.length == 0) return;
	while (lineIsEmpty(cave[0])) {cave.shift()};
}

function solidifyRock(cave: string[]): void {
	let foundRock = false;
	for (let i = 0; i < cave.length; i++) { // get range to check
		const row = cave[i];
		if (row.includes('@')) {
			foundRock = true;
			do {
				cave[i] = cave[i].replace('@', '#');
			} while (cave[i].includes('@'))			
		} else if (foundRock) {
			break;
		}
	}
}

function printCave(cave: string[]): void {
	for (let line of cave) {
		console.log(`|${line}|`);
	}
	console.log('+-------+')
}

async function p2022day17_part1(input: string, ...params: any[]) {
	const directions = input.trim();
	let dirIndex = 0;
	const cave: string[] = [];
	for (let i = 0; i < 2022; i++) {
		handleOneRock(i);
	}
	trimCave(cave);	
	return cave.length; 

	function handleOneRock(rockIndex: number): number {
		const rock = ROCKS[rockIndex%5];
		spawn(rock, cave);
		let keepDropping = true;
		let dropDistance = 0;
		while (keepDropping) {
			trimCave(cave);
			blown(cave, directions.charAt(dirIndex%directions.length));
			dirIndex++;
			dirIndex = dirIndex%directions.length;
			keepDropping = dropAndKeepDropping(cave);		
			if (keepDropping) dropDistance++;	
		}
		solidifyRock(cave);
		return dropDistance;
	}
}

async function p2022day17_part2(input: string, ...params: any[]) {
	let cycleLen = 0
	let cycleHeight = 0; 
	let key = '';
	findCycleLengthAndHeight(input);

	const trillion = 1000000000000;
	const numCycles = Math.floor(trillion / cycleLen) - 1;
	const remainder = trillion - (numCycles * cycleLen);

	const directions = input.trim();
	let dirIndex = 0;
	let cave: string[] = [];
	
	for (let i = 0; i < remainder; i++) {			
		const rock = ROCKS[i%5];
		spawn(rock, cave);
		let keepDropping = true;
		while (keepDropping) {
			trimCave(cave);
			blown(cave, input.charAt(dirIndex%directions.length));
			dirIndex++;
			dirIndex = dirIndex%directions.length;
			keepDropping = dropAndKeepDropping(cave);			
		}
		solidifyRock(cave);		
	}	
		

	return (cycleHeight * numCycles) + cave.length;

	function findCycleLengthAndHeight(input: string): void {
		const directions = input.trim();
		let dirIndex = 0;
		let cave: string[] = [];
		const hashMap: Map<string, [number,number]> = new Map();
		for (let i = 0; i < 100000; i++) {	
			if (i < 1000) {
				handleOneRock(i);
			} else {
				trimCave(cave);
				const unique = `${i%5},${dirIndex},${cave.slice(0,5).join(',')}`;
				if (hashMap.has(unique)) {
					trimCave(cave);
					cycleLen = i - hashMap.get(unique)![0];
					cycleHeight = cave.length - hashMap.get(unique)![1];
					key = unique;
					return;
				} else {				
					hashMap.set(unique, [i,cave.length]);
				}
				handleOneRock(i);
			}			
		}	
		throw Error('no cycle found')

		function handleOneRock(rockIndex: number): void {
			const rock = ROCKS[rockIndex%5];
			spawn(rock, cave);
			let keepDropping = true;
			while (keepDropping) {				
				trimCave(cave);
				blown(cave, directions.charAt(dirIndex%directions.length));
				dirIndex++;
				dirIndex = dirIndex%directions.length;
				keepDropping = dropAndKeepDropping(cave);		
			}
			solidifyRock(cave);
		}		
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
			extraArgs: [],
			expected: `3068`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
			extraArgs: [],
			expected: `1514285714288`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day17_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day17_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day17_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day17_part2(input));
	const part2After = performance.now();

	logSolution(17, 2022, part1Solution, part2Solution);

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
