# Workflow Specification: risk-monitoring

**Module:** dae
**Type:** Feature
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 이상 징후 감지 및 선제적 알림

**Description:** 주요 지표의 이상 징후를 모니터링하고, 위험 신호가 감지되면 선제적으로 알립니다. 자동 모니터링 설정도 지원합니다.

**Workflow Type:** Non-document (Interactive + Alert)

---

## Workflow Structure

### Entry Point

```yaml
---
name: risk-monitoring
description: '이상 징후 감지 및 알림'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/risk-monitoring'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | check-status | 현재 주요 지표 상태 확인 |
| 2 | detect-anomalies | 이상 징후 감지 |
| 3 | analyze-cause | 원인 분석 |
| 4 | alert-and-recommend | 알림 및 대응 방안 제안 |

---

## Workflow Inputs

### Required Inputs

- 없음 (자동 실행 가능)

### Optional Inputs

- 특정 지표 포커스
- 알림 임계값 설정
- 모니터링 기간

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document (대화형 알림)

### Output Files

- 없음 (필요시 report-generation으로 문서화)

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_charts, query_dataset

### Module Config

- `enable_proactive_alerts` 변수 참조

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 통계적 이상 감지 (표준편차, 추세 이탈)
2. 심각도에 따른 알림 수준 차등화
3. 오탐(false positive) 최소화

---

_Spec created on 2026-01-27 via BMAD Module workflow_
