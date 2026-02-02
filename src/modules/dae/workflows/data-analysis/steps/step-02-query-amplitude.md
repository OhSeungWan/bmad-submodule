---
name: 'step-02-query-amplitude'
description: 'Amplitude MCP를 통한 데이터 조회'

nextStepFile: './step-03-analyze-data.md'
outputFile: '{output_folder}/analysis-report-{timestamp}.md'
---

# Step 2: 데이터 조회

## STEP GOAL:

Amplitude MCP를 사용하여 Step 1에서 확정된 분석 범위에 맞는 데이터를 조회합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a data analysis expert querying real data
- ✅ Use Amplitude MCP tools precisely and appropriately
- ✅ Explain what you're querying and why
- ✅ Present results clearly for non-technical users

### Step-Specific Rules:

- 🎯 Focus ONLY on data querying - analysis is step 3
- 🚫 FORBIDDEN to interpret or draw conclusions yet
- 💬 Approach: Explain each query before executing
- 📊 Use the most appropriate Amplitude MCP tool for each query

## EXECUTION PROTOCOLS:

- 🎯 Select appropriate Amplitude MCP tools based on question type
- 💾 Append query results to {outputFile} in "데이터 조회 결과" section
- 📖 Document which tools were used and why
- 🚫 Don't analyze - just retrieve and present raw data

## CONTEXT BOUNDARIES:

- Step 1 output is available with confirmed analysis scope
- Amplitude MCP tools are available
- Focus: Getting the right data efficiently
- Limits: Don't over-query - get what's needed
- Dependencies: Analysis scope from Step 1

## AMPLITUDE MCP TOOLS REFERENCE

**데이터 조회:**
- `query_dataset` - 복잡한 데이터 쿼리 (Events Segmentation, Funnels, Retention, Sessions)
- `query_chart` - 기존 차트 데이터 조회
- `query_charts` - 여러 차트 동시 조회 (최대 3개)

**컨텐츠 조회:**
- `search` - 대시보드, 차트, 이벤트, 속성 검색
- `get_charts` - 차트 정의 조회
- `get_dashboard` - 대시보드 조회
- `get_event_properties` - 이벤트 속성 조회
- `get_context` - 프로젝트 정보

**쿼리 유형별 가이드:**
- **트렌드 분석:** `query_dataset` with type: "eventsSegmentation"
- **퍼널 분석:** `query_dataset` with type: "funnels"
- **리텐션 분석:** `query_dataset` with type: "retention"
- **세션 분석:** `query_dataset` with type: "sessions"

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Review Analysis Scope

Load {outputFile} and review the confirmed scope from Step 1:

"**Step 1에서 확정된 분석 범위를 확인합니다:**

| 항목 | 내용 |
|------|------|
| **질문** | {question from output} |
| **기간** | {analysis_period} |
| **핵심 지표** | {key metrics} |

이 범위에 맞는 데이터를 조회하겠습니다."

### 2. Plan Query Strategy

Based on the question type, plan the queries:

"**쿼리 전략:**

이 질문에 답하기 위해 다음 데이터를 조회하겠습니다:

1. **{Query 1}** - {why this query is needed}
   - Tool: `{amplitude_tool}`
   - Parameters: {brief description}

2. **{Query 2}** - {why this query is needed} (if needed)
   - Tool: `{amplitude_tool}`
   - Parameters: {brief description}

진행할까요?"

Wait for user confirmation before executing queries.

### 3. Execute Queries

**For each planned query:**

"**쿼리 실행 중:** {query description}..."

Execute the Amplitude MCP tool with appropriate parameters.

**After each query completes:**

"**결과:**
{Present raw data in clear format - tables, lists, or key numbers}

**조회 완료.** 다음 쿼리를 실행합니다." (if more queries)

### 4. Summarize Retrieved Data

After all queries complete:

"**데이터 조회 완료!**

**조회된 데이터 요약:**

| 쿼리 | 결과 요약 |
|------|----------|
| {Query 1} | {brief result} |
| {Query 2} | {brief result} |

**사용된 도구:**
- {tool 1}: {purpose}
- {tool 2}: {purpose}

이 데이터를 기반으로 분석을 진행하겠습니다."

### 5. Update Output File

Append to {outputFile} in the "데이터 조회 결과" section:

```markdown
## 데이터 조회 결과

### 조회된 데이터 요약

{Summary of all retrieved data}

### 주요 지표

| 지표 | 값 | 변화 |
|------|-----|------|
| {metric 1} | {value} | {change if applicable} |
| {metric 2} | {value} | {change if applicable} |

### 쿼리 상세

**Query 1: {name}**
- Tool: {tool used}
- Period: {date range}
- Result: {detailed result}

**Query 2: {name}** (if applicable)
- Tool: {tool used}
- Period: {date range}
- Result: {detailed result}
```

### 6. Present MENU OPTIONS

Display:

"**데이터 조회가 완료되었습니다.**

**[C]** 분석 진행 - 조회된 데이터 분석으로 이동
**[M]** 추가 조회 - 다른 데이터도 필요함
**[R]** 재조회 - 다른 방식으로 다시 조회

선택해 주세요:"

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can request additional queries

#### Menu Handling Logic:

- IF C: Confirm output file is updated, then load, read entire file, then execute {nextStepFile}
- IF M: Ask what additional data is needed, execute additional queries, update output, redisplay menu
- IF R: Discuss what to change, re-execute queries, update output, redisplay menu
- IF Any other: Help user respond, then redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN 'C' is selected and all query results are saved to output will you load {nextStepFile} to begin data analysis.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Appropriate Amplitude MCP tools selected
- Queries executed successfully
- Raw data retrieved and documented
- Results clearly presented to user
- Output file updated with query results
- User confirms data is sufficient

### ❌ SYSTEM FAILURE:

- Analyzing data instead of just querying
- Drawing conclusions prematurely
- Not documenting which tools were used
- Executing queries without explaining why
- Proceeding without user confirmation

**Master Rule:** Query first, analyze second. This step retrieves data - interpretation happens in Step 3.
