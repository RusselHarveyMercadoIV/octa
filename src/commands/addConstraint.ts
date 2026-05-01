import { writeJSON, constraintPath, addToIndex } from "../store.js";

export async function addConstraint(args: string[]) {
  const [id, rule, pattern, recommendation] = args;

  if (!id || !rule || !pattern) {
    console.error(
      "Missing required arguments. Usage: constraint:add <id> <rule> <pattern> [recommendation]",
    );
    process.exit(1);
  }

  const constraint = {
    id,
    rule,
    pattern,
    severity: "hard" as const,
    ...(recommendation && { recommendation }),
  };

  writeJSON(constraintPath(id), constraint);
  addToIndex("constraints", id);

  console.log(`✔ Constraint added: ${id}`);
}
