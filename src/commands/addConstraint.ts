import { addToIndex, writeJSON, constraintPath } from "../store.js";
import { sync } from "./sync.js";
import type { Link, EdgeType } from "../types.js";

export async function addConstraint(args: string[]) {
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

  const [id, rule, pattern, recommendation] = args;

  if (!id || !rule || !pattern) {
    console.error(
      "Usage: octa constraint:add <id> <rule> <pattern> [recommendation] [--links type:id,...]",
    );
    process.exit(1);
  }

  const constraint = {
    id,
    rule,
    severity: "hard", // default new manual constraints to hard
    pattern,
    ...(recommendation && { recommendation }),
    links,
  };

  writeJSON(constraintPath(id), constraint);
  addToIndex("constraints", id);

  await sync(true); // Auto-sync AI instructions silently

  console.log(`✔ Constraint added: ${id}`);
}
