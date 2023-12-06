import assert from "node:assert";
import * as util from "../util";

function parseInput(input: string) {
  return input
    .split("\n")
    .map((line) => line.split(":")[1])
    .map((line) => line.split("|"))
    .map((nums) =>
      nums.map((part) =>
        part
          .trim()
          .split(" ")
          .filter((s) => s.length)
          .map(Number),
      ),
    );
}

function getMatchedPoint(win: number[], own: number[]): number {
  const winNums = new Set(win);
  const matched = own.map((n) => winNums.has(n));

  return matched.filter(Boolean).length;
}

function part1(input: string): number {
  const cards = parseInput(input);

  return cards
    .map(([win, own]) => getMatchedPoint(win, own))
    .map((matched) => (matched ? 2 ** (matched - 1) : 0))
    .reduce((a, b) => a + b, 0);
}

function part2(input: string): number {
  const cards = parseInput(input);
  const instances = cards.map(() => 1);

  cards
    .map(([win, own]) => getMatchedPoint(win, own))
    .forEach((matched, i) => {
      for (let n = matched; n > 0; n--) {
        instances[i + n] += instances[i];
      }
    });
  return instances.reduce((a, b) => a + b, 0);
}

const testInput = util.readInput("day04/testInput.txt");
assert.strictEqual(part1(testInput), 13);
assert.strictEqual(part2(testInput), 30);

const input = util.readInput("day04/input.txt");
console.log(part1(input));
console.log(part2(input));
