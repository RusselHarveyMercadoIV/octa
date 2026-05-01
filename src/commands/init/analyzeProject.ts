import fs from "fs";
import path from "path";

function readPkg() {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) return null;
  return JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
}

function walk(dir: string, files: string[] = []) {
  try {
    for (const entry of fs.readdirSync(dir)) {
      if (entry === "node_modules" || entry === ".git" || entry === ".octa") continue;
      const full = path.join(dir, entry);

      if (fs.statSync(full).isDirectory()) {
        walk(full, files);
      } else {
        files.push(full);
      }
    }
  } catch (e) {}

  return files;
}

export function analyzeProject() {
  const pkg = readPkg();
  const files = walk(process.cwd());

  const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };

  return {
    packageJson: pkg,
    dependencies: Object.keys(deps),
    scripts: Object.keys(pkg?.scripts || {}),
    files,
  };
}
