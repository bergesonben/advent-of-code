import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 22;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/22/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/22/data.txt
// problem url  : https://adventofcode.com/2022/day/22

class Tile {
	constructor(public row: number, public col: number){}
	public left: Tile | undefined;
	public up: Tile | undefined;
	public right: Tile | undefined;
	public down: Tile | undefined;
	public isWall = false;
}

enum Facing {
	right = 0,
	down = 1,
	left = 2,
	up = 3
}

type Steps = number;
type Turn = 'L' | 'R';
type Instruction = Steps | Turn;

async function p2022day22_part1(input: string, ...params: any[]) {
	const tiles: (Tile | undefined)[][] = [];
	let currTile: Tile = new Tile(6, 8);
	let facing: Facing = Facing.right;
	const instructions: Instruction[] = [];

	initTiles();
	parseInstructions();

	for (let instruction of instructions) {
		if (typeof instruction == 'number') { // steps
			takeSteps(instruction);
		} else { // turn
			turn(instruction);
		}
	}

	const answer = (1000 * currTile!.row) + (4 * currTile!.col) + facing!;
	return answer;

	function initTiles(): void {
		const lines = _.slice(input.split("\n"), 0, -1);
		for (const [row, line] of lines.entries()) {
			const newRow: (Tile | undefined)[] = [];
			for (let col = 0; col < line.length; col++) {
				const char = line[col];
				let newTile: Tile | undefined = new Tile(row+1, col+1);;
				if (char == ' ') {
					newTile = undefined;
				} else if (char == '#') {
					newTile.isWall = true;
				} else if (char == '.') {
					newTile.isWall = false;
				} else {
					throw Error('unexpected char in map');
				}
				newRow.push(newTile);
			}
			tiles.push(newRow);
		}

		for (let i = 0; i < tiles.length; i++) {
			const row = tiles[i];			
			for (let j = 0; j < row.length; j++) {
				const tile = row[j];
				if (tile == undefined) continue;
				let right = row[j+1];
				if (right == undefined) {
					for (let x = 0; x < row.length; x++) {
						if (row[x] != undefined) {
							right = row[x];
							break;
						}
					}
				}
				let left = row[j-1];
				if (left == undefined) {
					for (let x = row.length-1; x >= 0; x--) {
						if (row[x] != undefined) {
							left = row[x];
							break;
						}
					}
				}
				let up = tiles[i-1]?.[j];
				if (up == undefined) {
					for (let x = tiles.length-1; x >= 0; x--) {
						if (tiles[x][j] != undefined) {
							up = tiles[x][j];
							break;
						}
					}
				}
				let down = tiles[i+1]?.[j];
				if (down == undefined) {
					for (let x = 0; x < tiles.length; x++) {
						if (tiles[x][j] != undefined) {
							down = tiles[x][j];
							break;
						}
					}
				}
				tile.left = left;
				tile.right = right;
				tile.up = up;
				tile.down = down;
			}
		}
	}

	function parseInstructions(): void {
		const rawInstr = _.nth(input.split("\n"),-1);
		if (rawInstr == undefined) throw Error('could not parse instructions')

		let prevNum = 0;
		for (let i = 0; i < rawInstr.length; i++) {
			const char = rawInstr[i];
			if (char == 'L' || char == 'R') {
				instructions.push(prevNum);
				instructions.push(char);
				prevNum = 0;
			} else {
				prevNum = (prevNum * 10) + Number(char);
			}
		}	
	}

	function takeSteps(steps: Steps): void {

	}

	function turn(t: Turn): void {

	}
}

async function p2022day22_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `        ...#\n        .#..\n        #...\n        ....\n...#.......#\n........#...\n..#....#....\n..........#.\n        ...#....\n        .....#..\n        .#......\n        ......#.\n\n10R5L5R10L4R5L5`,
			extraArgs: [],
			expected: `6032`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day22_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day22_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day22_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day22_part2(input));
	const part2After = performance.now();

	logSolution(22, 2022, part1Solution, part2Solution);

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
