import fs from "fs";
import path from "path";

export async function addConstraint(args: string[]) {
  const [id, rule, pattern] = args;

  const filePath = path.join(
    process.cwd(),
    "intent",
    "constraints",
    `${id}.json`,
  );

  const constraint = {
    id,
    rule,
    pattern,
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(constraint, null, 2));

  console.log(`✔ Constraint added: ${id}`);
}
