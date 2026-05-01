import { execSync } from "child_process";

export function getGitUser() {
  try {
    const name = execSync("git config user.name").toString().trim();
    const email = execSync("git config user.email").toString().trim();
    return { name, email };
  } catch (e) {
    return { name: "unknown", email: "unknown" };
  }
}

export function getCurrentCommitHash() {
  try {
    return execSync("git rev-parse HEAD").toString().trim();
  } catch (e) {
    return undefined;
  }
}
