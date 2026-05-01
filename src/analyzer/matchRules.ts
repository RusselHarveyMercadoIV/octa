export function matchConstraint(code: string, pattern: string) {
  const regex = new RegExp(pattern, "g");
  return regex.test(code);
}
