import assert from "assert";
import { flow } from "effect/Function";
import * as util from "../util";

type K = string;
type V = { L: K; R: K };
type Tree = Map<K, V>;

function gcd(a: number, b: number): number {
  if (a % b === 0) {
    return b;
  }
  return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function parse(input: string) {
  const [inst, nodes] = input.split("\n\n");
  const tree: Tree = new Map();

  nodes.split("\n").map((node) => {
    const [key, value] = node.split(/\s?=\s?/);
    const match = value.match(/[A-Z\d]+/g)!;
    tree.set(key, { L: match[0], R: match[1] });
  });

  return { inst, tree };
}

function walk({
  inst,
  tree,
  start,
  isEnd,
}: {
  inst: string;
  tree: Tree;
  start: K;
  isEnd: (node: K) => boolean;
}) {
  let node = start;
  let steps = 0;

  while (!isEnd(node)) {
    for (const d of inst.split("")) {
      const { L, R } = tree.get(node)!;
      if (d === "L") {
        node = L;
      } else {
        node = R;
      }
      steps++;

      if (isEnd(node)) {
        break;
      }
    }
  }
  return steps;
}

const part1 = flow(parse, (args) =>
  walk({ ...args, start: "AAA", isEnd: (node) => node === "ZZZ" }),
);
const part2 = flow(parse, ({ inst, tree }) =>
  [...tree.keys()]
    .filter((k) => k.endsWith("A"))
    .map((node) =>
      walk({ inst, tree, start: node, isEnd: (k) => k.endsWith("Z") }),
    )
    .reduce((a, b) => lcm(a, b)),
);

const testInput = util.readInput("day08/testInput.txt");
const testInput2 = util.readInput("day08/testInput2.txt");
assert.strictEqual(part1(testInput), 2);
assert.strictEqual(part1(testInput2), 6);

const testInput3 = util.readInput("day08/testInput3.txt");
assert.strictEqual(part2(testInput3), 6);

const input = util.readInput("day08/input.txt");
console.log(part1(input));
console.log(part2(input));
