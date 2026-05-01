export type DecisionVersion = {
  version: number;
  choice: string;
  reason: string;
  timestamp: string;
  status: "active" | "deprecated";
};

export type Decision = {
  id: string;
  title: string;
  history: DecisionVersion[];
};

export type Constraint = {
  id: string;
  rule: string;
  severity: "hard" | "soft";
  pattern: string;
};

export type IntentIndex = {
  decisions: string[];
  constraints: string[];
};
