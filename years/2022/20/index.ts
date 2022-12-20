import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 20;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/20/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/20/data.txt
// problem url  : https://adventofcode.com/2022/day/20

class Node {
	constructor(public value: number){}
	public next?: Node;
	public prev?: Node;
	public isHead = false;

	public executeAndReturnNewHead(): Node | undefined {
		let nodeToInsertInFrontOf: Node = this.value < 0 ? this : this.next!;
		if (this.value == 0) {
			// console.log("0 does not move");
			return;
		}
		if (this.value < 0) {
			for(let i = 0; i < Math.abs(this.value); i++) {
				if (nodeToInsertInFrontOf.prev == undefined) throw Error ('undefined prev found in Node')
				nodeToInsertInFrontOf = nodeToInsertInFrontOf.prev;
			}			
		} else {
			for(let i = 0; i < this.value; i++) {
				if (nodeToInsertInFrontOf.next == undefined) throw Error ('undefined next found in Node')
				nodeToInsertInFrontOf = nodeToInsertInFrontOf.next;
			}
		}

		let newHead;
		if (this.isHead) {
			this.isHead = false;
			this.next!.isHead = true;
			newHead = this.next!;
		}
		
		// remove this from the list
		this.prev!.next = this.next;
		this.next!.prev = this.prev;
		// insert this
		this.next = nodeToInsertInFrontOf;
		this.prev = nodeToInsertInFrontOf.prev!;
		nodeToInsertInFrontOf.prev!.next = this;
		nodeToInsertInFrontOf.prev = this;

		// console.log(`${this.value} moves between ${this.prev!.value} and ${this.next.value}`);
		// if (nodeToInsertInFrontOf.isHead) {
		// 	this.isHead = true;
		// 	nodeToInsertInFrontOf.isHead = false;
		// 	return this;
		// } 
		if (newHead != undefined) return newHead;
	}
}

function printNodes(head: Node): void {
	let str = `${head.value}, `;
	let curr = head.next;
	while (curr != head) {
		str += `${curr!.value}, `
		curr = curr!.next!;
	}
	console.log(str);
}

async function p2022day20_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let head: Node = new Node(Number(lines[0]));	
	head.isHead = true;
	const nodesInOrder: Node[] = [];
	nodesInOrder.push(head);

	let zeroNode: Node = new Node(0);

	let prevNode: Node = head;
	for (let i = 1; i < lines.length; i++) {
		
		const newNode = (Number(lines[i]) == 0) ? zeroNode : new Node(Number(lines[i]));
		prevNode.next = newNode;
		newNode.prev = prevNode;
		prevNode = newNode;
		nodesInOrder.push(newNode);
	}
	prevNode.next = head;
	head.prev = prevNode;

	if (!nodesInOrder.every(n => n.next != undefined && n.prev != undefined)) throw Error('sanity check')

	// console.log(`Initial arrangement: ${nodesInOrder.map(x=>x.value)}`)
	for (let i = 0; i < nodesInOrder.length; i++) {
		const node = nodesInOrder[i];
		const maybeNewHead = node.executeAndReturnNewHead();	
		if (maybeNewHead != undefined) head = maybeNewHead;
		// printNodes(head);
	}

	const thousandth = getNthNode(1000);
	const twoThousandth = getNthNode(2000);
	const threeThousandth = getNthNode(3000);	

	return thousandth.value + twoThousandth.value + threeThousandth.value;

	function getNthNode(n: number): Node {
		let currNode: Node = zeroNode;
		for (let i = 0; i < n; i++) {
			if (currNode.next == undefined) throw Error('found undefined Node.next');
			currNode = currNode.next;
		}
		return currNode;
	}
}

async function p2022day20_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `1\n2\n-3\n3\n-2\n0\n4`,
			extraArgs: [],
			expected: `3`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day20_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day20_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day20_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day20_part2(input));
	const part2After = performance.now();

	logSolution(20, 2022, part1Solution, part2Solution);

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
