import { writeJSON, decisionPath, addToIndex } from "../store.js";
import type { Decision, Link, EdgeType } from "../types.js";
import { sync } from "./sync.js";

export async function addDecision(args: string[]) {
  // Parse links if present
  let links: Link[] = [];
  const linksIdx = args.indexOf("--links");
  if (linksIdx !== -1) {
    const rawLinks = args[linksIdx + 1];
    if (rawLinks) {
      links = rawLinks.split(",").map((s) => {
        const [type, target] = s.split(":") as [EdgeType, string];
        return { type, target };
      });
      args.splice(linksIdx, 2);
    }
  }

  const [id, title, choice, reason] = args;

  if (!id || !title || !choice || !reason) {
    console.error(
      "Missing required arguments. Usage: add:decision <id> <title> <choice> <reason> [--links type:id,...]",
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
    links,
  };

  writeJSON(decisionPath(id), decision);
  addToIndex("decisions", id);

  await sync(true); // Auto-sync AI instructions silently

  console.log(`✔ Decision created: ${id}`);
}
