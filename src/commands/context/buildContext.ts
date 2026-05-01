import { readIndex, readJSON, decisionPath, constraintPath } from "../../store.js";
import { format } from "./formatContext.js";

export async function buildContext(task: string) {
  const index = readIndex();

  const decisions = index.decisions.map((id: string) =>
    readJSON(decisionPath(id)),
  );

  const constraints = index.constraints.map((id: string) =>
    readJSON(constraintPath(id)),
  );

  const context = {
    task,
    decisions,
    constraints,
  };

  console.log(format(context));
}
