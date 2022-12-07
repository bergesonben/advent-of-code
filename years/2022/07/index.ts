import _, { size } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 7;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/07/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/07/data.txt
// problem url  : https://adventofcode.com/2022/day/7

class File {
	constructor(public size: number, public name: string){}
}

class Dir {
	constructor(public name: string, public parent: Dir | null) {}
	public files: Map<string, File> = new Map();
	public dirs: Map<string, Dir> = new Map();
	private size: number | undefined;	

	public getSize(): number {
		if (this.size == undefined) {
			let sum = 0;
			for (let [_, file] of this.files) {
				sum += file.size;
			}
			for (let [_, dir] of this.dirs) {
				sum += dir.getSize();
			}
			this.size = sum;
		}
		
		return this.size;
	}

	public print(numTabs: number): void {
		const colorStart = this.size ?? 0 <= 100000 ? '\x1b[33m' : '';
		const colorEnd = this.size ?? 0 <= 100000 ? '\x1b[0m' : '';
		console.log(`${colorStart}${'  '.repeat(numTabs)}- ${this.name} (dir)${colorEnd}`);
		for (let [_, dir] of this.dirs) {
			dir.print(numTabs + 1);
		}
		for (let [_, file] of this.files) {
			const colorStart = file.size <= 100000 ? '\x1b[33m' : '';
			const colorEnd = file.size <= 100000 ? '\x1b[0m' : '';
			console.log(`${colorStart}${'  '.repeat(numTabs + 1)}- ${file.name} (file, size=${file.size})${colorEnd}`);
		}
	}

	public getAnswer(): number {
		let sum = 0;
		for (let [_,dir] of this.dirs) {
			sum += dir.getAnswer();
		}
		if (this.size! <= 100000) {
			sum += this.size!;
		}
		return sum;
	}

	public getAnswer2(diff: number, minSoFar: number): number {
		if (this.size! < diff) return minSoFar;
		let min = this.size!;
		for (let [_, dir] of this.dirs) {
			min = Math.min(dir.getAnswer2(diff, minSoFar), min);
		}
		return min;
	}
}

async function p2022day7_part1(input: string, ...params: any[]) {
	const root = new Dir('root', null);

	const lines = input.split("\n");
	let inLs = false;
	let currDir: Dir = root;
	for (const line of lines) {
		const args = line.split(' ');
		if (args[0] == '$' && args[1] == 'cd') {
			inLs = false;
			if (args[2] == '..') {
				currDir = currDir.parent!;
			} else if (args[2] == '/') {
				currDir = root;
			} else {
				currDir = currDir.dirs.get(args[2])!;
			}		
		} else if (args[0] == '$' && args[1] == 'ls') {			
			inLs = true;
		} else if (inLs) {			
			if (args[0] == 'dir') {				
				const newDir = new Dir(args[1], currDir);
				currDir.dirs.set(args[1], newDir);
			} else if (args[0] != 'dir'){
				const newFile = new File(Number(args[0]), args[1]);
				currDir.files.set(args[1], newFile);
			}			
		}		
	}
	root.getSize();
	let answer = root.getAnswer();
	return answer;
}

async function p2022day7_part2(input: string, ...params: any[]) {
	const root = new Dir('root', null);

	const lines = input.split("\n");
	let inLs = false;
	let currDir: Dir = root;
	for (const line of lines) {
		const args = line.split(' ');
		if (args[0] == '$' && args[1] == 'cd') {
			inLs = false;
			if (args[2] == '..') {
				currDir = currDir.parent!;
			} else if (args[2] == '/') {
				currDir = root;
			} else {
				currDir = currDir.dirs.get(args[2])!;
			}		
		} else if (args[0] == '$' && args[1] == 'ls') {			
			inLs = true;
		} else if (inLs) {			
			if (args[0] == 'dir') {				
				const newDir = new Dir(args[1], currDir);
				currDir.dirs.set(args[1], newDir);
			} else if (args[0] != 'dir'){
				const newFile = new File(Number(args[0]), args[1]);
				currDir.files.set(args[1], newFile);
			}			
		}		
	}
	const totalSize = root.getSize();	
	const diff = totalSize - 40000000;
	
	let answer = root.getAnswer2(diff, totalSize);
	return answer;
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k`,
			extraArgs: [],
			expected: `95437`
		},
		{
			input: `$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k`,
			extraArgs: [],
			expected: `95437`
		}
		
	];
	const part2tests: TestCase[] = [
		{
			input: `$ cd /\n$ ls\ndir a\n14848514 b.txt\n8504156 c.dat\ndir d\n$ cd a\n$ ls\ndir e\n29116 f\n2557 g\n62596 h.lst\n$ cd e\n$ ls\n584 i\n$ cd ..\n$ cd ..\n$ cd d\n$ ls\n4060174 j\n8033020 d.log\n5626152 d.ext\n7214296 k`,
			extraArgs: [],
			expected: `24933642`
		},
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2022, part1Solution, part2Solution);

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
