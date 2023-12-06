import * as util from "../util";

const digits = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function firstDigit(str: string): number {
  return parseInt(str.split("").find(util.isDigit) ?? "");
}

function lastDigit(str: string): number {
  return parseInt(str.split("").reverse().find(util.isDigit) ?? "");
}

function parseDigit(line: string): number[] {
  const result: number[] = [];

  for (let i = 0; i < line.length; i++) {
    if (util.isDigit(line[i])) {
      result.push(parseInt(line[i]));
    } else {
      digits.forEach((digit, n) => {
        if (line.startsWith(digit, i)) {
          result.push(n);
        }
      });
    }
  }

  return result;
}

function part1(input: string): number {
  return input
    .split("\n")
    .map((line) => firstDigit(line) * 10 + lastDigit(line))
    .reduce((a, b) => a + b, 0);
}

function part2(input: string): number {
  return input
    .split("\n")
    .map((line) => parseDigit(line))
    .map((digits) => digits[0] * 10 + digits[digits.length - 1])
    .reduce((a, b) => a + b, 0);
}

const testInput1 = util.readInput("day01/test1.txt");
const testInput2 = util.readInput("day01/test2.txt");
console.log(part1(testInput1), part2(testInput2));

const input = util.readInput("day01/input.txt");
console.log(part1(input), part2(input));
