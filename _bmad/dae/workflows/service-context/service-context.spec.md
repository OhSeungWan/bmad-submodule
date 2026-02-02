# Workflow Specification: service-context

**Module:** dae
**Type:** Utility
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 서비스 맥락 설정 — 퍼널 구조, 주요 지표 정의 학습

**Description:** 서비스의 퍼널 구조, 주요 지표, 이벤트 정의를 학습하여 에이전트의 사이드카 메모리에 저장합니다. 이후 분석에서 맥락을 활용합니다.

**Workflow Type:** Configuration (Memory Update)

---

## Workflow Structure

### Entry Point

```yaml
---
name: service-context
description: '서비스 컨텍스트 설정'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/service-context'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | gather-service-info | 서비스 정보 수집 |
| 2 | map-funnels | 주요 퍼널 매핑 |
| 3 | define-metrics | 핵심 지표 정의 |
| 4 | save-context | 사이드카 메모리에 저장 |

---

## Workflow Inputs

### Required Inputs

- 서비스 설명 또는 Amplitude 프로젝트 정보

### Optional Inputs

- 퍼널 정의 문서
- 지표 정의 문서
- 기존 대시보드 참조

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document (메모리 업데이트)

### Output Files

- 사이드카 메모리 업데이트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### MCP Tools

- Amplitude MCP: get_charts, get_event_properties, search

### Sidecar Memory

이 워크플로우는 에이전트의 사이드카 메모리를 업데이트합니다:
- 퍼널 구조
- 주요 지표 및 정의
- 서비스 맥락

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 최초 1회 실행 또는 서비스 변경 시 재실행
2. Amplitude에서 자동 추출 가능한 정보 활용
3. 사용자 입력과 자동 추출 병행

---

_Spec created on 2026-01-27 via BMAD Module workflow_
