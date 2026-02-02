# Workflow Specification: experiment-design

**Module:** dae
**Type:** Core
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** A/B 테스트 가설 수립 및 실험 계획서 작성

**Description:** 사용자의 목표를 바탕으로 유효한 A/B 테스트 가설을 수립하고, 실험 설계를 돕습니다. 과거 실험 이력과 현재 데이터를 참고하여 최적의 실험 계획을 제안합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: experiment-design
description: 'A/B 테스트 설계 및 가설 수립'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/experiment-design'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | gather-context | 실험 목표 및 배경 수집 |
| 2 | review-history | 관련 과거 실험 이력 검토 |
| 3 | define-hypothesis | 가설 정의 (귀무/대립 가설) |
| 4 | design-experiment | 실험 설계 (변수, 기간, 샘플 크기) |
| 5 | create-plan | 실험 계획서 작성 |

---

## Workflow Inputs

### Required Inputs

- 실험 목표 (무엇을 개선하고 싶은지)
- 대상 퍼널/기능

### Optional Inputs

- 기대 효과 크기
- 실험 기간 제약
- 타겟 세그먼트

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `experiment-plan-{name}-{date}.md` — 실험 계획서

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_experiments, query_experiment, get_charts

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 통계적 유의성을 위한 샘플 크기 계산
2. 과거 유사 실험 결과 참고
3. 실험 설계 시 흔한 실수 방지 가이드

---

_Spec created on 2026-01-27 via BMAD Module workflow_
