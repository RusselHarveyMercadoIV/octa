# ⬢ Octa
<img width="1584" height="672" alt="octa_banner (1)" src="https://github.com/user-attachments/assets/598246b3-dd8b-4ce3-be95-efc69995870a" />

### The Architectural Reasoning Engine for AI-First Teams

**Octa** is not a linter. It is a living governance layer that transforms architectural "intent" from static documentation into active, machine-readable intelligence.

In a world where AI assistants (Cursor, Copilot, ChatGPT) write more code than humans, **architectural drift** is the new technical debt. Octa ensures your architecture survives the speed of AI.

---

## 🧠 Why Octa?

Architectural decisions usually die in forgotten Markdown files or stale Wikis. **Octa** changes the game by making architecture **executable**:

- **Reasoning**: It doesn't just block code; it explains _why_ a constraint exists.
- **Inference**: It scans your code reality to discover emergent relationships between decisions and rules.
- **Governance**: It manages the lifecycle of intent (Proposed → Active → Superseded).
- **AI-Sync**: It automatically feeds your architecture into LLM context windows (`.cursorrules`), ensuring AI stays "within the guardrails."

---

## 🚀 Getting Started

Follow these 5 steps to bring architectural reasoning to your project.

### 1. Install Octa Globally
```bash
npm install -g @russelharvey/octa
```

### 2. Initialize your Project
Run this in the root of your repository to create the `.octa` registry and infer your baseline architecture.
```bash
octa init
```

### 3. Define your first Decision
Create a "Proposed" decision to set a new architectural direction.
```bash
octa decision:add auth.jwt "Use JWT" "Stateless tokens" "Scalability" --patterns jsonwebtoken --proposed
```

### 4. Approve and Sync
Promote the decision to "Active." This will automatically record your git authorship and inject the rule into your AI assistants (`.cursorrules`).
```bash
octa approve auth.jwt
```

### 5. Verify and Reasoning
Ask Octa about any file to see the architectural intent behind it, or run a doctor check to find drift.
```bash
octa query src/auth.ts
octa doctor
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

| Command                  | Description                                                    |
| :----------------------- | :------------------------------------------------------------- |
| `octa init`              | Initialize Octa in the current repository.                     |
| `octa decision:add`      | Propose a new architectural decision.                          |
| `octa decision:update`   | Update an existing decision with a new version.                |
| `octa decision:get <id>` | Retrieve the full history of a specific decision.              |
| `octa approve <id>`      | Promote a proposal to active policy.                           |
| `octa reject <id>`       | Formally reject a proposed decision.                           |
| `octa deprecate <id>`    | Mark a decision as legacy or superseded.                       |
| `octa constraint:add`    | Add a new architectural constraint (linter rule).              |
| `octa query <target>`    | Analyze the intent behind a file, decision, or rule.           |
| `octa doctor`            | Run a health check on architectural drift (supports `--json`). |
| `octa sync`              | Synchronize your architecture with AI assistant context.       |
| `octa validate`          | Manually run architectural constraint validation.              |
| `octa watch`             | Start a daemon that validates architecture in real-time.       |
| `octa ci`                | Optimized validation for CI/CD pipelines.                      |
| `octa context <query>`   | Build a custom context prompt for LLMs based on a query.       |
| `octa install`           | Install Octa as a pre-commit hook (via Husky).                 |

---

## 🏗 The Four Layers of Octa

1. **The Registry**: A centralized, versioned index of all architectural intent.
2. **The Context Engine**: A bridge that synchronizes project rules with AI agents.
3. **The Inference Layer**: A graph-based engine that maps code reality to architectural decisions.
4. **The Lifecycle Manager**: A state machine for governing the evolution of design.

---

## ⚖️ License

Built with ❤️ by [Russel Harvey Mercado IV](https://github.com/RusselHarveyMercadoIV).
Licensed under the MIT License.

_"Architecture is the decisions that are hard to change. Octa makes them impossible to forget."_
