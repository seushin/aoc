import assert from "assert";
import { flow } from "effect/Function";
import * as util from "../util";

function parse(input: string) {
  return input
    .split("\n")
    .map((line) => line.split(/\s+/).map((n) => parseInt(n, 10)));
}

function predictNextValue(history: number[]) {
  if (history.every((n) => n === 0)) {
    return 0;
  }

  const diff = history.slice(1).map((n, i) => n - history[i]);

  return history[history.length - 1] + predictNextValue(diff);
}

function predictPrevValue(history: number[]) {
  if (history.every((n) => n === 0)) {
    return 0;
  }

  const diff = history.slice(1).map((n, i) => n - history[i]);

  return history[0] - predictPrevValue(diff);
}

const part1 = flow(
  parse,
  (history) => history.map(predictNextValue),
  (values) => values.reduce((a, b) => a + b),
);

const part2 = flow(
  parse,
  (history) => history.map(predictPrevValue),
  (values) => values.reduce((a, b) => a + b),
);

const testInput = util.readInput("day09/testInput.txt");
assert.strictEqual(part1(testInput), 114);
assert.strictEqual(part2(testInput), 2);

const input = util.readInput("day09/input.txt");
console.log(part1(input));
console.log(part2(input));
