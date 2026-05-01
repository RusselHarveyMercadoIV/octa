import { writeJSON, decisionPath, addToIndex } from "../store.js";
import type { Decision } from "../types.js";
import { sync } from "./sync.js";

export async function addDecision(args: string[]) {
  const [id, title, choice, reason] = args;

  if (!id || !title || !choice || !reason) {
    console.error(
      "Missing required arguments. Usage: add:decision <id> <title> <choice> <reason>",
    );
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
  addToIndex("decisions", id);

  await sync(true); // Auto-sync AI instructions silently

  console.log(`✔ Decision created: ${id}`);
}
