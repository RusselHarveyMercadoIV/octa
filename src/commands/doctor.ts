import { scanRepo } from "../analyzer/scan.js";
import { readIndex, readJSON, constraintPath } from "../store.js";
import type { Constraint } from "../types.js";
import path from "path";

function loadConstraints(): Constraint[] {
  const index = readIndex();
  return index.constraints
    .map((id: string) => readJSON(constraintPath(id)))
    .filter(Boolean);
}

export async function doctor() {
  const isJson = process.argv.includes("--json");
  if (!isJson) console.log("🩺 Running Octa Architecture Doctor...\n");

  const constraints = loadConstraints();
  const files = scanRepo();

  const violations: { file: string; constraint: Constraint }[] = [];

  for (const file of files) {
    for (const constraint of constraints) {
      const matched = file.imports.some((i) => i.includes(constraint.pattern));
      if (matched) {
        violations.push({ file: file.file, constraint });
      }
    }
  }

  const hasHardViolations = violations.some((v) => v.constraint.severity === "hard");
  const status = violations.length === 0 ? "HEALTHY" : "DRIFT DETECTED";
  const riskLevel = violations.length === 0 ? "LOW" : (hasHardViolations ? "HIGH" : "MEDIUM");

  if (isJson) {
    console.log(JSON.stringify({
      status,
      riskLevel,
      violations: violations.map(v => ({
        file: path.relative(process.cwd(), v.file),
        constraintId: v.constraint.id,
        rule: v.constraint.rule
      }))
    }, null, 2));
    return;
  }

  console.log("----------------------------------------");
  console.log("🩺 Octa Architecture Health Report");
  console.log("----------------------------------------\n");

  if (violations.length === 0) {
    console.log(`Status: ✅ ${status}`);
    console.log(`Risk Level: ${riskLevel}\n`);
    console.log("No architectural drift detected. System is compliant.");
    return;
  }

  console.log(`Status: ⚠ ${status}`);
  console.log(`Risk Level: ${violations.length > 0 && hasHardViolations ? "🚨" : "🚸"} ${riskLevel}\n`);

  console.log("Violations:");

  for (const v of violations) {
    const relativePath = path.relative(process.cwd(), v.file);
    console.log(`- ${relativePath}`);
    console.log(`  ✖ Violates: "${v.constraint.id}" (${v.constraint.rule})`);
    
    if (v.constraint.recommendation) {
      console.log(`  💡 Recommendation: ${v.constraint.recommendation}`);
    } else {
      console.log(`  💡 Recommendation: Resolve this violation or update architectural constraints.`);
    }
    console.log("");
  }

  console.log("Next Steps:");
  console.log("Resolve these violations or update your architectural constraints if the system design has officially changed.");
}
