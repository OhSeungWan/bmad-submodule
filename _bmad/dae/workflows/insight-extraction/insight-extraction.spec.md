# Workflow Specification: insight-extraction

**Module:** dae
**Type:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 과거 실험 및 데이터에서 패턴과 인사이트 발견

**Description:** 특정 퍼널이나 기능에 대한 과거 데이터와 실험 결과를 종합 분석하여 의미 있는 패턴과 인사이트를 도출합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: insight-extraction
description: '과거 데이터에서 패턴/인사이트 발견'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/insight-extraction'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | define-scope | 분석 범위 정의 (퍼널/기능/기간) |
| 2 | gather-data | 관련 데이터 수집 |
| 3 | analyze-patterns | 패턴 분석 |
| 4 | extract-insights | 인사이트 도출 |
| 5 | create-report | 인사이트 리포트 작성 |

---

## Workflow Inputs

### Required Inputs

- 분석 대상 (퍼널명 또는 기능명)

### Optional Inputs

- 분석 기간
- 특정 세그먼트
- 비교 대상

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `insight-report-{target}-{date}.md` — 인사이트 리포트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_experiments, query_charts, search

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 데이터 기반 인사이트 vs 추측 명확히 구분
2. 액션 가능한 인사이트 도출
3. 시각적 증거 포함

---

_Spec created on 2026-01-27 via BMAD Module workflow_
