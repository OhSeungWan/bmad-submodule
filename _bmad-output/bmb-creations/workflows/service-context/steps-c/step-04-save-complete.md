---
name: 'step-04-save-complete'
description: 'Finalize service context document and update sidecar memory'

outputFile: '{output_folder}/service-context-{project_name}.md'
sidecarMemoryPath: '{project-root}/_bmad/_memory/data-analyst-sidecar/memories.md'
validationStep: '../steps-v/step-01-validate.md'
---

# Step 4: 저장 및 완료

## STEP GOAL:

서비스 컨텍스트 문서를 최종 정리하고, 사이드카 메모리를 업데이트한 뒤, 결과를 요약한다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are 재만, a 데이터 분석 컨텍스트 설계자
- ✅ 마무리 단계 — 정확하고 깔끔하게 저장

### Step-Specific Rules:

- 🎯 문서 최종 정리 + 사이드카 메모리 업데이트
- 🚫 FORBIDDEN to modify content that user already confirmed in step-03
- 💬 Prescriptive — 정확한 저장 절차를 따른다

## EXECUTION PROTOCOLS:

- 🎯 Follow MANDATORY SEQUENCE exactly
- 💾 Finalize {outputFile} and update {sidecarMemoryPath}
- 📖 This is the final step - mark workflow complete

## CONTEXT BOUNDARIES:

- Available: Completed output file from step-03, sidecar memory path
- Focus: Save and summarize only
- Limits: Do NOT modify user-confirmed content
- Dependencies: step-03 must have completed all section reviews

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Finalize Output Document

Load {outputFile} and perform final cleanup:

1. Ensure all sections have content (no placeholders remaining)
2. Update frontmatter:
   - `stepsCompleted: ['step-01-init', 'step-02-extract-data', 'step-03-review-and-refine', 'step-04-save-complete']`
   - `lastStep: 'step-04-save-complete'`
   - `date: {current date}`
   - `status: COMPLETE`
3. Save {outputFile}

### 2. Update Sidecar Memory

Load {sidecarMemoryPath} and update with service context summary:

**Append or update the service context section:**

```markdown
## 서비스 컨텍스트

**프로젝트:** {project_name}
**설정일:** {current date}
**문서 경로:** {outputFile}

### 퍼널 요약
{주요 퍼널 목록 — 이름과 핵심 단계만}

### 핵심 지표
{주요 지표 목록 — 이름과 간단한 정의만}

### 분석 시 참고
{추가 메모에서 핵심 사항만}
```

**Important:** 사이드카 메모리에는 요약만 저장한다. 상세 내용은 서비스 컨텍스트 문서를 참조하도록 경로를 포함한다.

Save {sidecarMemoryPath}.

### 3. Present Completion Summary

"**✅ 서비스 컨텍스트 설정이 완료되었습니다!**

---

**📄 서비스 컨텍스트 문서**
- 경로: {outputFile}
- 포함 내용: 서비스 개요, 퍼널 구조, 핵심 지표, 이벤트 정의, 메모

**🧠 사이드카 메모리 업데이트**
- 경로: {sidecarMemoryPath}
- 포함 내용: 퍼널 요약, 핵심 지표, 분석 참고사항

---

**이후 활용 방법:**
- 데이터 분석 시 재만 에이전트가 자동으로 이 컨텍스트를 참조합니다
- 서비스가 변경되면 **편집 모드(-e)**로 업데이트하세요
- 정기적으로 **검증 모드(-v)**로 데이터 정합성을 확인하세요

---

**검증 모드를 바로 실행하시겠습니까?**

[V] 검증 실행 / [X] 완료"

### 4. Handle Final Selection

#### Menu Handling Logic:

- IF V: Load, read entire file, then execute {validationStep}
- IF X: "서비스 컨텍스트 설정을 마칩니다. 수고하셨습니다! 📊"
- IF Any other: help user, then redisplay options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 서비스 컨텍스트 문서 최종 저장 완료
- 사이드카 메모리 업데이트 완료
- frontmatter에 완료 상태 기록
- 사용자에게 결과 요약 및 후속 안내 제시
- 검증 모드 실행 옵션 제공

### ❌ SYSTEM FAILURE:

- 사이드카 메모리 업데이트 누락
- 출력 문서에 placeholder 잔존
- frontmatter 완료 상태 미기록
- 사용자 확인된 내용 임의 수정

**Master Rule:** 이것이 최종 스텝이다. 문서와 메모리를 정확히 저장하고 깔끔하게 마무리한다.
