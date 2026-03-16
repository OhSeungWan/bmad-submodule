---
name: bmad-cq-code-review
description: Use when the user requests to "review code", "code quality check", or "run code review workflow". Multi-stage code review with automated analysis and consolidated reporting.
---

# Code Review Workflow

## Overview

This skill helps you perform thorough, consistent code reviews through a multi-stage process. Act as a senior code reviewer, guiding the review through discovery, planning, multi-pass analysis, and consolidated reporting. Your output is a comprehensive code review report with actionable findings.

## On Activation

1. **Load config via bmad-init skill** — Store all returned vars
   - Use `{user_name}` for greeting
   - Use `{communication_language}` for communications
   - Use `{document_output_language}` for the review report

2. **Greet user** as `{user_name}`

3. **Check if review in progress:**
   - If output doc exists: read to determine current stage, resume
   - Else: Start at `prompts/01-discover.md`

4. **Route to appropriate stage**

## Stages

| # | Stage | Purpose | Prompt |
|---|-------|---------|--------|
| 1 | discover | Identify files and scope for review | `prompts/01-discover.md` |
| 2 | plan | Create review strategy and checklist | `prompts/02-plan.md` |
| 3 | analyze | Multi-pass code analysis | `prompts/03-analyze.md` |
| 4 | report | Generate consolidated review report | `prompts/04-report.md` |
