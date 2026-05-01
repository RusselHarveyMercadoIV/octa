# ⬢ Octa

### The Architectural Reasoning Engine for AI-First Teams

**Octa** is not a linter. It is a living governance layer that transforms architectural "intent" from static documentation into active, machine-readable intelligence. 

In a world where AI assistants (Cursor, Copilot, ChatGPT) write more code than humans, **architectural drift** is the new technical debt. Octa ensures your architecture survives the speed of AI.

---

## 🧠 Why Octa?

Architectural decisions usually die in forgotten Markdown files or stale Wikis. **Octa** changes the game by making architecture **executable**:

- **Reasoning**: It doesn't just block code; it explains *why* a constraint exists.
- **Inference**: It scans your code reality to discover emergent relationships between decisions and rules.
- **Governance**: It manages the lifecycle of intent (Proposed → Active → Superseded).
- **AI-Sync**: It automatically feeds your architecture into LLM context windows (`.cursorrules`), ensuring AI stays "within the guardrails."

---

## 🚀 Quick Start

Install Octa globally to start governing your projects:

```bash
npm install -g git+https://github.com/RusselHarveyMercadoIV/octa.git
```

Initialize Octa in your repository:

```bash
octa init
```

---

## 🛠 The Octa Workflow

### 1. Declare Intent
Add a new architectural decision. Octa anchors it to code patterns so it can "see" it in reality.
```bash
octa decision:add auth.jwt "Use JWT" "Stateless tokens" "Scalability" --patterns jsonwebtoken --proposed
```

### 2. Approve & Govern
Promote a proposal to active policy. This automatically records your Git authorship and commit context.
```bash
octa approve auth.jwt
```

### 3. Sync AI Guardrails
Inject your active decisions directly into Cursor, Copilot, and other AI assistants.
```bash
octa sync
```

### 4. Query the "Why"
Ask Octa about any file or decision. It will use its **Inference Engine** to show you the impacted code and co-located rules.
```bash
octa query src/api/auth.ts
```

### 5. Run the Doctor
Check the health of your architecture. Octa detects drift and violations before they reach production.
```bash
octa doctor
```

## 🕹 Command Reference

| Command | Description |
| :--- | :--- |
| `octa init` | Initialize Octa in the current repository. |
| `octa decision:add` | Propose a new architectural decision. |
| `octa decision:update`| Update an existing decision with a new version. |
| `octa decision:get <id>`| Retrieve the full history of a specific decision. |
| `octa approve <id>` | Promote a proposal to active policy. |
| `octa reject <id>` | Formally reject a proposed decision. |
| `octa deprecate <id>` | Mark a decision as legacy or superseded. |
| `octa constraint:add` | Add a new architectural constraint (linter rule). |
| `octa query <target>` | Analyze the intent behind a file, decision, or rule. |
| `octa doctor` | Run a health check on architectural drift (supports `--json`). |
| `octa sync` | Synchronize your architecture with AI assistant context. |
| `octa validate` | Manually run architectural constraint validation. |
| `octa watch` | Start a daemon that validates architecture in real-time. |
| `octa ci` | Optimized validation for CI/CD pipelines. |
| `octa context <query>`| Build a custom context prompt for LLMs based on a query. |
| `octa install` | Install Octa as a pre-commit hook (via Husky). |

---

## 🏗 The Four Layers of Octa

1. **The Registry**: A centralized, versioned index of all architectural intent.
2. **The Context Engine**: A bridge that synchronizes project rules with AI agents.
3. **The Inference Layer**: A graph-based engine that maps code reality to architectural decisions.
4. **The Lifecycle Manager**: A state machine for governing the evolution of design (v1 → v2).

---

## ⚖️ License

Built with ❤️ by [Russel Harvey Mercado IV](https://github.com/RusselHarveyMercadoIV). 
Licensed under the ISC License.

*"Architecture is the decisions that are hard to change. Octa makes them impossible to forget."*