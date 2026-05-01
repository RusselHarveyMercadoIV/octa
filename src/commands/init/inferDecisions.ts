export function inferDecisions(analysis: any) {
  const decisions = [];

  const deps = analysis.dependencies;

  if (deps.includes("next")) {
    decisions.push({
      id: "framework.frontend",
      title: "Use Next.js",
      history: [{
        version: 1,
        choice: "Next.js",
        reason: "Detected next dependency",
        timestamp: new Date().toISOString(),
        status: "active"
      }]
    });
  }

  if (deps.includes("express")) {
    decisions.push({
      id: "framework.backend",
      title: "Use Express.js",
      history: [{
        version: 1,
        choice: "Express.js",
        reason: "Detected express dependency",
        timestamp: new Date().toISOString(),
        status: "active"
      }]
    });
  }

  if (deps.includes("prisma")) {
    decisions.push({
      id: "orm",
      title: "Use Prisma ORM",
      history: [{
        version: 1,
        choice: "Prisma",
        reason: "Detected Prisma usage",
        timestamp: new Date().toISOString(),
        status: "active"
      }]
    });
  }

  return decisions;
}
