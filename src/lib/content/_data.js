import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const cache = new Map();

/** Read and cache a JSON data file from src/data. Returns [] if missing. */
export function readCollection(name) {
  if (cache.has(name)) return cache.get(name);
  const file = path.join(DATA_DIR, `${name}.json`);
  let data = [];
  if (existsSync(file)) {
    try {
      data = JSON.parse(readFileSync(file, "utf8"));
    } catch (e) {
      console.error(`Failed to parse ${file}:`, e.message);
      data = [];
    }
  }
  cache.set(name, data);
  return data;
}
