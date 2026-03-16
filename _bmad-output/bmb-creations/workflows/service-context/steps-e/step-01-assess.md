---
name: 'step-01-assess'
description: 'Load existing service context and assess what needs updating'

nextStepFile: './step-02-update.md'
outputFile: '{output_folder}/service-context-{project_name}.md'
sidecarMemoryPath: '{project-root}/_bmad/_memory/data-analyst-sidecar/memories.md'
conversionStep: '../steps-c/step-01-init.md'
---

# Step 1: 변경 사항 평가

## STEP GOAL:

기존 서비스 컨텍스트 문서를 로드하고, 사용자에게 변경 사항을 파악하여 업데이트 범위를 결정한다.

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
- ✅ Collaborative — 사용자와 함께 변경 범위를 파악

### Step-Specific Rules:

- 🎯 기존 컨텍스트 로드 및 변경 범위 파악만 수행
- 🚫 FORBIDDEN to modify data yet - that comes in step-02
- 💬 사용자에게 구체적인 변경 사항을 질문

## EXECUTION PROTOCOLS:

- 🎯 Load existing output file and sidecar memory
- 💾 Document change scope for step-02
- 🚫 FORBIDDEN to load next step until change scope is confirmed

## CONTEXT BOUNDARIES:

- Available: Existing output file, sidecar memory
- Focus: Assess what changed, not how to fix it
- Dependencies: Service context must have been created previously

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Locate and Load Existing Context

Search for existing service context files matching pattern `service-context-*.md` in output folder.

**If no existing context found:**

"**기존 서비스 컨텍스트를 찾을 수 없습니다.**

생성 모드(-c)로 먼저 서비스 컨텍스트를 설정해 주세요.

생성 모드로 전환하시겠습니까? [Y] 예 / [N] 아니오"

- IF Y: Load, read entire file, then execute {conversionStep}
- IF N: End workflow

**If multiple contexts found:**
Present list and ask user to select.

**If one context found:**
Load and continue.

### 2. Present Current Context Summary

"**현재 서비스 컨텍스트:**

**프로젝트:** {project_name}
**설정일:** {date}

**퍼널:** {퍼널 수}개
{퍼널 이름 목록}

**핵심 지표:** {지표 수}개
{지표 이름 목록}

**이벤트:** {이벤트 수}개"

### 3. Identify Changes

"**어떤 변경 사항이 있나요?**

해당하는 항목을 모두 선택해 주세요:

**[1]** 서비스 개요 변경 (서비스 설명, 주요 사용자 유형 등)
**[2]** 퍼널 변경 (새 퍼널 추가, 기존 퍼널 수정/삭제)
**[3]** 지표 변경 (새 지표 추가, 기존 지표 수정/삭제)
**[4]** 이벤트 변경 (새 이벤트 추가, 기존 이벤트 수정/삭제)
**[5]** 전체 재설정 (대부분 변경됨 — 생성 모드 추천)

여러 항목은 쉼표로 구분해 주세요 (예: 2,3)"

Wait for user input.

**IF 5 selected:**
"변경 사항이 많으시군요. 생성 모드(-c)로 처음부터 다시 설정하시는 걸 추천합니다. 전환하시겠습니까?"
- IF Y: Load, read entire file, then execute {conversionStep}
- IF N: Continue with selected sections

### 4. Detail Each Change

For each selected change area, ask specifics:

**If 1 (서비스 개요):**
"서비스 개요에서 구체적으로 무엇이 변경되었나요?"

**If 2 (퍼널):**
"퍼널 변경 사항을 알려주세요:
- 새로 추가된 퍼널이 있나요?
- 수정된 퍼널이 있나요? (어떤 단계가 변경?)
- 삭제된 퍼널이 있나요?"

**If 3 (지표):**
"지표 변경 사항을 알려주세요:
- 새로 추가된 지표가 있나요?
- 정의나 계산 방식이 변경된 지표가 있나요?
- 더 이상 추적하지 않는 지표가 있나요?"

**If 4 (이벤트):**
"이벤트 변경 사항을 알려주세요:
- 새로 추가된 이벤트가 있나요?
- 속성이 변경된 이벤트가 있나요?
- 삭제된 이벤트가 있나요?"

Wait for user input on each selected area.

### 5. Confirm Change Scope

"**변경 범위 확인:**

{변경 영역별 요약}

이 범위가 맞나요? 다음 단계에서 Amplitude 데이터를 재추출하고 업데이트하겠습니다."

### 6. Present MENU OPTIONS

Display: **선택하세요:** [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

#### Menu Handling Logic:

- IF C: Update {outputFile} frontmatter to record edit session start, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#6-present-menu-options)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 기존 서비스 컨텍스트 로드 완료
- 변경 영역 파악 완료
- 각 변경 영역의 구체적 내용 수집
- 변경 범위 사용자 확인

### ❌ SYSTEM FAILURE:

- 기존 컨텍스트 없이 진행
- 변경 사항 파악 없이 업데이트 시작
- 사용자 확인 없이 범위 결정

**Master Rule:** Skipping steps is FORBIDDEN. 변경 범위를 정확히 파악한 후에만 업데이트한다.
