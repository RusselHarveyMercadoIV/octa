import { scanRepo } from "../analyzer/scan.js";
import { readIndex, readJSON, constraintPath, decisionPath } from "../store.js";
import type { Constraint, Decision } from "../types.js";
import path from "path";

function loadConstraints(): Constraint[] {
  const index = readIndex();
  return index.constraints
    .map((id: string) => readJSON(constraintPath(id)))
    .filter(Boolean);
}

function loadProposedDecisions(): Decision[] {
  const index = readIndex();
  return index.decisions
    .map((id: string) => readJSON(decisionPath(id)))
    .filter((d: any) => {
      if (!d || !d.history) return false;
      const latest = d.history[d.history.length - 1];
      return latest?.status === "proposed";
    });
}

export async function doctor() {
  const isJson = process.argv.includes("--json");
  if (!isJson) console.log("👁 Scanning project architecture...\n");

  const constraints = loadConstraints();
  const proposed = loadProposedDecisions();
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
  const status = violations.length === 0 && proposed.length === 0 ? "HEALTHY" : "DRIFT DETECTED";
  const riskLevel = violations.length === 0 ? "LOW" : (hasHardViolations ? "HIGH" : "MEDIUM");

  if (isJson) {
    console.log(JSON.stringify({
      status,
      riskLevel,
      violations: violations.map(v => ({
        file: path.relative(process.cwd(), v.file),
        constraintId: v.constraint.id,
        rule: v.constraint.rule
      })),
      pendingGovernance: proposed.map(d => ({
        id: d.id,
        title: d.title
      }))
    }, null, 2));
    return;
  }

  console.log("----------------------------------------");
  console.log("👁 Octa Architecture Health Look");
  console.log("----------------------------------------\n");

  if (violations.length === 0 && proposed.length === 0) {
    console.log(`Status: ✅ ${status}`);
    console.log(`Risk Level: ${riskLevel}\n`);
    console.log("No architectural drift or pending governance detected. System is compliant.");
    return;
  }

  console.log(`Status: ⚠ ${status}`);
  console.log(`Risk Level: ${violations.length > 0 && hasHardViolations ? "🚨" : "🚸"} ${riskLevel}\n`);

  if (violations.length > 0) {
    console.log("Violations:");
    for (const v of violations) {
      const relativePath = path.relative(process.cwd(), v.file);
      console.log(`- ${relativePath}`);
      console.log(`  ✖ Violates: "${v.constraint.id}" (${v.constraint.rule})`);
      console.log(`  💡 Recommendation: ${v.constraint.recommendation || "Resolve this violation."}`);
      console.log("");
    }
  }

  if (proposed.length > 0) {
    console.log("⚖ Pending Governance (Proposed Decisions):");
    for (const d of proposed) {
      console.log(`- ${d.id}: "${d.title}"`);
      console.log(`  💡 Action: Use 'octa approve ${d.id}' to formalize this decision.`);
    }
    console.log("");
  }

  console.log("Next Steps:");
  console.log("Resolve violations and approve or reject pending proposals to maintain architectural health.");
}
