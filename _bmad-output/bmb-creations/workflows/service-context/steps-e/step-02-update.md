---
name: 'step-02-update'
description: 'Re-extract changed data from Amplitude and update with user confirmation'

nextStepFile: './step-03-save-complete.md'
outputFile: '{output_folder}/service-context-{project_name}.md'
queryPatternsData: '../data/amplitude-query-patterns.md'
---

# Step 2: 데이터 업데이트

## STEP GOAL:

변경된 영역에 대해 Amplitude에서 데이터를 재추출하고, 사용자 확인을 거쳐 서비스 컨텍스트를 업데이트한다.

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
- ✅ Mixed — 재추출은 autonomous, 확인은 collaborative

### Step-Specific Rules:

- 🎯 변경된 영역만 재추출 (전체 재추출 아님)
- 💬 재추출 결과를 사용자에게 제시하고 확인
- 🚫 FORBIDDEN to modify sections that weren't identified for change in step-01

## EXECUTION PROTOCOLS:

- 🎯 Load {queryPatternsData} for Amplitude query patterns
- 💾 Update only changed sections in {outputFile}
- 📖 Update frontmatter when complete
- 🚫 FORBIDDEN to load next step until all changes confirmed

## CONTEXT BOUNDARIES:

- Available: Output file, change scope from step-01, Amplitude MCP
- Focus: Re-extract and update changed sections only
- Limits: Don't touch unchanged sections
- Dependencies: step-01 must have identified change scope

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Load Change Scope

Load {outputFile} and recall change scope from step-01.

"**변경 영역에 대해 Amplitude 데이터를 재추출합니다.**

변경 영역: {변경 영역 목록}"

### 2. Re-Extract Changed Data

For each changed area, use appropriate Amplitude MCP calls:

**서비스 개요 변경 시:**
- Use `get_project_context` for updated project info

**퍼널 변경 시:**
- Use `get_charts` + `search` for updated funnel/chart data

**지표 변경 시:**
- Use `get_event_properties` + `search` for updated metrics

**이벤트 변경 시:**
- Use `get_event_properties` for updated event data

**Sub-Agent 사용 가능 시:** 여러 영역이 변경되었다면 병렬 추출 가능
**⚙️ Fallback:** 메인 스레드에서 순차 실행

"**✅ 재추출 완료**"

### 3. Present Changes for Confirmation

For each changed section, present old vs new:

"**{섹션 이름} 업데이트:**

**기존:**
{기존 내용 요약}

**변경 후:**
{재추출 + 사용자 입력 반영 내용}

이 업데이트가 맞나요? 추가 수정이 필요하면 말씀해 주세요.
괜찮으면 **'확인'**이라고 답해 주세요."

Wait for user confirmation on each section. Apply additional changes if requested.

### 4. Update Output File

Update only the changed sections in {outputFile}:
- Replace changed section content
- Keep unchanged sections intact
- Update `date` in frontmatter to current date

"**✅ 서비스 컨텍스트가 업데이트되었습니다.**

**변경된 섹션:** {변경 섹션 목록}
**변경되지 않은 섹션:** {유지된 섹션 목록}"

### 5. Present MENU OPTIONS

Display: **선택하세요:** [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

#### Menu Handling Logic:

- IF C: Update {outputFile} frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#5-present-menu-options)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 변경된 영역만 재추출 완료
- 기존 vs 변경 비교 제시
- 사용자 확인 완료
- 출력 파일 해당 섹션만 업데이트
- 미변경 섹션 보존

### ❌ SYSTEM FAILURE:

- 미변경 섹션 임의 수정
- 사용자 확인 없이 업데이트
- 전체 재추출 (변경된 부분만 해야 함)

**Master Rule:** Skipping steps is FORBIDDEN. 변경된 영역만 정확히 업데이트한다.
