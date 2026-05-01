import fs from "fs";
import path from "path";

export function generateIntent({ decisions, constraints }: any) {
  const base = path.join(process.cwd(), ".octa");

  const index = {
    decisions: decisions.map((d: any) => d.id),
    constraints: constraints.map((c: any) => c.id),
  };

  if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

  fs.writeFileSync(
    path.join(base, "index.json"),
    JSON.stringify(index, null, 2),
  );
}
