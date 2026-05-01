export type DecisionStatus = "proposed" | "active" | "deprecated" | "rejected" | "superseded";

export type DecisionVersion = {
  version: number;
  choice: string;
  reason: string;
  timestamp: string;
  status: DecisionStatus;
  author?: {
    name: string;
    email: string;
  };
  commitHash?: string | undefined;
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
  patterns?: string[];
  links?: Link[];
  supersedes?: string[];
  replacedBy?: string;
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
