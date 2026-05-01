import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function install() {
  console.log("🚀 Installing Octa Adoption Friction Layer...");

  // 1. VS Code Tasks (IDE Auto-Run)
  const vscodeDir = path.join(process.cwd(), ".vscode");
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }

  const tasksFile = path.join(vscodeDir, "tasks.json");
  const tasksContent = {
    version: "2.0.0",
    tasks: [
      {
        label: "Octa Background Watcher",
        type: "shell",
        command: "npm run octa watch",
        isBackground: true,
        runOptions: {
          runOn: "folderOpen"
        },
        presentation: {
          reveal: "never",
          panel: "dedicated"
        }
      }
    ]
  };

  // Merge if exists, otherwise create
  if (fs.existsSync(tasksFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(tasksFile, "utf-8"));
      // Check if task already exists
      const hasTask = existing.tasks?.some((t: any) => t.label === "Octa Background Watcher");
      if (!hasTask) {
        existing.tasks = existing.tasks || [];
        existing.tasks.push(tasksContent.tasks[0]);
        fs.writeFileSync(tasksFile, JSON.stringify(existing, null, 2));
        console.log("✔ Updated .vscode/tasks.json for background IDE integration.");
      } else {
        console.log("- VS Code task already configured.");
      }
    } catch (e) {
      console.error("⚠ Failed to parse existing tasks.json. Skipping IDE integration.");
    }
  } else {
    fs.writeFileSync(tasksFile, JSON.stringify(tasksContent, null, 2));
    console.log("✔ Created .vscode/tasks.json for background IDE integration.");
  }

  // 2. Git Hooks (Husky Pre-commit)
  const huskyDir = path.join(process.cwd(), ".husky");
  if (!fs.existsSync(huskyDir)) {
    console.log("⚠ Husky not found. Initializing Husky...");
    try {
      execSync("npx husky init", { stdio: "inherit" });
      console.log("✔ Husky initialized.");
    } catch (e) {
      console.error("❌ Failed to initialize Husky automatically. Proceeding with manual creation...");
      fs.mkdirSync(huskyDir, { recursive: true });
    }
  }

  const preCommitFile = path.join(huskyDir, "pre-commit");
  const hookCommand = `npm run octa validate`;

  if (fs.existsSync(preCommitFile)) {
    const existingHook = fs.readFileSync(preCommitFile, "utf-8");
    if (!existingHook.includes(hookCommand)) {
      fs.appendFileSync(preCommitFile, `\n${hookCommand}\n`);
      console.log("✔ Added Octa validation to existing pre-commit hook.");
    } else {
      console.log("- Pre-commit hook already configured.");
    }
  } else {
    // Create new pre-commit hook
    const hookContent = `#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\n${hookCommand}\n`;
    fs.writeFileSync(preCommitFile, hookContent, { mode: 0o755 });
    console.log("✔ Created .husky/pre-commit hook for CI/CD enforcement.");
  }

  console.log("\n🎉 Octa is now running in the background and enforcing architecture at commit time!");
}
