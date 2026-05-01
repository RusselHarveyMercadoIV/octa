import fs from "fs";
import path from "path";
import { scanFile } from "../analyzer/astScan.js";
import { readIndex, readJSON, constraintPath } from "../store.js";
import type { Constraint } from "../types.js";

function loadConstraints(): Constraint[] {
  const index = readIndex();
  return index.constraints
    .map((id: string) => readJSON(constraintPath(id)))
    .filter(Boolean);
}

export async function watch() {
  console.log("👀 Octa is watching for architectural drift in background...");

  const constraints = loadConstraints();
  const watchDir = path.join(process.cwd(), "src");

  if (!fs.existsSync(watchDir)) {
    console.error("❌ 'src' directory not found. Cannot start watcher.");
    process.exit(1);
  }

  let debounceTimer: NodeJS.Timeout;

  fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith(".ts")) return;

    // Debounce to prevent multiple scans on rapid saves
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const fullPath = path.join(watchDir, filename);
      
      // Skip if file was deleted
      if (!fs.existsSync(fullPath)) return;

      try {
        const fileScan = scanFile(fullPath);
        const violations = [];

        for (const constraint of constraints) {
          const matched = fileScan.imports.some((i) => i.includes(constraint.pattern));
          if (matched) {
            violations.push(constraint);
          }
        }

        if (violations.length > 0) {
          console.log(`\n⚠ DRIFT DETECTED IN: ${filename}`);
          for (const v of violations) {
            const risk = v.severity === "hard" ? "🚨 HIGH" : "🚸 MEDIUM";
            console.log(`  [${risk}] Violates: "${v.id}" (${v.rule})`);
            if (v.recommendation) {
              console.log(`  💡 Recommendation: ${v.recommendation}`);
            }
          }
          console.log("----------------------------------------");
        } else {
           // Optionally, clear the terminal or print a subtle success message.
           // To avoid spam, we might just stay silent if healthy.
        }
      } catch (err) {
        console.error("Watch error:", err);
      }
    }, 100);
  });
}
