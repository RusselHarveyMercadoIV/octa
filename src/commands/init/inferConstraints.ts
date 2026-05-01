export function inferConstraints(analysis: any) {
  const constraints = [];

  const deps = analysis.dependencies;

  if (!deps.includes("redis")) {
    constraints.push({
      id: "no.redis",
      rule: "No Redis usage detected",
      pattern: "redis",
      severity: "hard",
      recommendation: "Ensure Redis is not introduced unless an architectural decision is approved.",
    });
  }

  const hasTesting = deps.some((d: string) => d.includes("jest") || d.includes("vitest") || d.includes("playwright") || d.includes("cypress"));
  if (!hasTesting) {
    constraints.push({
      id: "testing.required",
      rule: "No testing framework detected",
      pattern: "test",
      severity: "soft",
      recommendation: "Initialize a testing framework (Vitest/Jest) to maintain architectural integrity.",
    });
  }

  const hasServices = analysis.files.some((f: string) => f.includes("/services/") || f.includes("/lib/"));
  if (!hasServices && analysis.files.some((f: string) => f.includes("/api/"))) {
    constraints.push({
      id: "api.structure",
      rule: "API routes detected without a service layer",
      pattern: "direct db usage in routes",
      severity: "soft",
      recommendation: "Abstract database logic into a /services or /lib layer to prevent route bloat.",
    });
  }

  return constraints;
}
