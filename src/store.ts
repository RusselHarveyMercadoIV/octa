import fs from "fs";
import path from "path";

const BASE = path.join(process.cwd(), "intent");

export function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function writeJSON(file: string, data: any) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function readJSON(file: string) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function decisionPath(id: string) {
  return path.join(BASE, "decisions", `${id}.json`);
}
