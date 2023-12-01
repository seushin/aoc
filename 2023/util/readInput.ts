import { readFileSync } from "node:fs";

export function readInput(filename: string) {
  return readFileSync(filename, { encoding: "utf8" }).trim();
}
