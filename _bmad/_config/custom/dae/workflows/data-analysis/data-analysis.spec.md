# Workflow Specification: data-analysis

**Module:** dae
**Type:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** Amplitude 데이터 조회 및 분석을 통해 사용자 질문에 데이터 기반 답변 제공

**Description:** 사용자의 데이터 관련 질문을 받아 Amplitude MCP를 통해 실제 데이터를 조회하고, 분석 결과를 쉽게 이해할 수 있는 형태로 제공합니다.

**Workflow Type:** Interactive Analysis

---

## Workflow Structure

### Entry Point

```yaml
---
name: data-analysis
description: 'Amplitude 데이터 조회 및 분석'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/data-analysis'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | understand-question | 사용자 질문 이해 및 분석 범위 확정 |
| 2 | query-amplitude | Amplitude MCP를 통한 데이터 조회 |
| 3 | analyze-data | 조회된 데이터 분석 |
| 4 | present-results | 결과를 사용자 수준에 맞게 설명 |

---

## Workflow Inputs

### Required Inputs

- 사용자 질문 (자연어)

### Optional Inputs

- 분석 기간 (date range)
- 특정 이벤트/지표 지정
- 세그먼트 필터

---

## Workflow Outputs

### Output Format

- [x] Non-document (대화형 답변)
- [ ] Document-producing

### Output Files

- 없음 (대화형 응답)
- 필요시 report-generation 워크플로우로 연계

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_charts, query_chart, query_dataset, search

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 사용자 스킬 레벨에 따른 설명 수준 조절
2. Amplitude MCP 도구 적절히 선택 (차트 vs 데이터셋)
3. 복잡한 분석은 단계별로 나눠서 설명

---

_Spec created on 2026-01-27 via BMAD Module workflow_
