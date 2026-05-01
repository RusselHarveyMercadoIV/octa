import { analyzeProject } from "./analyzeProject.js";
import { inferDecisions } from "./inferDecisions.js";
import { inferConstraints } from "./inferConstraints.js";
import { generateIntent } from "./generateIntent.js";
import fs from "fs";
import path from "path";
import { sync } from "../sync.js";

export async function init() {
  console.log("🔍 Analyzing project...");

  const analysis = analyzeProject();

  const decisions = inferDecisions(analysis);
  const constraints = inferConstraints(analysis);

  generateIntent({ decisions, constraints });

  const intentPath = path.join(process.cwd(), ".octa");
  fs.mkdirSync(intentPath, { recursive: true });

  // Register decisions
  const decisionsDir = path.join(intentPath, "decisions");
  fs.mkdirSync(decisionsDir, { recursive: true });
  decisions.forEach((d: any) => {
    fs.writeFileSync(
      path.join(decisionsDir, `${d.id}.json`),
      JSON.stringify(d, null, 2),
    );
  });

  // Register constraints
  const constraintsDir = path.join(intentPath, "constraints");
  fs.mkdirSync(constraintsDir, { recursive: true });
  constraints.forEach((c: any) => {
    fs.writeFileSync(
      path.join(constraintsDir, `${c.id}.json`),
      JSON.stringify(c, null, 2),
    );
  });

  await sync(true); // Auto-sync AI instructions silently

  console.log("✔ Intent system initialized");
  console.log(`- ${decisions.length} decisions inferred`);
  console.log(`- ${constraints.length} constraints suggested`);
}
