import assert from "node:assert";
import * as util from "../util";

// 0 1 2
// 3 @ 4
// 5 6 7
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
const dx = [-1, 0, 1, -1, 1, -1, 0, 1];

function isSymbol(char: string): boolean {
  return !char.startsWith(".") && !util.isDigit(char);
}

function isAdjacentSymbol(x: number, y: number, s: string[]): boolean {
  if (x >= s[y].length || !util.isDigit(s[y][x])) {
    return false;
  }

  for (let i = 0; i < dy.length; i++) {
    const ny = y + dy[i];
    const nx = x + dx[i];

    if (ny < 0 || ny >= s.length || nx < 0 || nx >= s[ny].length) {
      continue;
    }

    if (isSymbol(s[ny][nx])) {
      return true;
    }
  }
  return isAdjacentSymbol(x + 1, y, s);
}

function part1(input: string) {
  const s = input.split("\n");
  let sum = 0;

  for (let y = 0; y < s.length; y++) {
    for (let x = 0; x < s[y].length; x++) {
      if (util.isDigit(s[y][x]) && (x === 0 || !util.isDigit(s[y][x - 1]))) {
        if (isAdjacentSymbol(x, y, s)) {
          sum += parseInt(s[y].substring(x));
        }
      }
    }
  }
  return sum;
}

function startOfNumber(x: number, y: number, s: string[]): number {
  if (x === 0 || !util.isDigit(s[y][x - 1])) {
    return x;
  }
  return startOfNumber(x - 1, y, s);
}

function adjacentNumbers(x: number, y: number, s: string[]): number[] {
  const adj: { x: number; y: number }[] = [];

  for (let i = 0; i < dy.length; i++) {
    const ny = y + dy[i];
    const nx = x + dx[i];

    if (ny < 0 || ny >= s.length || nx < 0 || nx >= s[ny].length) {
      continue;
    }

    if (util.isDigit(s[ny][nx])) {
      const sx = startOfNumber(nx, ny, s);

      if (!adj.find((a) => a.x === sx && a.y === ny)) {
        adj.push({ x: sx, y: ny });
      }
    }
  }
  return adj.map((a) => parseInt(s[a.y].substring(a.x)));
}

function part2(input: string) {
  const s = input.split("\n");
  let sum = 0;

  for (let y = 0; y < s.length; y++) {
    for (let x = 0; x < s[y].length; x++) {
      if (s[y][x] === "*") {
        const numbers = adjacentNumbers(x, y, s);
        if (numbers.length === 2) {
          sum += numbers[0] * numbers[1];
        }
      }
    }
  }
  return sum;
}

const testInput = util.readInput("day03/testInput.txt");
assert.strictEqual(part1(testInput), 4361);
assert.strictEqual(part2(testInput), 467835);

const input = util.readInput("day03/input.txt");
console.log(part1(input));
console.log(part2(input));
