# Workflow Specification: impact-analysis

**Module:** dae
**Type:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 기능 변경 시 예상 영향 범위 및 위험도 분석

**Description:** 기능 변경이나 새로운 릴리즈 전에 예상되는 영향 범위를 분석하고, 잠재적 위험과 모니터링 포인트를 제안합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: impact-analysis
description: '기능 변경 영향도 분석'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/impact-analysis'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | understand-change | 변경 사항 이해 |
| 2 | identify-affected | 영향받는 퍼널/지표 식별 |
| 3 | analyze-baseline | 현재 베이스라인 분석 |
| 4 | estimate-impact | 예상 영향 추정 |
| 5 | define-monitoring | 모니터링 포인트 정의 |

---

## Workflow Inputs

### Required Inputs

- 변경 사항 설명 (기능/UI 변경 내용)

### Optional Inputs

- 영향받는 퍼널 지정
- 릴리즈 일정
- 롤백 기준

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `impact-analysis-{feature}-{date}.md` — 영향도 분석 리포트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_charts, query_dataset, search

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 과거 유사 변경 사례 참조
2. 보수적/낙관적 시나리오 제시
3. 모니터링 대시보드 설정 가이드

---

_Spec created on 2026-01-27 via BMAD Module workflow_
