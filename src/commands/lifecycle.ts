import { readJSON, writeJSON, decisionPath } from "../store.js";
import type { Decision, DecisionStatus } from "../types.js";
import { getGitUser, getCurrentCommitHash } from "../git.js";
import { sync } from "./sync.js";

async function updateStatus(id: string, newStatus: DecisionStatus, reason?: string) {
  const path = decisionPath(id);
  const decision = readJSON(path) as Decision;

  if (!decision) {
    console.error(`❌ Decision not found: ${id}`);
    return;
  }

  const latest = decision.history[decision.history.length - 1];
  if (!latest) {
    console.error(`❌ Decision history is corrupt for: ${id}`);
    return;
  }
  
  decision.history.push({
    version: latest.version + 1,
    choice: latest.choice,
    reason: reason || latest.reason,
    timestamp: new Date().toISOString(),
    status: newStatus,
    author: getGitUser(),
    commitHash: getCurrentCommitHash(),
  });

  writeJSON(path, decision);
  await sync(true);
  console.log(`✔ Decision ${id} moved to status: ${newStatus}`);
}

export async function approve(args: string[]) {
  const id = args[0];
  if (!id) return console.error("Usage: octa approve <id>");
  await updateStatus(id, "active", "Decision approved by architect.");
}

export async function reject(args: string[]) {
  const id = args[0];
  const reason = args[1] || "Decision rejected.";
  if (!id) return console.error("Usage: octa reject <id> [reason]");
  await updateStatus(id, "rejected", reason);
}

export async function deprecate(args: string[]) {
  const id = args[0];
  const replacedBy = args.includes("--replaced-by") ? args[args.indexOf("--replaced-by") + 1] : undefined;
  
  if (!id) return console.error("Usage: octa deprecate <id> [--replaced-by <new-id>]");

  const path = decisionPath(id);
  const decision = readJSON(path) as Decision;
  if (decision && replacedBy) {
    decision.replacedBy = replacedBy;
    writeJSON(path, decision);
    
    // Also update the NEW decision to show it supersedes this one
    const newPath = decisionPath(replacedBy);
    const newDecision = readJSON(newPath) as Decision;
    if (newDecision) {
      newDecision.supersedes = [...(newDecision.supersedes || []), id];
      writeJSON(newPath, newDecision);
    }
  }

  await updateStatus(id, replacedBy ? "superseded" : "deprecated", replacedBy ? `Superseded by ${replacedBy}` : "Decision deprecated.");
}
