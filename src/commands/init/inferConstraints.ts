export function inferConstraints(analysis: any) {
  const constraints = [];

  const deps = analysis.dependencies;

  if (!deps.includes("redis")) {
    constraints.push({
      id: "no.redis",
      rule: "No Redis usage detected",
      pattern: "redis",
    });
  }

  if (analysis.files.some((f: string) => f.includes("/api/"))) {
    constraints.push({
      id: "api.structure",
      rule: "API routes detected - enforce separation of concerns",
      pattern: "direct db usage in routes",
    });
  }

  return constraints;
}
