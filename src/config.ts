import fs from "fs";
import path from "path";

export type OctaConfig = {
  ignore: string[];
  strict: boolean;
  aiContext: string;
};

const DEFAULT_CONFIG: OctaConfig = {
  ignore: ["node_modules", "dist", ".git", ".octa"],
  strict: false,
  aiContext: ".cursorrules",
};

export function loadConfig(): OctaConfig {
  const configPath = path.join(process.cwd(), ".octarc");
  
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (e) {
      console.warn("⚠️ Failed to parse .octarc, using defaults.");
    }
  }

  return DEFAULT_CONFIG;
}
