import assert from "assert";
import { flow, dual } from "effect/Function";
import * as util from "../util";

type Map = string[][];

interface Coord {
  x: number;
  y: number;
}

function parse(input: string) {
  return input.split("\n").map((line) => line.split(""));
}

function findGalaxies(map: Map) {
  const result: Coord[] = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "#") {
        result.push({ x, y });
      }
    }
  }
  return result;
}

const expandGalaxy = dual(2, (map: Map, size: number): Coord[] => {
  const col: number[] = [];
  const row: number[] = [];

  for (let x = 0; x < map[0].length; x++) {
    if (map.every((r) => r[x] === ".")) {
      col.push(x);
    }
  }

  for (let y = 0; y < map.length; y++) {
    if (map[y].every((x) => x === ".")) {
      row.push(y);
    }
  }

  const galaxies = findGalaxies(map).map((g) => ({
    x: g.x + col.filter((c) => c < g.x).length * (size - 1),
    y: g.y + row.filter((r) => r < g.y).length * (size - 1),
  }));

  return galaxies;
});

function getDistance(from: Coord, to: Coord): number {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

function searchShortestPath(galaxies: Coord[]): number[] {
  const result: number[] = [];

  for (let i = 0; i < galaxies.length; ++i) {
    for (let j = i + 1; j < galaxies.length; ++j) {
      result.push(getDistance(galaxies[i], galaxies[j]));
    }
  }
  return result;
}

const part1 = flow(parse, expandGalaxy(2), searchShortestPath, (paths) =>
  paths.reduce((a, b) => a + b),
);

const part2 = (n: number) =>
  flow(parse, expandGalaxy(n), searchShortestPath, (paths) =>
    paths.reduce((a, b) => a + b),
  );

const testInput = util.readInput("day11/testInput.txt");
assert.strictEqual(part1(testInput), 374);
assert.strictEqual(part2(10)(testInput), 1030);
assert.strictEqual(part2(100)(testInput), 8410);

const input = util.readInput("day11/input.txt");
console.log(part1(input));
console.log(part2(1e6)(input));
