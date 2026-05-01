export type DecisionVersion = {
  version: number;
  choice: string;
  reason: string;
  timestamp: string;
  status: "active" | "deprecated";
};

export type EdgeType = "depends_on" | "enforces" | "violates" | "originates_from";

export type Link = {
  type: EdgeType;
  target: string;
};

export type Decision = {
  id: string;
  title: string;
  history: DecisionVersion[];
  links?: Link[];
};

export type Constraint = {
  id: string;
  rule: string;
  severity: "hard" | "soft";
  pattern: string;
  recommendation?: string;
  links?: Link[];
};

export type IntentIndex = {
  decisions: string[];
  constraints: string[];
};
