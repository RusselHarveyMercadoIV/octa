export function generateIntent({ decisions, constraints }: any) {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    decisions,
    constraints,
  };
}
