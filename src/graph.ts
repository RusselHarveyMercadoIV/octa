import { readIndex, readJSON, decisionPath, constraintPath } from "./store.js";
import type { Decision, Constraint, Link } from "./types.js";

export type GraphNode = {
  id: string;
  type: "decision" | "constraint";
  data: Decision | Constraint;
  outgoing: Link[];
  incoming: Link[]; // Reverse edges for upstream traversal
};

export class IntentGraph {
  private nodes: Map<string, GraphNode> = new Map();

  constructor() {
    this.build();
  }

  private build() {
    const index = readIndex();

    // 1. Load all nodes
    index.decisions.forEach((id: string) => {
      const data = readJSON(decisionPath(id));
      if (data) {
        this.nodes.set(id, {
          id,
          type: "decision",
          data,
          outgoing: data.links || [],
          incoming: [],
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
          outgoing: data.links || [],
          incoming: [],
        });
      }
    });

    // 2. Build reverse edges for bidirectional reasoning
    for (const node of this.nodes.values()) {
      for (const link of node.outgoing) {
        const targetNode = this.nodes.get(link.target);
        if (targetNode) {
          // Add reverse link to target
          targetNode.incoming.push({
            type: link.type,
            target: node.id,
          });
        }
      }
    }
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Trace why a node exists (Upstream)
   * Follows outgoing links (e.g., Constraint -> Decision)
   */
  public getUpstream(id: string, depth = 0, visited = new Set<string>()): GraphNode[] {
    if (depth >= 3 || visited.has(id)) return [];
    visited.add(id);

    const node = this.nodes.get(id);
    if (!node) return [];

    const upstream: GraphNode[] = [];
    for (const link of node.outgoing) {
      const parent = this.nodes.get(link.target);
      if (parent) {
        upstream.push(parent);
        upstream.push(...this.getUpstream(parent.id, depth + 1, visited));
      }
    }

    return upstream;
  }

  /**
   * Trace what a node impacts (Downstream)
   * Follows incoming (reverse) links (e.g., Decision -> Constraint)
   */
  public getDownstream(id: string, depth = 0, visited = new Set<string>()): GraphNode[] {
    if (depth >= 3 || visited.has(id)) return [];
    visited.add(id);

    const node = this.nodes.get(id);
    if (!node) return [];

    const downstream: GraphNode[] = [];
    for (const link of node.incoming) {
      const child = this.nodes.get(link.target);
      if (child) {
        downstream.push(child);
        downstream.push(...this.getDownstream(child.id, depth + 1, visited));
      }
    }

    return downstream;
  }
}
