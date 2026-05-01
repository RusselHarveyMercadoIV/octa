import { IntentGraph, type GraphNode } from "../graph.js";
import { scanFile } from "../analyzer/astScan.js";
import { readIndex, readJSON, constraintPath } from "../store.js";
import type { Constraint, Decision } from "../types.js";
import path from "path";

export async function query(args: string[]) {
  const graph = new IntentGraph();

  if (args.includes("--file")) {
    const filePath = args[args.indexOf("--file") + 1];
    if (filePath) await queryFile(filePath, graph);
  } else if (args.includes("--constraint")) {
    const id = args[args.indexOf("--constraint") + 1];
    if (id) queryConstraint(id, graph);
  } else if (args.includes("--decision")) {
    const id = args[args.indexOf("--decision") + 1];
    if (id) queryDecision(id, graph);
  } else {
    console.log("Usage:");
    console.log("  octa query --file <path>");
    console.log("  octa query --constraint <id>");
    console.log("  octa query --decision <id>");
  }
}

async function queryFile(filePath: string, graph: IntentGraph) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  console.log(`\n🔍 Analyzing Intent for: ${filePath}`);
  
  try {
    const fileScan = scanFile(fullPath);
    const index = readIndex();
    const constraints = index.constraints
      .map((id: string) => readJSON(constraintPath(id)))
      .filter(Boolean) as Constraint[];

    const matched = constraints.filter(c => 
      fileScan.imports.some(i => i.includes(c.pattern))
    );

    if (matched.length === 0) {
      console.log("✅ No specific architectural constraints triggered by this file.");
      return;
    }

    console.log("\nTriggered Constraints:");
    for (const c of matched) {
      console.log(`- ${c.id}: ${c.rule}`);
      
      const upstream = graph.getUpstream(c.id);
      if (upstream.length > 0) {
        console.log("  ↳ Reasoning (Upstream Decisions):");
        upstream.filter(n => n.type === "decision").forEach(d => {
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
  console.log(`Pattern: ${c.pattern}`);

  const upstream = graph.getUpstream(id);
  if (upstream.length > 0) {
    console.log("\nOriginating Decisions (Why):");
    upstream.filter(n => n.type === "decision").forEach(d => {
      const decision = d.data as Decision;
      console.log(`- ${d.id}: ${decision.title}`);
    });
  } else {
    console.log("\n(No upstream decisions linked to this constraint)");
  }
}

function queryDecision(id: string, graph: IntentGraph) {
  const node = graph.getNode(id);
  if (!node || node.type !== "decision") {
    console.error(`❌ Decision not found: ${id}`);
    return;
  }

  const d = node.data as Decision;
  console.log(`\n📚 Decision: ${id}`);
  console.log(`Title: ${d.title}`);

  const downstream = graph.getDownstream(id);
  if (downstream.length > 0) {
    console.log("\nEnforced Constraints (Impact):");
    downstream.filter(n => n.type === "constraint").forEach(c => {
      const constraint = c.data as Constraint;
      console.log(`- ${c.id}: ${constraint.rule}`);
    });
  } else {
    console.log("\n(No downstream constraints linked to this decision)");
  }
}
