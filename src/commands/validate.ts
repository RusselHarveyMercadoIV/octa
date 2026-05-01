import { scanRepo } from "../analyzer/scan.js";
import fs from "fs";
import path from "path";

const intentPath = path.join(process.cwd(), "intent");

function loadConstraints() {
  const dir = path.join(intentPath, "constraints");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")));
}

export async function validate() {
  const constraints = loadConstraints();
  const files = scanRepo();

  const violations: any[] = [];

  for (const file of files) {
    for (const constraint of constraints) {
      // semantic match: check imports, not raw text
      const matched = file.imports.some((i) => i.includes(constraint.pattern));

      if (matched) {
        violations.push({
          file: file.file,
          constraint: constraint.id,
          rule: constraint.rule,
          match: constraint.pattern,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log("✔ No intent violations detected");
    return;
  }

  console.log("⚠ Architecture drift detected:\n");

  for (const v of violations) {
    console.log(`- ${v.file}`);
    console.log(`  violates: ${v.rule}`);
    console.log(`  matched: ${v.match}\n`);
  }
}
