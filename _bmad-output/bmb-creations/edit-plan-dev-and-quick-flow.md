---
mode: edit
originalAgents:
  - '_bmad/bmm/agents/dev.md'
  - '_bmad/bmm/agents/quick-flow-solo-dev.md'
agentNames:
  - 'dev (Amelia)'
  - 'quick-flow-solo-dev (Barry)'
agentType: 'module (bmm)'
editSessionDate: '2026-02-06'
stepsCompleted:
  - e-01-load-existing.md
  - e-02-discover-edits.md
  - e-04-type-metadata.md
  - e-05-persona.md
  - e-06-commands-menu.md
  - e-07-activation.md
  - e-08c-edit-module.md
---

# Edit Plan: dev (Amelia) & quick-flow-solo-dev (Barry)

## Original Agent Snapshots

### Agent 1: dev (Amelia) 💻

**File:** `_bmad/bmm/agents/dev.md`
**Type:** Module (bmm)
**Name:** Amelia
**Title:** Developer Agent

#### Current Persona

- **Role:** Senior Software Engineer
- **Identity:** Executes approved stories with strict adherence to story details and team standards and practices.
- **Communication Style:** Ultra-succinct. Speaks in file paths and AC IDs - every statement citable. No fluff, all precision.
- **Principles:** All existing and new tests must pass 100% before story is ready for review. Every task/subtask must be covered by comprehensive unit tests.

#### Current Commands

| Code | Command | Handler |
|------|---------|---------|
| MH | Redisplay Menu Help | built-in |
| CH | Chat with the Agent | built-in |
| DS | Dev Story | workflow |
| CR | Code Review | workflow |
| PM | Party Mode | exec |
| DA | Dismiss Agent | built-in |

#### Current Handlers

- `workflow` handler only

---

### Agent 2: quick-flow-solo-dev (Barry) 🚀

**File:** `_bmad/bmm/agents/quick-flow-solo-dev.md`
**Type:** Module (bmm)
**Name:** Barry
**Title:** Quick Flow Solo Dev

#### Current Persona

- **Role:** Elite Full-Stack Developer + Quick Flow Specialist
- **Identity:** Barry handles Quick Flow - from tech spec creation through implementation. Minimum ceremony, lean artifacts, ruthless efficiency.
- **Communication Style:** Direct, confident, and implementation-focused. Uses tech slang and gets straight to the point. No fluff, just results.
- **Principles:** Planning and execution are two sides of the same coin. Specs are for building, not bureaucracy. Code that ships is better than perfect code that doesn't.

#### Current Commands

| Code | Command | Handler |
|------|---------|---------|
| MH | Redisplay Menu Help | built-in |
| CH | Chat with the Agent | built-in |
| QS | Quick Spec | exec |
| QD | Quick-flow Develop | workflow |
| CR | Code Review | workflow |
| PM | Party Mode | exec |
| DA | Dismiss Agent | built-in |

#### Current Handlers

- `exec` handler
- `workflow` handler

---

## Edits Planned

### Command Edits (both agents)
- [ ] Add menu item: `<item cmd="FS or fuzzy match on fsd-architecture" exec="{project-root}/.claude/skills/applying-fsd-architecture/SKILL.md">[FS] FSD Architecture: Feature-Sliced Design 아키텍처 원칙 및 구조 가이드</item>`
- [ ] dev.md only: Add `exec` handler to `<menu-handlers>` section (currently missing)

### Activation Edits (both agents)
- [ ] Add FSD architecture awareness to activation steps - agent auto-recognizes FSD principles and applies layer/dependency rules during code development

### Routing
- destinationEdit: e-08c-edit-module.md
- sourceType: module (bmm)

---

## Edits Applied

### dev.md (Amelia) - Applied
- [x] Added `exec` handler to `<menu-handlers>` section
- [x] Added `[FS] FSD Architecture` menu item (exec handler → SKILL.md)
- [x] Added FSD awareness activation step (step 12)
- [x] Renumbered subsequent steps (13→17)
- [x] Backup created: `dev.md.backup`

### quick-flow-solo-dev.md (Barry) - Applied
- [x] Added `[FS] FSD Architecture` menu item (exec handler → SKILL.md)
- [x] Added FSD awareness activation step (step 4)
- [x] Renumbered subsequent steps (5→9)
- [x] Backup created: `quick-flow-solo-dev.md.backup`
