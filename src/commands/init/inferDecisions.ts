export function inferDecisions(analysis: any) {
  const decisions = [];

  const deps = analysis.dependencies;

  if (deps.includes("next")) {
    decisions.push({
      id: "framework.frontend",
      choice: "Next.js",
      reason: "Detected next dependency",
    });
  }

  if (deps.includes("express")) {
    decisions.push({
      id: "framework.backend",
      choice: "Express.js",
      reason: "Detected express dependency",
    });
  }

  if (deps.includes("prisma")) {
    decisions.push({
      id: "orm",
      choice: "Prisma",
      reason: "Detected Prisma usage",
    });
  }

  return decisions;
}
