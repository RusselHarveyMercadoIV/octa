import fs from "fs";
import path from "path";

function walk(dir: string, files: string[] = []) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const full = path.join(dir, entry);

    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith(".ts") || full.endsWith(".js")) {
      files.push(full);
    }
  }

  return files;
}

export function scanRepo() {
  const files = walk(process.cwd());
  const content: { file: string; code: string }[] = [];

  for (const file of files) {
    content.push({
      file,
      code: fs.readFileSync(file, "utf-8"),
    });
  }

  return content;
}
