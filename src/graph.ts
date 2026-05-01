import { readIndex, readJSON, decisionPath, constraintPath } from "./store.js";
import type { Decision, Constraint, Link } from "./types.js";
import { walk } from "./analyzer/scan.js";
import { scanFile } from "./analyzer/astScan.js";
import path from "path";

export type GraphNode = {
  id: string;
  type: "decision" | "constraint";
  data: Decision | Constraint;
  impactedFiles: string[];
  relatedNodes: Set<string>; // Inferred relationships
};

export class IntentGraph {
  private nodes: Map<string, GraphNode> = new Map();

  constructor() {
    // Note: async initialization is tricky in constructor, 
    // but since build() is fast enough we can call it.
  }

  public async build() {
    const index = readIndex();
    const projectFiles = walk(path.join(process.cwd(), "src"));

    // 1. Initialize Nodes
    index.decisions.forEach((id: string) => {
      const data = readJSON(decisionPath(id));
      if (data) {
        this.nodes.set(id, {
          id,
          type: "decision",
          data,
          impactedFiles: [],
          relatedNodes: new Set(),
        });
      }
    });

    index.constraints.forEach((id: string) => {
      const data = readJSON(constraintPath(id));
      if (data) {
        this.nodes.set(id, {
          id,
          type: "constraint",
          data,
          impactedFiles: [],
          relatedNodes: new Set(),
        });
      }
    });

    // 2. Discover Relationships from Code
    for (const file of projectFiles) {
      const scan = scanFile(file);
      const relativePath = path.relative(process.cwd(), file);
      
      const fileDecisions: string[] = [];
      const fileConstraints: string[] = [];

      // Detect Decisions in this file
      for (const node of this.nodes.values()) {
        if (node.type === "decision") {
          const d = node.data as Decision;
          if (d.patterns?.some(p => scan.imports.some(i => i.includes(p)))) {
            node.impactedFiles.push(relativePath);
            fileDecisions.push(node.id);
          }
        } else {
          const c = node.data as Constraint;
          if (scan.imports.some(i => i.includes(c.pattern))) {
            node.impactedFiles.push(relativePath);
            fileConstraints.push(node.id);
          }
        }
      }

      // 3. Compute co-occurrence edges (Decision <-> Constraint)
      for (const dId of fileDecisions) {
        for (const cId of fileConstraints) {
          this.nodes.get(dId)?.relatedNodes.add(cId);
          this.nodes.get(cId)?.relatedNodes.add(dId);
        }
      }
    }
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getInferredLinks(id: string): GraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    
    return Array.from(node.relatedNodes)
      .map(rid => this.nodes.get(rid))
      .filter(Boolean) as GraphNode[];
  }
}
