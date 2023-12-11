import assert from "assert";
import { flow } from "effect/Function";
import * as util from "../util";

type Map = string[][];

interface Coord {
  x: number;
  y: number;
}

function equal(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

function parse(input: string) {
  return input.split("\n").map((line) => line.split(""));
}

function find(map: Map, char: string): Coord {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(char);
    if (x !== -1) {
      return { x, y };
    }
  }
  return { x: -1, y: -1 };
}
function findAll(map: Map, char: string): Coord[] {
  const res: Coord[] = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (char.includes(map[y][x])) {
        res.push({ x, y });
      }
    }
  }
  return res;
}

function includes(map: Map, pos: Coord, char: string): boolean {
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.y >= map.length ||
    pos.x >= map[pos.y].length
  ) {
    return false;
  }
  return char.includes(map[pos.y][pos.x]);
}

function findConnected(map: Map, pos: Coord): Coord[] {
  enum D {
    left,
    right,
    up,
    down,
  }
  const dir: { [key in D]: Coord } = {
    [D.left]: { x: pos.x - 1, y: pos.y },
    [D.right]: { x: pos.x + 1, y: pos.y },
    [D.up]: { x: pos.x, y: pos.y - 1 },
    [D.down]: { x: pos.x, y: pos.y + 1 },
  };
  const expected: { [key in D]: string } = {
    [D.left]: "-FL",
    [D.right]: "-J7",
    [D.up]: "|F7",
    [D.down]: "|JL",
  };

  let res: D[] = [];
  switch (map[pos.y][pos.x]) {
    case "|":
      res = [D.up, D.down];
      break;
    case "-":
      res = [D.left, D.right];
      break;
    case "L":
      res = [D.up, D.right];
      break;
    case "J":
      res = [D.up, D.left];
      break;
    case "7":
      res = [D.down, D.left];
      break;
    case "F":
      res = [D.down, D.right];
      break;
    case "S":
      res = [D.up, D.down, D.left, D.right];
  }
  return res
    .filter((d) => includes(map, dir[d], expected[d]))
    .map((d) => dir[d]);
}

function FarthestStep(map: Map): number {
  let positions: Coord[] = [];
  const visited = [...Array(map.length)].map(() =>
    Array(map[0].length).map(() => false),
  );
  let steps = 0;

  const start = find(map, "S");
  positions.push(start);
  visited[start.y][start.x] = true;

  while (positions.length > 0) {
    positions = positions.flatMap((pos) =>
      findConnected(map, pos).filter((np) => !visited[np.y][np.x]),
    );
    positions.forEach((p) => {
      visited[p.y][p.x] = true;
    });
    steps++;

    if (
      positions.find((pos, i) =>
        positions.slice(i + 1).some((p) => equal(p, pos)),
      )
    ) {
      break;
    }
  }

  return steps;
}

function getLeftSide(pos: Coord, diff: Coord): Coord {
  if (diff.y < 0) {
    return { x: pos.x - 1, y: pos.y };
  } else if (diff.y > 0) {
    return { x: pos.x + 1, y: pos.y };
  } else if (diff.x < 0) {
    return { x: pos.x, y: pos.y + 1 };
  } else if (diff.x > 0) {
    return { x: pos.x, y: pos.y - 1 };
  }
  return pos;
}

function surroundWith(map: Map, char: string): Map {
  let res = map.map((line) => [char, ...line, char]);
  res = [
    [...Array(res[0].length)].map(() => char),
    ...res,
    [...Array(res[0].length)].map(() => char),
  ];
  return res;
}

function markAdjacent(
  map: Map,
  start: Coord,
  aSide: string,
  bSide: string,
) {
  const directions: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let q = [start];

  while (q.length > 0) {
    q.forEach((p) => {
      map[p.y][p.x] = aSide;
    });
    q = q
      .flatMap((p) =>
        directions
          .map((d) => ({ x: p.x + d[0], y: p.y + d[1] }))
          .filter((p) => includes(map, p, bSide)),
      )
      .filter((p, i, qq) => qq.findIndex((p2) => equal(p, p2)) === i);
  }
}

function markSide(nmap: Map, aSide: string, bSide: string) {
  const start = find(nmap, "S");
  let prev: Coord = start;
  let next: Coord;

  do {
    next = findConnected(nmap, prev).find((p) => !equal(p, prev)) ?? start;

    const diff = { x: next.x - prev.x, y: next.y - prev.y };
    [prev, next]
      .map((p) => getLeftSide(p, diff))
      .filter((p) => includes(nmap, p, bSide))
      .forEach((p) => {
        nmap[p.y][p.x] = aSide;
      });

    nmap[prev.y][prev.x] = "X";
    prev = next;
  } while (!equal(next, start));
  findAll(nmap, aSide).map((p) => markAdjacent(nmap, p, aSide, bSide));
}

function enclosedTiles(map: Map): number {
  let positions: Coord[] = [];
  const visited = [...Array(map.length)].map(() =>
    Array(map[0].length).map(() => false),
  );

  const start = find(map, "S");
  positions.push(start);
  visited[start.y][start.x] = true;

  while (positions.length > 0) {
    positions = positions.flatMap((pos) =>
      findConnected(map, pos).filter((np) => !visited[np.y][np.x]),
    );
    positions.forEach((p) => {
      visited[p.y][p.x] = true;
    });

    if (
      positions.find((pos, i) =>
        positions.slice(i + 1).some((p) => equal(p, pos)),
      )
    ) {
      break;
    }
  }

  const aSide = "I";
  const bSide = "O";
  let nmap = map.map((line, y) =>
    line.map((c, x) => (visited[y][x] ? c : bSide)),
  );
  nmap = surroundWith(nmap, bSide);
  markSide(nmap, aSide, bSide);

  let inner = aSide;
  for (let y = 0; y < nmap.length; y++) {
    for (let x = 0; x < nmap[y].length; x++) {
      if (
        (y === 0 || y === nmap.length - 1) &&
        (x === 0 || x === nmap[y].length - 1)
      ) {
        if (nmap[y][x] === aSide) {
          inner = bSide;
          break;
        }
      }
    }
  }

  return nmap
    .map((line) => line.filter((c) => c === inner))
    .map((line) => line.length)
    .reduce((a, b) => a + b);
}

const part1 = flow(parse, FarthestStep);
const part2 = flow(parse, enclosedTiles);

const testInput = util.readInput("day10/testInput.txt");
const testInput2 = util.readInput("day10/testInput2.txt");
assert.strictEqual(part1(testInput), 4);
assert.strictEqual(part1(testInput2), 8);

const testInput3 = util.readInput("day10/testInput3.txt");
const testInput4 = util.readInput("day10/testInput4.txt");
const testInput5 = util.readInput("day10/testInput5.txt");
assert.strictEqual(part2(testInput3), 4);
assert.strictEqual(part2(testInput4), 8);
assert.strictEqual(part2(testInput5), 10);

const input = util.readInput("day10/input.txt");
console.log(part1(input));
console.log(part2(input));
