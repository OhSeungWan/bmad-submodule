# Workflow Specification: funnel-analysis

**Module:** dae
**Type:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 특정 퍼널의 심층 분석 — 전환율, 병목, 개선 제안

**Description:** 특정 퍼널을 지정하면 각 단계별 전환율, 이탈 지점, 병목 현상을 분석하고 개선 방안을 제안합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: funnel-analysis
description: '특정 퍼널 심층 분석'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/funnel-analysis'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | identify-funnel | 분석할 퍼널 확인 |
| 2 | map-stages | 퍼널 단계 매핑 |
| 3 | analyze-conversions | 단계별 전환율 분석 |
| 4 | identify-bottlenecks | 병목 지점 식별 |
| 5 | generate-recommendations | 개선 제안 생성 |

---

## Workflow Inputs

### Required Inputs

- 퍼널명 또는 퍼널 정의 (이벤트 시퀀스)

### Optional Inputs

- 분석 기간
- 비교 기간 (전주, 전월 등)
- 세그먼트 필터

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `funnel-analysis-{name}-{date}.md` — 퍼널 분석 리포트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_charts, query_chart, query_dataset

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 단계별 전환율과 이탈율 시각화
2. 세그먼트별 퍼널 비교 기능
3. 과거 실험 결과와 연계한 제안

---

_Spec created on 2026-01-27 via BMAD Module workflow_
