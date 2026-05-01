import { scanRepo } from "../analyzer/scan.js";
import { matchConstraint } from "../analyzer/matchRules.js";
import fs from "fs";
import path from "path";

const intentPath = path.join(process.cwd(), "intent");

function loadConstraints() {
  const dir = path.join(intentPath, "constraints");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).map((file) => {
    return JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
  });
}

export async function validate() {
  const constraints = loadConstraints();
  const files = scanRepo();

  const violations: any[] = [];

  for (const file of files) {
    for (const constraint of constraints) {
      if (matchConstraint(file.code, constraint.pattern)) {
        violations.push({
          file: file.file,
          constraint: constraint.id,
          rule: constraint.rule,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log("✔ No intent violations detected");
    return;
  }

  console.log("⚠ Violations detected:\n");

  for (const v of violations) {
    console.log(`- ${v.file}`);
    console.log(`  violates: ${v.rule}\n`);
  }
}
