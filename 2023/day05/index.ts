import assert from "node:assert";
import { flow, pipe, dual } from "effect/Function";
import { readInput } from "../util";

interface Range {
  start: number;
  end: number;
}

interface ConvertMap {
  dst: Range;
  src: Range;
}
function getRange(start: number, end: number): Range {
  return { start, end };
}

function getRangeByLen(start: number, len: number): Range {
  return { start, end: start + len };
}

function offset(r: Range, n: number): Range {
  return { start: r.start + n, end: r.end + n };
}

function isOverlap(a: Range, b: Range): boolean {
  return a.start < b.end && a.end > b.start;
}

function getOverlapRange(a: Range, b: Range): Range {
  return {
    start: Math.max(a.start, b.start),
    end: Math.min(a.end, b.end),
  };
}

function splitNumber(input: string): number[] {
  return input
    .trim()
    .split(" ")
    .map((n) => parseInt(n, 10));
}

function rangeOfSeed(seeds: number[]): Range[] {
  if (seeds.length % 2 !== 0) throw new Error("Invalid seed");

  const range: Range[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    range.push(getRangeByLen(seeds[i], seeds[i + 1]));
  }
  return range;
}

function parseConvertMap(p: string[]): ConvertMap[][] {
  return p.map((line) =>
    line
      .split("\n")
      .slice(1)
      .map(splitNumber)
      .map(([dst, src, len]) => ({
        dst: getRangeByLen(dst, len),
        src: getRangeByLen(src, len),
      })),
  );
}

function parse(input: string) {
  const [seed, ...convertMap] = input.split("\n\n");

  return {
    seeds: splitNumber(seed.split(":")[1]),
    convertMap: parseConvertMap(convertMap),
  };
}

function convert(seeds: number[], convertMap: ConvertMap[]) {
  return seeds.map((seed) => {
    for (const { dst, src } of convertMap) {
      if (seed >= src.start && seed < src.end) {
        return seed + (dst.start - src.start);
      }
    }
    return seed;
  });
}

function convertRange(seeds: Range[], convertMap: ConvertMap[]) {
  let splitted = seeds.slice();

  convertMap.forEach(({ src }) => {
    splitted = splitted.flatMap((seed) => {
      if (isOverlap(seed, src)) {
        const res: Range[] = [];

        if (seed.start < src.start) {
          res.push(getRange(seed.start, src.start));
        }
        if (seed.end > src.end) {
          res.push(getRange(src.end, seed.end));
        }
        res.push(getOverlapRange(seed, src));
        return res;
      }
      return seed;
    });
  });

  return splitted.map((seed) => {
    const m = convertMap.find((m) => isOverlap(seed, m.src));
    return m ? offset(seed, m.dst.start - m.src.start) : seed;
  });
}

const part1 = flow(
  parse,
  ({ seeds, convertMap }) => convertMap.reduce(convert, seeds),
  (locations) => Math.min(...locations),
);

const part2 = flow(
  parse,
  ({ seeds, convertMap }) => ({ seeds: rangeOfSeed(seeds), convertMap }),
  ({ seeds, convertMap }) => convertMap.reduce(convertRange, seeds),
  (range) => range.map(({ start }) => start),
  (locations) => Math.min(...locations),
);

const strictEqual = dual(3, assert.strictEqual);
const testInput = readInput("day05/testInput.txt");
pipe(testInput, part1, strictEqual(35));
pipe(testInput, part2, strictEqual(46));

const input = readInput("day05/input.txt");
pipe(input, part1, console.log);
pipe(input, part2, console.log);
