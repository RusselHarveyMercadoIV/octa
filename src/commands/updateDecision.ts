import { readJSON, writeJSON, decisionPath } from "../store.js";
import type { Decision, DecisionVersion } from "../types.js";
import { sync } from "./sync.js";

export async function updateDecision(args: string[]) {
  const [id, newChoice, reason] = args;

  if (!id || !newChoice || !reason) {
    console.error(
      "Missing required arguments. Usage: update:decision <id> <choice> <reason>",
    );
    process.exit(1);
  }

  const decision = readJSON(decisionPath(id)) as Decision;
  if (!decision) throw new Error("Decision not found");

  // mark previous active as deprecated
  decision.history.forEach((v: DecisionVersion) => {
    if (v.status === "active") {
      v.status = "deprecated";
    }
  });

  const nextVersion = decision.history.length + 1;

  decision.history.push({
    version: nextVersion,
    choice: newChoice,
    reason,
    timestamp: new Date().toISOString(),
    status: "active",
  });

  writeJSON(decisionPath(id), decision);

  await sync(true); // Auto-sync AI instructions silently

  console.log(`✔ Decision updated: ${id}`);
}
