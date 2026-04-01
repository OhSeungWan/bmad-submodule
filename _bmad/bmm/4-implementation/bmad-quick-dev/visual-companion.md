# Visual Companion Utility

Provides HTML-based visual information through a local brainstorm server instead of ASCII art or text diagrams when visual representation is needed.

> This file is based on the superpowers v5.0.7 brainstorm server.
> When updating, refer to the change detection checklist in `docs/superpowers/specs/2026-04-01-quick-dev-simplify-visual-companion-design.md`.

## When to Use

**Use Visual Companion** — whenever showing visually aids understanding:
- Architecture diagrams, system component structures
- Data flows, state machines, flowcharts
- UI mockups, wireframes, layout comparisons
- Side-by-side visual comparisons
- Entity relationship diagrams

**Use the terminal** — when text is sufficient:
- Requirements, scope questions
- Tradeoff lists, pros/cons comparisons (text)
- Technical decisions (API design, data modeling)
- Conceptual A/B/C choices

## Starting the Server

### Script Path

Server scripts are located in `_bmad/_tools/visual-companion/` within the project.

```bash
SCRIPT_DIR="{project-root}/_bmad/_tools/visual-companion"
```

### Running the Server

```bash
"$SCRIPT_DIR/start-server.sh" --project-dir {project-root}
```

Save the following values from the JSON returned by the server:
- `screen_dir` — directory to write HTML files
- `state_dir` — events and server state directory
- `url` — browser URL to share with the user
- `port` — server port

Instruct the user to open the URL: "Please open {url} in your browser."

## HTML Authoring Rules

1. **Use the content fragment approach.** HTML that does not start with `<!DOCTYPE` or `<html>` is automatically wrapped by the server in the frame template.
2. **Use semantic filenames:** `architecture.html`, `data-flow.html`, `layout-comparison.html`
3. **Never reuse filenames.** Append `-v2`, `-v3` suffixes for iterations.
4. **Use the Write tool.** Do not use cat/heredoc.
5. **Check server liveness before each write:** Verify `$STATE_DIR/server-info` exists. If missing or `$STATE_DIR/server-stopped` exists, restart the server.

### Available CSS Classes

| Class | Purpose |
|-------|---------|
| `.options` + `.option` | A/B/C choices (data-choice, onclick="toggleSelect(this)") |
| `.options[data-multiselect]` | Multi-select enabled |
| `.cards` + `.card` | Visual design cards |
| `.mockup` + `.mockup-header` + `.mockup-body` | Mockup container |
| `.split` | Side-by-side comparison |
| `.pros-cons` + `.pros` + `.cons` | Pros and cons |
| `.mock-nav`, `.mock-sidebar`, `.mock-content`, `.mock-button`, `.mock-input` | Wireframe elements |
| `.placeholder` | Placeholder area |
| `h2`, `h3`, `.subtitle`, `.section`, `.label` | Typography |

### Example: Architecture Diagram

```html
<h2>System Architecture</h2>
<p class="subtitle">Please review the proposed component structure</p>

<div class="mockup">
  <div class="mockup-header">Architecture Overview</div>
  <div class="mockup-body">
    <!-- Render diagram with SVG or HTML/CSS -->
  </div>
</div>
```

### Example: Presenting Choices

```html
<h2>Which approach is appropriate?</h2>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>Approach Title</h3>
      <p>Description</p>
    </div>
  </div>
</div>
```

## Reading Events

When the user clicks options in the browser, interactions are recorded as JSON lines in `$STATE_DIR/events`:

```jsonl
{"type":"click","choice":"a","text":"Option A","timestamp":1706000101}
```

Read this file on the next turn to check user browser interactions. Merge with terminal text to understand feedback. If the file does not exist, there were no browser interactions.

## Idle Screen Transition

When the next question is not visual (text question in terminal), push a waiting screen to clear the stale content:

```html
<div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
  <p class="subtitle">Continuing in terminal...</p>
</div>
```

## Server Cleanup

Stop the server after the plan phase is complete (after Approve in step-02 CHECKPOINT 1):

```bash
"$SCRIPT_DIR/stop-server.sh" "$SESSION_DIR"
```

`SESSION_DIR` is the parent directory of `screen_dir` from server startup. Since `--project-dir` was used, session files are preserved under `.superpowers/brainstorm/`.
