import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { bfSearch } from "../../../util/graph";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 21;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/21/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/21/data.txt
// problem url  : https://adventofcode.com/2022/day/21
enum OP {
	plus,
	times,
	divide,
	minus,
	literal,
}
class Monkey {
	constructor(public name: string, public op?: OP, public num?: number){}
	public depedencies: Monkey[] = [];

	public getNum(): number {
		if (this.num != undefined) return this.num;

		const first = this.depedencies[0].getNum();
		const second = this.depedencies[1].getNum();		
		switch (this.op) {
			case OP.plus: this.num = first + second; break;
			case OP.divide: this.num = Math.floor(first / second); break;
			case OP.times: this.num = first * second; break;
			case OP.minus: this.num = first - second; break;
			default: throw Error('unrecognized operation');
		}
		return this.num;
	}

	public getHumanAnswerFromRoot(path: Monkey[]): number {
		if (this.name != 'root') throw Error('calling getHumanAnswrFromRoot not from root');

		const left = this.depedencies[0];
		const right = this.depedencies[1];
		const correct = this.depedencies[0] == path[1] ? right : left;
		const incorrect = this.depedencies[0] == path[1] ? left : right;

		return incorrect.getHumanAnswer(path.slice(1), correct.getNum());
	}

	public getHumanAnswer(path: Monkey[], expected: number): number {
		if (this.name == 'humn') return expected;

		const left = this.depedencies[0];
		const right = this.depedencies[1];
		const correct = this.depedencies[0] == path[1] ? right : left;
		const incorrect = this.depedencies[0] == path[1] ? left : right;

		return incorrect.getHumanAnswer(path.slice(1), this.getNextExpected(expected, correct,incorrect))		
	}

	private getNextExpected(currExpected: number, correct: Monkey, incorrect: Monkey): number {
		if (this.op == OP.plus) {
			return currExpected - correct.getNum();
		}
		if (this.op == OP.times) {
			return Math.floor(currExpected / correct.getNum());
		}
		if (this.op == OP.minus) {
			if (correct == this.depedencies[0]) { // left
				return correct.getNum() - currExpected;
			} else { // right
				return correct.getNum() + currExpected;
			}
		}
		if (this.op == OP.divide) {
			if (correct == this.depedencies[0]) { // left
				return Math.floor(correct.getNum() / currExpected);
			} else { //right
				return correct.getNum() * currExpected;
			}
		}
		throw Error(`couldn't find next expected`);
	}
}

async function p2022day21_part1(input: string, ...params: any[]) {
	const monkeys: Map<string, Monkey> = new Map();
	initMonkeys();
	const root = monkeys.get('root') as Monkey;
	if (root == undefined) throw Error("undefined root");
	const answer = root.getNum();

	return answer;

	function initMonkeys(): void {
		const lines = input.split("\n");
		for (const line of lines) {		
			const name = line.split(':')[0].trim();
			const curr: Monkey = monkeys.has(name) ? monkeys.get(name)! : new Monkey(name);
			const yeet = line.split(' '); 
			if (yeet.length == 2) { // literal
				curr.op = OP.literal;
				curr.num = Number(_.nth(yeet, -1)?.trim());
			} else if (yeet.length == 4) { // operation
				const monkey1Name = yeet[1].trim();
				const monkey2Name = yeet[3].trim();
				let op: OP = OP.literal;
				switch(yeet[2].trim()) {
					case '+': op = OP.plus; break;
					case '-': op = OP.minus; break;
					case '*': op = OP.times; break;
					case '/': op = OP.divide;				
				}
				const monkey1: Monkey = monkeys.has(monkey1Name) ? monkeys.get(monkey1Name)! : new Monkey(monkey1Name);
				const monkey2: Monkey = monkeys.has(monkey2Name) ? monkeys.get(monkey2Name)! : new Monkey(monkey2Name);
				curr.op = op;
				curr.depedencies.push(monkey1);
				curr.depedencies.push(monkey2);
				monkeys.set(monkey1Name, monkey1);
				monkeys.set(monkey2Name, monkey2);
			} else {
				throw Error('unrecognized input line')
			}
			monkeys.set(name, curr);
		}
	}
}

async function p2022day21_part2(input: string, ...params: any[]) {
	const monkeys: Map<string, Monkey> = new Map();
	initMonkeys();
	const root = monkeys.get('root') as Monkey;
	if (root == undefined) throw Error("undefined root");
	
	const path = getPathFromRootToHuman();

	const answer = root.getHumanAnswerFromRoot(path);

	return answer;

	function getPathFromRootToHuman(): Monkey[] {
		const bfsOption = {
			isEnd: (monkey: Monkey) => {return monkey.name == 'humn'},
			start: root,
			neighbors: (monkey: Monkey) => {return monkey.depedencies}
		}

		const path = bfSearch(bfsOption);
		if (path == undefined) throw Error('no path found between root and human');
		return path.shortestPath;
	}

	function initMonkeys(): void {
		const lines = input.split("\n");
		for (const line of lines) {		
			const name = line.split(':')[0].trim();
			const curr: Monkey = monkeys.has(name) ? monkeys.get(name)! : new Monkey(name);
			const yeet = line.split(' '); 
			if (yeet.length == 2) { // literal
				curr.op = OP.literal;
				curr.num = Number(_.nth(yeet, -1)?.trim());
			} else if (yeet.length == 4) { // operation
				const monkey1Name = yeet[1].trim();
				const monkey2Name = yeet[3].trim();
				let op: OP = OP.literal;
				switch(yeet[2].trim()) {
					case '+': op = OP.plus; break;
					case '-': op = OP.minus; break;
					case '*': op = OP.times; break;
					case '/': op = OP.divide;				
				}
				const monkey1: Monkey = monkeys.has(monkey1Name) ? monkeys.get(monkey1Name)! : new Monkey(monkey1Name);
				const monkey2: Monkey = monkeys.has(monkey2Name) ? monkeys.get(monkey2Name)! : new Monkey(monkey2Name);
				curr.op = op;
				curr.depedencies.push(monkey1);
				curr.depedencies.push(monkey2);
				monkeys.set(monkey1Name, monkey1);
				monkeys.set(monkey2Name, monkey2);
			} else {
				throw Error('unrecognized input line')
			}
			monkeys.set(name, curr);
		}
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `root: pppw + sjmn\ndbpl: 5\ncczh: sllz + lgvd\nzczc: 2\nptdq: humn - dvpt\ndvpt: 3\nlfqf: 4\nhumn: 5\nljgn: 2\nsjmn: drzm * dbpl\nsllz: 4\npppw: cczh / lfqf\nlgvd: ljgn * ptdq\ndrzm: hmdt - zczc\nhmdt: 32`,
			extraArgs: [],
			expected: `152`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `root: pppw + sjmn\ndbpl: 5\ncczh: sllz + lgvd\nzczc: 2\nptdq: humn - dvpt\ndvpt: 3\nlfqf: 4\nhumn: 5\nljgn: 2\nsjmn: drzm * dbpl\nsllz: 4\npppw: cczh / lfqf\nlgvd: ljgn * ptdq\ndrzm: hmdt - zczc\nhmdt: 32`,
			extraArgs: [],
			expected: `301`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day21_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day21_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day21_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day21_part2(input));
	const part2After = performance.now();

	logSolution(21, 2022, part1Solution, part2Solution);

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
