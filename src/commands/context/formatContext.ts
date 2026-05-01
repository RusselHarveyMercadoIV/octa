export function format({ task, decisions, constraints }: any) {
  let out = `# OCTA CONTEXT PACK\n\n`;
  out += `## TASK\n${task}\n\n`;

  out += `## ACTIVE DECISIONS\n`;
  for (const d of decisions) {
    const active = d.history?.find((h: any) => h.status === "active");
    if (active) {
      out += `- ${d.id}: ${active.choice}\n`;
    }
  }

  out += `\n## CONSTRAINTS\n`;
  for (const c of constraints) {
    out += `- ${c.rule}\n`;
  }

  return out;
}
