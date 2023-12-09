import assert from "assert";
import { flow } from "effect";
import * as util from "../util";

interface Race {
  time: number;
  bestDistance: number;
}

function splitNumber(input: string): number[] {
  return input
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n, 10));
}

function parse(input: string) {
  return input
    .split("\n")
    .map((line) => line.split(":")[1])
    .map(splitNumber);
}

function lowerBound(
  start: number,
  end: number,
  predicate: (n: number) => boolean,
) {
  while (start < end) {
    const mid = Math.floor((start + end) / 2);

    if (predicate(mid)) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }
  return start;
}

function upperBound(
  start: number,
  end: number,
  predicate: (n: number) => boolean,
) {
  while (start < end) {
    const mid = Math.floor((start + end) / 2);

    if (predicate(mid)) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  return start;
}

function getBestRecord({ time, bestDistance }: Race) {
  const p = (t: number) => t * (time - t) > bestDistance;
  const lowest = lowerBound(0, time, p);
  const highest = upperBound(0, time, p);

  return highest - lowest;
}

const part1 = flow(
  parse,
  ([times, distances]) =>
    times.map((time, i) => ({ time, bestDistance: distances[i] })),
  (races) => races.map(getBestRecord),
  (records) => records.reduce((a, b) => a * b, 1),
);

const part2 = flow(
  parse,
  ([times, distances]) => ({
    time: parseInt(times.join(""), 10),
    bestDistance: parseInt(distances.join(""), 10),
  }),
  getBestRecord,
);

const testInput = util.readInput("day06/testInput.txt");
assert.strictEqual(part1(testInput), 288);
assert.strictEqual(part2(testInput), 71503);

const input = util.readInput("day06/input.txt");
console.log(part1(input));
console.log(part2(input));
