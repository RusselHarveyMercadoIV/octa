import { readJSON, decisionPath } from "../store.js";
import type { Decision, DecisionVersion } from "../types.js";

export async function getDecision(args: string[]) {
  const [id] = args;

  if (!id) {
    console.error("Missing required arguments. Usage: get:decision <id>");
    process.exit(1);
  }

  const decision = readJSON(decisionPath(id)) as Decision;

  if (!decision) {
    console.log("Not found");
    return;
  }

  const active = decision.history.find((v: DecisionVersion) => v.status === "active");

  console.log("Decision:", id);
  console.log("Title:", decision.title);
  console.log("ACTIVE:", active?.choice);
  console.log("\nHistory:");
  console.log(decision.history);
}
