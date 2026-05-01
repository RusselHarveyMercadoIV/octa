import { IntentGraph } from "../graph.js";
import fs from "fs";
import { scanFile } from "../analyzer/astScan.js";
import { readIndex, readJSON, constraintPath } from "../store.js";
import type { Constraint, Decision } from "../types.js";
import path from "path";

export async function query(args: string[]) {
  const graph = new IntentGraph();
  await graph.build(); // Discover relationships from code
  const input = args[0];

  if (!input) {
    console.log("Usage: octa query <file|decision|constraint>");
    return;
  }

  // 1. Smart Lookup: Is it a file?
  if (fs.existsSync(path.resolve(process.cwd(), input))) {
    await queryFile(input, graph);
    return;
  }

  // 2. Smart Lookup: Is it a Decision or Constraint?
  const node = graph.getNode(input);
  if (node) {
    if (node.type === "decision") {
      queryDecision(input, graph);
    } else {
      queryConstraint(input, graph);
    }
    return;
  }

  console.error(`❌ Could not find file, decision, or constraint: ${input}`);
}

async function queryFile(filePath: string, graph: IntentGraph) {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  console.log(`\n🔍 Analyzing Intent for: ${filePath}`);

  try {
    const fileScan = scanFile(fullPath);
    const index = readIndex();
    const constraints = index.constraints
      .map((id: string) => readJSON(constraintPath(id)))
      .filter(Boolean) as Constraint[];

    const matched = constraints.filter((c) =>
      fileScan.imports.some((i) => i.includes(c.pattern)),
    );

    if (matched.length === 0) {
      console.log(
        "✅ No specific architectural constraints triggered by this file.",
      );
      return;
    }

    console.log("\nTriggered Constraints:");
    for (const c of matched) {
      console.log(`- ${c.id}: ${c.rule}`);

      const related = graph.getInferredLinks(c.id);
      if (related.length > 0) {
        console.log("  ↳ Inferred Intent (Related Decisions):");
        related
          .filter((n) => n.type === "decision")
          .forEach((d) => {
            const decision = d.data as Decision;
            console.log(`    - [Decision] ${d.id}: ${decision.title}`);
          });
      }
    }
  } catch (e) {
    console.error("❌ Failed to analyze file.");
  }
}

function queryConstraint(id: string, graph: IntentGraph) {
  const node = graph.getNode(id);
  if (!node || node.type !== "constraint") {
    console.error(`❌ Constraint not found: ${id}`);
    return;
  }

  const c = node.data as Constraint;
  console.log(`\n🩺 Constraint: ${id}`);
  console.log(`Rule: ${c.rule}`);
  console.log(`Pattern: \`${c.pattern}\``);

  if (node.impactedFiles.length > 0) {
    console.log("\nImpacted Files (Reality):");
    node.impactedFiles.forEach((f) => console.log(`- ${f}`));
  }

  const related = graph.getInferredLinks(id);
  if (related.length > 0) {
    console.log("\nInferred Relationships (Co-located Decisions):");
    related
      .filter((n) => n.type === "decision")
      .forEach((d) => {
        const decision = d.data as Decision;
        console.log(`- ${d.id}: ${decision.title}`);
      });
  }
}

function queryDecision(id: string, graph: IntentGraph) {
  const node = graph.getNode(id);
  if (!node || node.type !== "decision") {
    console.error(`❌ Decision not found: ${id}`);
    return;
  }

  const d = node.data as Decision;
  const latest = d.history[d.history.length - 1];

  console.log(`\n📚 Decision: ${id}`);
  console.log(`Title:  ${d.title}`);
  
  if (latest) {
    console.log(`Status: ${latest.status.toUpperCase()}`);
    console.log(`Choice: ${latest.choice}`);
    console.log(`Reason: ${latest.reason}`);
  }

  if (d.patterns && d.patterns.length > 0) {
    console.log(`Anchors: \`${d.patterns.join(", ")}\``);
  }

  if (node.impactedFiles.length > 0) {
    console.log("\nImpacted Files (Discovery):");
    node.impactedFiles.forEach((f) => console.log(`- ${f}`));
  }

  const related = graph.getInferredLinks(id);
  if (related.length > 0) {
    console.log("\nCo-located Rules (Constraints):");
    related
      .filter((n) => n.type === "constraint")
      .forEach((c) => {
        const constraint = c.data as Constraint;
        console.log(`- ${c.id}: ${constraint.rule}`);
      });
  }
}
