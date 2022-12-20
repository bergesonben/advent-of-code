import _, { map, min } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 19;

// solution path: /home/benjamin/Documents/personal/advent-of-code/years/2022/19/index.ts
// data path    : /home/benjamin/Documents/personal/advent-of-code/years/2022/19/data.txt
// problem url  : https://adventofcode.com/2022/day/19

enum Resource {
	ore,
	clay,
	obsidian,
	geode
}
type Cost = {
	count: number,
	type: Resource
}
type Robot = {
	costs: Cost[],
	outputType: Resource
}
type Blueprint = {
	id: number,
	oreRobot: Robot,
	clayRobot: Robot,
	obsidianRobot: Robot,
	geodeRobot: Robot
}

type Inventory = Map<Resource, number>
type Fleet = Map<Robot, number>

type Snapshot = {
	fleet: Fleet
	inventory: Inventory
}

function parseBlueprint(line: string): Blueprint {
	const tokens = line.split(' ');
	const id = Number(_.trimEnd(tokens[1], ':'));
	const oreRobotCost: Cost = {count: Number(tokens[6]), type: Resource.ore};
	const oreRobot: Robot = {costs: [oreRobotCost], outputType: Resource.ore};
	const clayRobotCost: Cost = {count: Number(tokens[12]), type: Resource.ore};
	const clayRobot: Robot = {costs: [clayRobotCost], outputType: Resource.clay};
	const obsidianRobotCosts: Cost[] = [{count: Number(tokens[18]), type: Resource.ore},{count: Number(tokens[21]), type: Resource.clay}];
	const obsidianRobot: Robot = {costs: obsidianRobotCosts, outputType: Resource.obsidian};
	const geodeRobotCosts: Cost[] = [{count: Number(tokens[27]), type: Resource.ore},{count: Number(tokens[30]), type: Resource.obsidian}];
	const geodeRobot: Robot = {costs: geodeRobotCosts, outputType: Resource.geode};
	const blueprint: Blueprint = {
		id: id,
		oreRobot: oreRobot,
		clayRobot: clayRobot,
		obsidianRobot: obsidianRobot,
		geodeRobot: geodeRobot,
	}
	return blueprint;
}

function canBuildRobot(inventory: Inventory, robot: Robot): boolean {
	for (let cost of robot.costs) {
		if ((inventory.get(cost.type) ?? 0) < cost.count) return false;
	}
	return true;
}

function deepCopySnapshot(snapshot: Snapshot): Snapshot {
	const newSnapshot = {} as Snapshot;
	const inventoryCopy = new Map(snapshot.inventory);
	const fleetCopy = new Map(snapshot.fleet);
	newSnapshot.fleet = fleetCopy;
	newSnapshot.inventory = inventoryCopy;
	return newSnapshot;
}

function minutePassesBy(snapshot: Snapshot): Snapshot {
	const newSnapshot = deepCopySnapshot(snapshot);
	for (let robot of newSnapshot.fleet) {
		const curr = newSnapshot.inventory.get(robot[0].outputType) ?? 0;
		const newOutput = curr + robot[1];
		newSnapshot.inventory.set(robot[0].outputType, newOutput);
	}
	return newSnapshot;
}

function buildRobot(snapshot: Snapshot, robot: Robot): void {
	if (!canBuildRobot(snapshot.inventory, robot)) {
		throw Error('cant build robot');
	}
	snapshot.fleet.set(robot, (snapshot.fleet.get(robot) ?? 0) + 1 );
	for (let cost of robot.costs) {
		snapshot.inventory.set(cost.type, snapshot.inventory.get(cost.type)! - cost.count);
	}
}

function getGeodeRobot(snapshot: Snapshot): Robot {
	const geodeRobot = [...snapshot.fleet.keys()].find(r => r.outputType == Resource.geode);
	if (geodeRobot == undefined) throw Error(`Could'nt find geode robot`);
	return geodeRobot;
}

function choices(snapshot: Snapshot): Snapshot[] {
	const newPaths: Snapshot[] = [];
	const geodeRobot = getGeodeRobot(snapshot);
	if (canBuildRobot(snapshot.inventory, geodeRobot)) {
		const newSnapshot = minutePassesBy(snapshot);
		buildRobot(newSnapshot, geodeRobot);
		return [newSnapshot];
	}
	
	const canBuildAllRobots = [...snapshot.fleet.entries()].every(r => canBuildRobot(snapshot.inventory, r[0]));
	if (!canBuildAllRobots) newPaths.push(minutePassesBy(snapshot));	
	
	for (let robot of snapshot.fleet) {		
		if (canBuildRobot(snapshot.inventory, robot[0])) {			
			let newSnapshot = minutePassesBy(snapshot);
			buildRobot(newSnapshot, robot[0]);			
			newPaths.push(newSnapshot);
		}
	}
	return newPaths;
}

function maxGeodeOutput(blueprint: Blueprint, time: number): number {
	const inventory: Inventory = new Map();
	const fleet: Fleet = new Map();	
	for (let i = 0; i < 4; i++) {
		inventory.set(i as Resource, 0)
	}
	fleet.set(blueprint.oreRobot, 1);
	fleet.set(blueprint.clayRobot, 0);
	fleet.set(blueprint.obsidianRobot, 0);
	fleet.set(blueprint.geodeRobot, 0);
	const snapshot = {
		inventory: inventory,
		fleet: fleet
	}

	let snapshots: Snapshot[] = [snapshot];
	const ts = Date.now();
	const x = 14;
	for (let i = 0; i < x; i++) {
		let newSnapshots: Snapshot[] = [];
		for (let snapshot of snapshots) {
			newSnapshots = newSnapshots.concat(choices(snapshot));
		}
		snapshots = newSnapshots;
	}
	console.log(`${x} minutes took ${(Date.now() - ts) / 1000} seconds`);

	return 0;
}

async function p2022day19_part1(input: string, ...params: any[]) {
	const blueprints: Blueprint[] = [];
	const lines = input.split("\n");
	for (const line of lines) {
		blueprints.push(parseBlueprint(line))
	}
	const outputs = blueprints.map(x => maxGeodeOutput(x, 24) * x.id);
	return outputs.reduce((p,c) => p + c);
}

async function p2022day19_part2(input: string, ...params: any[]) {
	return "Not implemented";
}

async function run() {
	const part1tests: TestCase[] = [
		{
			input: `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.\nBlueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`,
			extraArgs: [],
			expected: `33`
		}
	];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day19_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day19_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	// const input = await util.getInput(DAY, YEAR);

	// const part1Before = performance.now();
	// const part1Solution = String(await p2022day19_part1(input));
	// const part1After = performance.now();

	// const part2Before = performance.now()
	// const part2Solution = String(await p2022day19_part2(input));
	// const part2After = performance.now();

	// logSolution(19, 2022, part1Solution, part2Solution);

	// log(chalk.gray("--- Performance ---"));
	// log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	// log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	// log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
