import { writeJSON, decisionPath, addToIndex } from "../store.js";
import type { Decision, Link, EdgeType, DecisionStatus } from "../types.js";
import { sync } from "./sync.js";
import { getGitUser, getCurrentCommitHash } from "../git.js";

export async function addDecision(args: string[]) {
  // Parse proposed flag
  let status: DecisionStatus = "active";
  const proposedIdx = args.indexOf("--proposed");
  if (proposedIdx !== -1) {
    status = "proposed";
    args.splice(proposedIdx, 1);
  }
  // Parse patterns if present
  let patterns: string[] = [];
  const patternsIdx = args.indexOf("--patterns");
  if (patternsIdx !== -1) {
    const rawPatterns = args[patternsIdx + 1];
    if (rawPatterns) {
      patterns = rawPatterns.split(",");
      args.splice(patternsIdx, 2);
    }
  }

  // Parse links if present (legacy support)
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
        status,
        author: getGitUser(),
        commitHash: getCurrentCommitHash(),
      },
    ],
    patterns,
    links,
  };

  writeJSON(decisionPath(id), decision);
  addToIndex("decisions", id);

  await sync(true); // Auto-sync AI instructions silently

  console.log(`✔ Decision created: ${id}`);
}
