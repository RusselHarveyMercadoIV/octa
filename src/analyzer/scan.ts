import fs from "fs";
import path from "path";
import { scanFile } from "./astScan.js";

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);

    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith(".ts") || full.endsWith(".js")) {
      files.push(full);
    }
  }

  return files;
}

export function scanRepo() {
  const files = walk(process.cwd());

  return files.map(scanFile);
}
