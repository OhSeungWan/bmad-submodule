---
name: 'step-02-extract-data'
description: 'Extract service data from Amplitude using parallel sub-agents'

nextStepFile: './step-03-review-and-refine.md'
outputFile: '{output_folder}/service-context-{project_name}.md'
queryPatternsData: '../data/amplitude-query-patterns.md'
---

# Step 2: 데이터 추출

## STEP GOAL:

Amplitude MCP를 통해 서비스 기본 정보, 퍼널/차트 구조, 이벤트/지표 후보를 병렬 추출하고 출력 파일에 저장한다.

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
- ✅ You bring Amplitude 데이터 추출 전문성
- ✅ 이 단계는 주로 자동 추출 (Mostly Autonomous)

### Step-Specific Rules:

- 🎯 Pattern 4 (Parallel Execution) — 3개 Sub-Agent 병렬 실행
- 💬 Sub-Agent는 구조화된 결과만 반환 (전체 데이터 아님)
- ⚙️ Sub-Agent 사용 불가 시 메인 스레드에서 순차 실행
- 🚫 FORBIDDEN to ask user to confirm data at this stage - that comes in step-03

## EXECUTION PROTOCOLS:

- 🎯 Load {queryPatternsData} for Amplitude query patterns
- 💾 Append extracted data to {outputFile} sections
- 📖 Update frontmatter stepsCompleted when complete
- 🚫 FORBIDDEN to load next step until extraction is complete and user selects 'C'

## CONTEXT BOUNDARIES:

- Available: Amplitude MCP (get_context, get_charts, get_event_properties, search), output file from step-01
- Focus: Data extraction only - no analysis or interpretation yet
- Limits: Extract raw data, don't make judgment calls about what's important
- Dependencies: step-01 must have selected a project and created output file

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Query Patterns

Load {queryPatternsData} for reference on which Amplitude MCP calls to make.

### 2. Execute Parallel Data Extraction

"**Amplitude에서 서비스 데이터를 추출합니다...**"

Launch subprocesses in parallel:

**Sub-Agent A: 서비스 기본 정보**
1. Use `get_project_context` with selected project ID
2. Extract: 프로젝트 이름, 주요 이벤트 목록, 프로젝트 메타데이터
3. Return structured findings to parent

**Sub-Agent B: 퍼널/차트 구조**
1. Use `get_charts` to retrieve existing charts
2. Use `search` with funnel-related keywords
3. Extract: 퍼널 차트 구조, 단계별 이벤트, 차트 이름/설명
4. Return structured findings to parent

**Sub-Agent C: 이벤트/지표 후보**
1. Use `get_event_properties` to retrieve event properties
2. Use `search` to find metric-related events
3. Extract: 주요 이벤트 및 속성, 지표 후보, 이벤트 간 관계
4. Return structured findings to parent

**⚙️ Fallback (Sub-Agent 사용 불가 시):**
메인 스레드에서 순차 실행:
1. `get_project_context` → 프로젝트 정보
2. `get_charts` + `search` → 차트/퍼널 추출
3. `get_event_properties` + `search` → 이벤트/지표 추출

### 3. Aggregate Results

Aggregate findings from all sub-agents (or sequential execution).

Organize into sections:
- **서비스 개요:** 프로젝트 정보, 서비스 설명 (step-01에서 수집)
- **퍼널 구조:** 발견된 퍼널과 단계
- **핵심 지표:** 식별된 지표 후보
- **이벤트 정의:** 주요 이벤트와 속성

### 4. Write to Output File

Append aggregated data to {outputFile}:
- Replace placeholder sections with extracted data
- Keep raw extracted form - refinement happens in step-03

"**✅ 데이터 추출 완료**

**추출 결과 요약:**
- 서비스 정보: {추출된 항목 수}
- 퍼널/차트: {발견된 퍼널 수}개
- 이벤트: {추출된 이벤트 수}개
- 지표 후보: {식별된 지표 수}개

다음 단계에서 추출된 데이터를 함께 검토하고 보완하겠습니다."

### 5. Present MENU OPTIONS

Display: **선택하세요:** [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

#### Menu Handling Logic:

- IF C: Update {outputFile} frontmatter with `stepsCompleted: ['step-01-init', 'step-02-extract-data']`, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#5-present-menu-options)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Amplitude MCP를 통해 데이터 추출 완료
- 서비스 정보, 퍼널, 이벤트, 지표 후보 모두 추출
- 출력 파일에 추출 결과 저장
- Sub-Agent 병렬 실행 (또는 fallback 순차 실행)

### ❌ SYSTEM FAILURE:

- Amplitude 데이터 추출 누락
- 출력 파일에 결과 미저장
- 사용자에게 이 단계에서 확인 요청 (step-03에서 할 것)
- Sub-Agent 실패 시 fallback 미실행

**Master Rule:** Skipping steps is FORBIDDEN. 이 단계는 추출만 수행하고, 검토는 다음 단계에서 한다.
