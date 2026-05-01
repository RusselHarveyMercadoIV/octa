import fs from "fs";
import path from "path";
import { scanFile } from "./astScan.js";
import { loadConfig } from "../config.js";

const config = loadConfig();

export function walk(dir: string, files: string[] = []) {
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (config.ignore.includes(entry) || entry.startsWith(".")) continue;

      const full = path.join(dir, entry);
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        walk(full, files);
      } else if (full.endsWith(".ts") || full.endsWith(".js")) {
        files.push(full);
      }
    }
  } catch (e) {
    // Silent fail for inaccessible directories (production hardening)
  }

  return files;
}

export function scanRepo() {
  const files = walk(process.cwd());

  return files.map(scanFile);
}
