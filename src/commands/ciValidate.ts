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

export async function ciValidate() {
  const constraints = loadConstraints();
  const files = scanRepo();

  let failed = false;

  for (const file of files) {
    for (const constraint of constraints) {
      const matched = file.imports.some((i) => i.includes(constraint.pattern));

      if (matched) {
        console.error(`❌ Octa CI failed`);
        console.error(`File: ${file.file}`);
        console.error(`Violation: ${constraint.rule}`);
        console.error(`Matched: ${constraint.pattern}`);

        failed = true;
      }
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log("✔ Octa CI passed");
}
