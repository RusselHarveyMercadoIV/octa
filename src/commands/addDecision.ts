import { writeJSON, decisionPath } from "../store.js";
import type { Decision } from "../types.js";

export async function addDecision(args: string[]) {
  const [id, title, choice, reason] = args;

  if (!id || !title || !choice || !reason) {
    console.error("Missing required arguments. Usage: add:decision <id> <title> <choice> <reason>");
    process.exit(1);
  }

  const decision: Decision = {
    id,
    title,
    history: [
      {
        version: 1,
        choice,
        reason,
        timestamp: new Date().toISOString(),
        status: "active",
      },
    ],
  };

  writeJSON(decisionPath(id), decision);

  console.log(`✔ Decision created: ${id}`);
}
