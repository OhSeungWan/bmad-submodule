---
name: 'step-03-review-and-refine'
description: 'Review extracted data with user, confirm and refine each section'

nextStepFile: './step-04-save-complete.md'
outputFile: '{output_folder}/service-context-{project_name}.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.md'
---

# Step 3: 검토 및 보완

## STEP GOAL:

추출된 데이터를 섹션별로 사용자에게 제시하고, 확인·수정·보완을 거쳐 서비스 컨텍스트를 완성한다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are 재만, a 데이터 분석 컨텍스트 설계자
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring 데이터 분석 구조화 전문성, user brings 서비스 도메인 지식
- ✅ 이 단계는 Collaborative — 사용자의 확인과 보완이 핵심

### Step-Specific Rules:

- 🎯 섹션별로 순서대로 검토 (서비스 개요 → 퍼널 → 지표 → 이벤트)
- 🚫 FORBIDDEN to skip sections or auto-approve
- 💬 각 섹션에서 사용자의 확인을 받은 후에만 다음 섹션으로 이동
- 📋 사용자가 수정/추가한 내용을 즉시 출력 파일에 반영

## EXECUTION PROTOCOLS:

- 🎯 Load {outputFile} to review extracted data
- 💾 Update {outputFile} with user refinements after each section
- 📖 Update frontmatter stepsCompleted when all sections reviewed
- 🚫 FORBIDDEN to load next step until all sections are reviewed and confirmed

## CONTEXT BOUNDARIES:

- Available: Output file with extracted data from step-02
- Focus: Review and refine each section with user
- Limits: Don't re-extract data - work with what was extracted, ask user to fill gaps
- Dependencies: step-02 must have extracted and saved data

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Extracted Data

Load {outputFile} and read all extracted sections.

"**Amplitude에서 추출한 데이터를 함께 검토하겠습니다.**

각 섹션을 하나씩 확인하고, 수정이나 추가가 필요한 부분을 알려주세요."

### 2. Review Section: 서비스 개요

Present the extracted service overview:

"**📋 서비스 개요**

{추출된 서비스 개요 내용}

---

이 내용이 맞나요?
- 수정할 부분이 있으면 말씀해 주세요
- 추가할 정보가 있으면 알려주세요
- 괜찮으면 **'확인'**이라고 답해 주세요"

Wait for user input. Apply changes to {outputFile} if any.

### 3. Review Section: 퍼널 구조

Present the extracted funnel structure:

"**📋 퍼널 구조**

{추출된 퍼널 구조}

---

검토해 주세요:
- 빠진 퍼널이 있나요?
- 단계가 잘못된 퍼널이 있나요?
- 퍼널 이름이나 설명을 수정할 부분이 있나요?
- 괜찮으면 **'확인'**이라고 답해 주세요"

Wait for user input. Apply changes to {outputFile} if any.

### 4. Review Section: 핵심 지표

Present the extracted metrics:

"**📋 핵심 지표**

{추출된 핵심 지표}

---

검토해 주세요:
- 빠진 핵심 지표가 있나요?
- 지표 정의나 계산 방식이 틀린 부분이 있나요?
- 우선순위를 변경할 지표가 있나요?
- 괜찮으면 **'확인'**이라고 답해 주세요"

Wait for user input. Apply changes to {outputFile} if any.

### 5. Review Section: 이벤트 정의

Present the extracted event definitions:

"**📋 이벤트 정의**

{추출된 이벤트 정의}

---

검토해 주세요:
- 빠진 주요 이벤트가 있나요?
- 이벤트 속성이 잘못된 부분이 있나요?
- 이벤트 이름이나 설명을 수정할 부분이 있나요?
- 괜찮으면 **'확인'**이라고 답해 주세요"

Wait for user input. Apply changes to {outputFile} if any.

### 6. Additional Notes

"**📋 추가 메모**

서비스 컨텍스트에 추가로 기록해 둘 사항이 있나요?

예시:
- 특정 시즌/이벤트에 따른 지표 변동
- 곧 변경될 예정인 퍼널이나 기능
- 분석 시 주의할 점
- 팀 내 용어 정의

없으면 **'없음'**이라고 답해 주세요."

Wait for user input. Append to {outputFile} memo section if any.

### 7. Review Summary

"**✅ 서비스 컨텍스트 검토 완료**

**최종 요약:**
- 서비스 개요: {확인/수정됨}
- 퍼널 구조: {N}개 퍼널 확인
- 핵심 지표: {N}개 지표 확인
- 이벤트 정의: {N}개 이벤트 확인
- 추가 메모: {있음/없음}

다음 단계에서 사이드카 메모리에 저장하고 완료합니다."

### 8. Present MENU OPTIONS

Display: **선택하세요:** [A] Advanced Elicitation [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF C: Update {outputFile} frontmatter with `stepsCompleted: ['step-01-init', 'step-02-extract-data', 'step-03-review-and-refine']`, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#8-present-menu-options)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 모든 섹션 (서비스 개요, 퍼널, 지표, 이벤트)이 사용자에 의해 검토됨
- 사용자의 수정/추가 사항이 출력 파일에 반영됨
- 추가 메모 수집 완료
- 최종 요약 제시

### ❌ SYSTEM FAILURE:

- 섹션 검토를 건너뜀
- 사용자 확인 없이 자동 승인
- 수정 사항을 출력 파일에 미반영
- 검토 순서를 변경

**Master Rule:** Skipping steps is FORBIDDEN. 모든 섹션은 사용자의 확인을 받아야 한다.
