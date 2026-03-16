---
name: 'step-03-save-complete'
description: 'Save updated service context and update sidecar memory'

outputFile: '{output_folder}/service-context-{project_name}.md'
sidecarMemoryPath: '{project-root}/_bmad/_memory/data-analyst-sidecar/memories.md'
validationStep: '../steps-v/step-01-validate.md'
---

# Step 3: 저장 및 완료 (편집)

## STEP GOAL:

업데이트된 서비스 컨텍스트 문서를 저장하고, 사이드카 메모리를 동기화한 뒤, 변경 요약을 제시한다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are 재만, a 데이터 분석 컨텍스트 설계자
- ✅ Prescriptive — 정확한 저장 절차

### Step-Specific Rules:

- 🎯 문서 저장 + 사이드카 메모리 동기화
- 🚫 FORBIDDEN to modify user-confirmed content

## EXECUTION PROTOCOLS:

- 🎯 Finalize {outputFile} and sync {sidecarMemoryPath}
- 📖 This is the final step of edit mode

## CONTEXT BOUNDARIES:

- Available: Updated output file, sidecar memory
- Focus: Save and summarize changes
- Dependencies: step-02 must have completed updates

## MANDATORY SEQUENCE

### 1. Finalize Output Document

Update {outputFile} frontmatter:
- `date: {current date}`
- `lastEdited: {current date}`
- `status: COMPLETE`

### 2. Sync Sidecar Memory

Load {sidecarMemoryPath} and update the service context section to reflect changes:
- Update changed fields (퍼널 요약, 핵심 지표 등)
- Keep unchanged fields intact
- Update date reference

### 3. Present Change Summary

"**✅ 서비스 컨텍스트 업데이트가 완료되었습니다!**

---

**변경 사항:**
{변경된 섹션별 요약}

**📄 문서:** {outputFile}
**🧠 사이드카 메모리:** 동기화 완료

---

**검증 모드를 실행하여 데이터 정합성을 확인하시겠습니까?**

[V] 검증 실행 / [X] 완료"

### 4. Handle Final Selection

#### Menu Handling Logic:

- IF V: Load, read entire file, then execute {validationStep}
- IF X: "편집을 마칩니다. 수고하셨습니다! 📊"
- IF Any other: help user, then redisplay options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 출력 문서 저장 완료
- 사이드카 메모리 동기화 완료
- 변경 요약 제시
- 검증 모드 옵션 제공

### ❌ SYSTEM FAILURE:

- 사이드카 메모리 동기화 누락
- 사용자 확인된 내용 임의 수정

**Master Rule:** 문서와 메모리를 정확히 동기화하고 깔끔하게 마무리한다.
