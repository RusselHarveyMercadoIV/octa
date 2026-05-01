import { analyzeProject } from "./analyzeProject.js";
import { inferDecisions } from "./inferDecisions.js";
import { inferConstraints } from "./inferConstraints.js";
import { generateIntent } from "./generateIntent.js";
import fs from "fs";
import path from "path";

export async function init() {
  console.log("🔍 Analyzing project...");

  const analysis = analyzeProject();

  const decisions = inferDecisions(analysis);
  const constraints = inferConstraints(analysis);

  const intent = generateIntent({ decisions, constraints });

  const intentPath = path.join(process.cwd(), "intent");

  fs.mkdirSync(intentPath, { recursive: true });

  fs.writeFileSync(
    path.join(intentPath, "bootstrap.json"),
    JSON.stringify(intent, null, 2),
  );

  console.log("✔ Intent system initialized");
  console.log(`- ${decisions.length} decisions inferred`);
  console.log(`- ${constraints.length} constraints suggested`);
}
