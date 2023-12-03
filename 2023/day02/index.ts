import assert from "node:assert";
import * as util from "../util";

type CubeSet = {
  red: number;
  green: number;
  blue: number;
};

function part1(input: string, bag: CubeSet): number {
  return input
    .split("\n")
    .map((line) => line.split(":")[1])
    .map((game) => game.split(";"))
    .map((game) =>
      game
        .map((group) =>
          group.split(",").map((cube) => {
            const [count, color] = cube.trim().split(" ");
            return bag[color] >= parseInt(count);
          }),
        )
        .map((group) => group.every((possible) => possible))
        .every((possible) => possible),
    )
    .map((possible, gameID) => (possible ? gameID + 1 : 0))
    .reduce((a, b) => a + b, 0);
}

function part2(input: string): number {
  return input
    .split("\n")
    .map((line) => line.split(":")[1])
    .map((game) => game.split(";"))
    .map((game) => {
      const minSet: CubeSet = { red: 0, green: 0, blue: 0 };
      game.forEach((group) => {
        group.split(",").map((cube) => {
          const [count, color] = cube.trim().split(" ");
          minSet[color] = Math.max(minSet[color], parseInt(count));
        });
      });
      return minSet.red * minSet.green * minSet.blue;
    })
    .reduce((a, b) => a + b, 0);
}

const testInput = util.readInput("day02/testInput.txt");
const testBag = { red: 12, green: 13, blue: 14 };
assert.strictEqual(part1(testInput, testBag), 8);
assert.strictEqual(part2(testInput), 2286);

const input = util.readInput("day02/input.txt");
const bag = { red: 12, green: 13, blue: 14 };
console.log(part1(input, bag));
console.log(part2(input));
