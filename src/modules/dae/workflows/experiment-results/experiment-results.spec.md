# Workflow Specification: experiment-results

**Module:** dae
**Type:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** A/B 테스트 결과 해석 및 인사이트 도출

**Description:** 완료된 A/B 테스트 결과를 분석하여 통계적 유의성, 실질적 효과, 그리고 다음 액션을 제안합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: experiment-results
description: 'A/B 테스트 결과 해석'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/experiment-results'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | load-experiment | 실험 데이터 로드 |
| 2 | check-validity | 실험 유효성 검증 (샘플 크기, 기간) |
| 3 | analyze-results | 결과 분석 (p-value, 효과 크기) |
| 4 | interpret-findings | 결과 해석 및 인사이트 |
| 5 | recommend-actions | 다음 액션 제안 |

---

## Workflow Inputs

### Required Inputs

- 실험 ID 또는 실험명

### Optional Inputs

- 추가 분석 세그먼트
- 특정 메트릭 포커스

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `experiment-results-{name}-{date}.md` — 실험 결과 리포트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_experiments, query_experiment

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 통계적 유의성 설명 (비전문가 이해 가능하게)
2. 실질적 효과 크기 vs 통계적 유의성 구분
3. 실험 유효성 문제 감지 및 경고

---

_Spec created on 2026-01-27 via BMAD Module workflow_
