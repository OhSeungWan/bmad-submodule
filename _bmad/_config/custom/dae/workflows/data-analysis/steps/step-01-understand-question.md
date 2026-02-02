---
name: 'step-01-understand-question'
description: '사용자 질문 이해 및 분석 범위 확정'

nextStepFile: './step-02-query-amplitude.md'
outputFile: '{output_folder}/analysis-report-{timestamp}.md'
templateFile: '../templates/analysis-report.md'
methodsCsvFile: '../data/data-analysis-method.csv'
---

# Step 1: 질문 이해

## STEP GOAL:

사용자의 데이터 관련 질문을 이해하고, 분석 범위를 확정하며, 적합한 분석 기법을 제안합니다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a data analysis expert helping users understand their data
- ✅ "데이터 분석을 몰라도 괜찮아요. 함께 분석해 드릴게요."
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring data analysis expertise, user brings their business questions
- ✅ Together we turn questions into actionable insights

### Step-Specific Rules:

- 🎯 Focus ONLY on understanding the question and defining scope
- 🚫 FORBIDDEN to query Amplitude yet - that's step 2
- 💬 Approach: Ask clarifying questions if the intent is unclear
- 📊 Reference data-analysis-method.csv to suggest appropriate techniques

## EXECUTION PROTOCOLS:

- 🎯 Understand the user's question and underlying intent
- 💾 Create output file from template with initial metadata
- 📖 Document analysis scope and selected methods
- 🚫 This is the init step - sets up everything for analysis

## CONTEXT BOUNDARIES:

- User provides a natural language question about their data
- Optional: date range, specific events/metrics, segment filters
- Focus: Understanding "why" behind the question
- Limits: Don't assume - ask if unclear
- Dependencies: None - this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Welcome and Gather Question

"**안녕하세요! 데이터 분석을 도와드리겠습니다.**

어떤 데이터를 분석하고 싶으신가요? 자연어로 편하게 질문해 주세요.

**예시:**
- '지난 달 가입 전환율이 어떻게 됐어?'
- '결제 퍼널에서 이탈이 가장 많은 단계가 어디야?'
- '신규 사용자와 기존 사용자의 행동 차이가 있어?'

**질문:** "

Wait for user input.

### 2. Analyze Question Intent

Once user provides a question:

**Identify:**
- **What** they want to know (metric, comparison, trend, etc.)
- **Why** they're asking (decision to make, hypothesis to validate, curiosity)
- **When** - time period (if not specified, clarify)
- **Who** - user segment (if not specified, assume all users)

**If question is unclear or too broad:**

"질문을 더 잘 이해하기 위해 몇 가지 여쭤볼게요:
- [specific clarifying question 1]
- [specific clarifying question 2]"

### 3. Confirm Analysis Scope

Present the understood scope:

"**분석 범위를 확인해 드릴게요:**

| 항목 | 내용 |
|------|------|
| **질문** | {user's question restated} |
| **분석 목적** | {why - what decision or insight} |
| **기간** | {time period} |
| **대상** | {user segment or all users} |
| **핵심 지표** | {key metrics to analyze} |

맞나요? 수정이 필요하면 말씀해 주세요."

### 4. Suggest Analysis Methods

**If {methodsCsvFile} exists, load and reference it.**

Based on the question type, suggest appropriate analysis methods:

"**이 질문에 적합한 분석 기법을 제안드려요:**

| 기법 | 설명 | 적용 |
|------|------|------|
| {method 1} | {description} | {how it applies} |
| {method 2} | {description} | {how it applies} |

이 방식으로 분석을 진행할까요?"

### 5. Create Output File

**Create {outputFile} from {templateFile}:**

Initialize with:
```yaml
---
title: '{analysis title based on question}'
question: '{user question}'
analysis_period: '{confirmed period}'
analysis_methods: [{selected methods}]
created: '{current date}'
author: '{user_name}'
status: in_progress
---
```

### 6. Present MENU OPTIONS

Display:

"**분석 범위가 확정되었습니다.**

**[C]** 분석 시작 - Amplitude 데이터 조회로 진행
**[R]** 질문 재정의 - 범위 수정

선택해 주세요:"

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions - always respond and redisplay menu

#### Menu Handling Logic:

- IF C: Confirm output file is created, then load, read entire file, then execute {nextStepFile}
- IF R: Go back to section 2 (Analyze Question Intent) with user's clarification
- IF Any other: Help user respond, then redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN 'C' is selected and output file is initialized will you load {nextStepFile} to begin data querying.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User's question clearly understood
- Analysis scope confirmed (what, why, when, who)
- Appropriate analysis methods suggested
- Output file created with initial metadata
- User confirms and proceeds to data querying

### ❌ SYSTEM FAILURE:

- Querying Amplitude before understanding the question
- Making assumptions without clarifying
- Proceeding without user confirmation
- Not creating output file before next step

**Master Rule:** Understand first, analyze second. Never skip clarification if the question is ambiguous.
