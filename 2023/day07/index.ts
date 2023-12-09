import assert from "assert";
import { flow } from "effect/Function";
import * as util from "../util";

enum HandType {
  HighCard,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

interface Hand {
  type: HandType;
  cards: number[];
}

function getHandType(cards: number[], useJoker = false): HandType {
  const count = Array.from({ length: 13 }, () => 0);
  for (const c of cards) {
    count[c]++;
  }

  let j = 0;
  if (useJoker) {
    j = count[0];
    count[0] = 0;
  }

  count.sort((a, b) => b - a);
  switch (count[0] + j) {
    case 5:
      return HandType.FiveOfAKind;
    case 4:
      return HandType.FourOfAKind;
    case 3:
      if (count[1] === 2) return HandType.FullHouse;
      return HandType.ThreeOfAKind;
    case 2:
      if (count[1] === 2) return HandType.TwoPairs;
      return HandType.OnePair;
  }
  return HandType.HighCard;
}

function getHand(card: string, order: string): Hand {
  const cards = card.split("").map((c) => order.indexOf(c));
  const type = getHandType(cards, order.indexOf("J") === 0);
  return { type, cards };
}

function compare(a: Hand, b: Hand): number {
  if (a.type !== b.type) {
    return a.type - b.type;
  }

  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] !== b.cards[i]) {
      return a.cards[i] - b.cards[i];
    }
  }
  return 0;
}

function parse(input: string) {
  return input
    .split("\n")
    .map((line) => line.split(/\s+/))
    .map(([cards, bid]) => ({
      cards,
      bid: parseInt(bid),
    }));
}

const part1 = flow(
  parse,
  (players) =>
    players.map((p) => ({ ...p, hand: getHand(p.cards, "23456789TJQKA") })),
  (players) => players.sort((a, b) => compare(a.hand, b.hand)),
  (players) => players.map((p, i) => p.bid * (i + 1)),
  (winnings) => winnings.reduce((a, b) => a + b, 0),
);

const part2 = flow(
  parse,
  (players) =>
    players.map((p) => ({ ...p, hand: getHand(p.cards, "J23456789TQKA") })),
  (players) => players.sort((a, b) => compare(a.hand, b.hand)),
  (players) => players.map((p, i) => p.bid * (i + 1)),
  (winnings) => winnings.reduce((a, b) => a + b, 0),
);

const testInput = util.readInput("day07/testInput.txt");
assert.strictEqual(part1(testInput), 6440);
assert.strictEqual(part2(testInput), 5905);

const input = util.readInput("day07/input.txt");
console.log(part1(input));
console.log(part2(input));
