# Workflow Specification: report-generation

**Module:** dae
**Type:** Utility
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** 분석 결과를 마크다운 또는 PDF 리포트로 문서화

**Description:** 대화형 분석 결과나 다른 워크플로우의 결과물을 정리된 리포트 형태로 문서화합니다.

**Workflow Type:** Document-producing

---

## Workflow Structure

### Entry Point

```yaml
---
name: report-generation
description: '분석 결과 문서화'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/report-generation'
---
```

### Mode

- [x] Create-only (steps/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | gather-content | 리포트 내용 수집 |
| 2 | select-template | 리포트 템플릿 선택 |
| 3 | generate-report | 리포트 생성 |
| 4 | save-report | 리포트 저장 |

---

## Workflow Inputs

### Required Inputs

- 리포트 내용 (분석 결과, 인사이트)

### Optional Inputs

- 리포트 제목
- 리포트 형식 (마크다운/PDF)
- 대상 독자

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `{analysis_output_folder}/report-{title}-{date}.md` — 분석 리포트

---

## Agent Integration

### Primary Agent

재만 (data-analyst)

### Module Config

- `analysis_output_folder` 변수 참조

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

Key considerations:
1. 다양한 리포트 템플릿 지원
2. 이전 분석 세션 내용 활용 가능
3. 시각적 요소 (차트, 테이블) 포함

---

_Spec created on 2026-01-27 via BMAD Module workflow_
