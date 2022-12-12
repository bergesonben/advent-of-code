import _, { create } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 11;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/11/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/11/data.txt
// problem url  : https://adventofcode.com/2022/day/11

class Monkey {
	constructor(public items: number[], public operation: Op, public test: Test){}
	public inspectedCount = 0;

	public yeetReceiverAndItem(): [number, number] {
		this.inspectedCount++;
		const item = this.items.shift()!;
		const newItem = Math.floor(this.operation.eval(item) / 3);
		return [this.test.test(newItem), newItem];
	}
}

class Monkey2 {
	constructor(public items: number[], public operation: Op, public test: Test, public id: number){}
	public inspectedCount = 0;

	public yeetReceiverAndItem(): [number, number] {
		this.inspectedCount++;
		const item = this.items.shift()!;
		const newItem = this.operation.eval(item);	
		let foo = 0;
		if (newItem > Number.MAX_SAFE_INTEGER / 10) {
			foo++;	
		}
		return [this.test.test(newItem), newItem];
	}
}

class Test {
	constructor(public divisibleBy: number, public trueNum: number, public falseNum: number){}

	public test(x: number): number {
		return (x % this.divisibleBy == 0) ? this.trueNum : this.falseNum;
	}
}

class Op {
	constructor(public first: string, public second: string, public opStr: string){}

	public eval(x: number): number {
		const firstNum = this.first == 'old' ? x : Number(this.first);
		const secondNum = this.second == 'old' ? x : Number(this.second);
		if (this.opStr == '*') {
			return firstNum * secondNum;
		} else {
			return firstNum + secondNum;
		}
	}	
}

async function p2022day11_part1(input: string, ...params: any[]) {
	const monkeys = createMonkeys(input);
	for (let round = 0; round < 20; round++) {
		for (let monkey of monkeys) {
			while (monkey.items.length > 0) {
				const yeetReceiverAndItem = monkey.yeetReceiverAndItem();				
				monkeys[yeetReceiverAndItem[0]].items.push(yeetReceiverAndItem[1]);				
			}
		}
	}
	monkeys.sort((a,b) => b.inspectedCount - a.inspectedCount);
	return monkeys[0].inspectedCount * monkeys[1].inspectedCount;

	function createMonkeys(input: string): Monkey[] {
		const monkeys: Monkey[] = [];
		const lines = input.split("\n");
		let startingItems: number[] = [];
		let op: Op = new Op('','','');
		for (let i = 0; i < lines.length; i++) {
			const lineNum = i % 7;			
			const line = lines[i];
			const content = line.split(':')[1];			
			if (lineNum == 1) { // Starting items				
				startingItems = content.split(',').map(x => Number(x.trim()));
			} else if (lineNum == 2) { // operation
				op = parseOperation(content);
			} else if (lineNum == 3) { // test
				const test = parseTest(content, lines[i+1], lines[i+2]);
				i += 2;
				monkeys.push(new Monkey(startingItems, op, test));
			} 			
		}
		return monkeys;
	}

	function parseOperation(content: string): Op {
		const vars = content.split('=')[1].trim().split(' ').map(x => x.trim());
		return new Op(vars[0], vars[2], vars[1]);
	}

	function parseTest(content:string, trueLine: string, falseLine: string): Test {
		const divisibleBy = Number(content.split(' ')[3]);
		const trueNum = Number(trueLine.split(' ').pop());
		const falseNum = Number(falseLine.split(' ').pop());
		return new Test(divisibleBy, trueNum, falseNum);
	}
}

async function p2022day11_part2(input: string, ...params: any[]) {
	const monkeys = createMonkeys(input);
	const modVal = monkeys.reduce((prev, curr) => prev * curr.test.divisibleBy, 1);
	for (let round = 0; round < 10000; round++) {		
		for (let monkey of monkeys) {
			while (monkey.items.length > 0) {
				const yeetReceiverAndItem = monkey.yeetReceiverAndItem();				
				const newItem = yeetReceiverAndItem[1] % modVal;
				// const newItem = yeetReceiverAndItem[1]
				monkeys[yeetReceiverAndItem[0]].items.push(newItem);				
			}
		}
	}
	// for (let i = 0; i < monkeys.length; i++) {
	// 	console.log(`Monkey ${i}: ${monkeys[i].inspectedCount}`)
	// }
	monkeys.sort((a,b) => b.inspectedCount - a.inspectedCount);
	return monkeys[0].inspectedCount * monkeys[1].inspectedCount;

	function createMonkeys(input: string): Monkey2[] {
		const monkeys: Monkey2[] = [];
		const lines = input.split("\n");
		let startingItems: number[] = [];
		let op: Op = new Op('','','');
		for (let i = 0; i < lines.length; i++) {
			const lineNum = i % 7;			
			const line = lines[i];
			const content = line.split(':')[1];			
			if (lineNum == 1) { // Starting items				
				startingItems = content.split(',').map(x => Number(x.trim()));
			} else if (lineNum == 2) { // operation
				op = parseOperation(content);
			} else if (lineNum == 3) { // test
				const test = parseTest(content, lines[i+1], lines[i+2]);
				i += 2;
				monkeys.push(new Monkey2(startingItems, op, test, monkeys.length));
			} 			
		}
		return monkeys;
	}

	function parseOperation(content: string): Op {
		const vars = content.split('=')[1].trim().split(' ').map(x => x.trim());
		return new Op(vars[0], vars[2], vars[1]);
	}

	function parseTest(content:string, trueLine: string, falseLine: string): Test {
		const divisibleBy = Number(content.split(' ')[3]);
		const trueNum = Number(trueLine.split(' ').pop());
		const falseNum = Number(falseLine.split(' ').pop());
		return new Test(divisibleBy, trueNum, falseNum);
	}
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Monkey 0:\n  Starting items: 79, 98\n  Operation: new = old * 19\n  Test: divisible by 23\n    If true: throw to monkey 2\n    If false: throw to monkey 3\n\nMonkey 1:\n  Starting items: 54, 65, 75, 74\n  Operation: new = old + 6\n  Test: divisible by 19\n    If true: throw to monkey 2\n    If false: throw to monkey 0\n\nMonkey 2:\n  Starting items: 79, 60, 97\n  Operation: new = old * old\n  Test: divisible by 13\n    If true: throw to monkey 1\n    If false: throw to monkey 3\n\nMonkey 3:\n  Starting items: 74\n  Operation: new = old + 3\n  Test: divisible by 17\n    If true: throw to monkey 0\n    If false: throw to monkey 1`,
			extraArgs: [],
			expected: `10605`
		}
	];
	const part2tests: TestCase[] = [
		{
			input: `Monkey 0:\n  Starting items: 79, 98\n  Operation: new = old * 19\n  Test: divisible by 23\n    If true: throw to monkey 2\n    If false: throw to monkey 3\n\nMonkey 1:\n  Starting items: 54, 65, 75, 74\n  Operation: new = old + 6\n  Test: divisible by 19\n    If true: throw to monkey 2\n    If false: throw to monkey 0\n\nMonkey 2:\n  Starting items: 79, 60, 97\n  Operation: new = old * old\n  Test: divisible by 13\n    If true: throw to monkey 1\n    If false: throw to monkey 3\n\nMonkey 3:\n  Starting items: 74\n  Operation: new = old + 3\n  Test: divisible by 17\n    If true: throw to monkey 0\n    If false: throw to monkey 1`,
			extraArgs: [],
			expected: `2713310158`
		}
	];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2022, part1Solution, part2Solution);

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
