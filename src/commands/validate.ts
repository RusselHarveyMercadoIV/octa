import { scanRepo } from "../analyzer/scan.js";
import { readIndex, readJSON, constraintPath } from "../store.js";

function loadConstraints() {
  const index = readIndex();
  return index.constraints.map((id: string) => readJSON(constraintPath(id)));
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
