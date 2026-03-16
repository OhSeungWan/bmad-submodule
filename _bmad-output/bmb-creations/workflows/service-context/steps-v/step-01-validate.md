---
name: 'step-01-validate'
description: 'Validate stored service context against current Amplitude data'

outputFile: '{output_folder}/service-context-{project_name}.md'
sidecarMemoryPath: '{project-root}/_bmad/_memory/data-analyst-sidecar/memories.md'
editStep: '../steps-e/step-01-assess.md'
queryPatternsData: '../data/amplitude-query-patterns.md'
---

# Step 1: 서비스 컨텍스트 검증

## STEP GOAL:

저장된 서비스 컨텍스트와 현재 Amplitude 데이터를 비교하여 불일치 항목을 식별하고 리포트를 생성한다.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are 재만, a 데이터 분석 컨텍스트 검증자
- ✅ 객관적이고 정확한 비교 분석

### Step-Specific Rules:

- 🎯 Pattern 4 (Parallel Execution) — Amplitude 데이터 추출 병렬화 가능
- 💬 비교 결과를 명확하게 제시
- ⚙️ Sub-Agent 사용 불가 시 메인 스레드에서 순차 실행
- 🚫 FORBIDDEN to modify the service context — report only

## EXECUTION PROTOCOLS:

- 🎯 Load stored context and extract current Amplitude data
- 💾 Generate validation report
- 📖 This is a standalone validation step

## CONTEXT BOUNDARIES:

- Available: Stored output file, Amplitude MCP
- Focus: Compare and report only — do NOT modify
- Dependencies: Service context must exist

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Locate and Load Existing Context

Search for existing service context files matching pattern `service-context-*.md` in output folder.

**If no context found:**
"**서비스 컨텍스트를 찾을 수 없습니다. 먼저 생성 모드(-c)로 설정해 주세요.**"
End workflow.

**If found:**
Load {outputFile} and extract stored data.

"**서비스 컨텍스트 검증을 시작합니다.**

**프로젝트:** {project_name}
**마지막 설정/편집일:** {date}"

### 2. Extract Current Amplitude Data

Load {queryPatternsData} for reference.

"**Amplitude에서 현재 데이터를 추출합니다...**"

Launch subprocesses in parallel (or sequential fallback):

**Sub-Agent A:** 현재 프로젝트 정보 + 이벤트 목록
**Sub-Agent B:** 현재 차트/퍼널 구조
**Sub-Agent C:** 현재 이벤트 속성 + 지표

**⚙️ Fallback:** 메인 스레드에서 순차 실행

### 3. Compare Stored vs Current

Perform section-by-section comparison:

**퍼널 구조 비교:**
- 저장된 퍼널 vs 현재 Amplitude 퍼널
- 누락된 퍼널 (Amplitude에는 있지만 컨텍스트에 없음)
- 삭제된 퍼널 (컨텍스트에는 있지만 Amplitude에서 사라짐)
- 변경된 퍼널 (단계가 다름)

**지표 비교:**
- 저장된 지표 vs 현재 식별 가능한 지표
- 새로운 지표 후보
- 더 이상 추적되지 않는 지표

**이벤트 비교:**
- 저장된 이벤트 vs 현재 이벤트
- 새로 추가된 이벤트
- 속성이 변경된 이벤트
- 삭제된 이벤트

### 4. Generate Validation Report

"**📋 서비스 컨텍스트 검증 리포트**

**프로젝트:** {project_name}
**검증일:** {current date}
**마지막 설정일:** {stored date}

---

### 퍼널 구조

| 상태 | 퍼널 이름 | 상세 |
|------|-----------|------|
| ✅ 일치 | {name} | 변경 없음 |
| ⚠️ 변경 | {name} | {변경 내용} |
| 🆕 추가 | {name} | Amplitude에 새로 발견 |
| ❌ 삭제 | {name} | Amplitude에서 사라짐 |

### 핵심 지표

| 상태 | 지표 이름 | 상세 |
|------|-----------|------|
| ✅ 일치 | {name} | 변경 없음 |
| ⚠️ 변경 | {name} | {변경 내용} |
| 🆕 추가 | {name} | 새로운 지표 후보 |

### 이벤트 정의

| 상태 | 이벤트 이름 | 상세 |
|------|-------------|------|
| ✅ 일치 | {name} | 변경 없음 |
| ⚠️ 변경 | {name} | {변경 내용} |
| 🆕 추가 | {name} | 새로 발견 |
| ❌ 삭제 | {name} | 사라짐 |

---

### 검증 요약

- **일치:** {N}개 항목
- **변경/불일치:** {N}개 항목
- **새로 발견:** {N}개 항목
- **삭제됨:** {N}개 항목

**정합성 점수:** {일치 항목 / 전체 항목 * 100}%"

### 5. Recommend Action

**If 정합성 점수 >= 90%:**
"**✅ 서비스 컨텍스트가 대체로 최신 상태입니다.**

소수의 변경 사항이 있습니다. 편집 모드로 업데이트하시겠습니까?"

**If 정합성 점수 50-89%:**
"**⚠️ 서비스 컨텍스트에 상당한 변경이 감지되었습니다.**

편집 모드로 업데이트하는 것을 권장합니다."

**If 정합성 점수 < 50%:**
"**❌ 서비스 컨텍스트가 크게 변경되었습니다.**

생성 모드로 처음부터 다시 설정하는 것을 권장합니다."

### 6. Handle Final Selection

"**[E] 편집 모드로 업데이트 / [X] 검증 종료**"

#### Menu Handling Logic:

- IF E: Load, read entire file, then execute {editStep}
- IF X: "검증을 마칩니다. 리포트를 참고해 주세요. 📊"
- IF Any other: help user, then redisplay options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- 저장된 컨텍스트와 현재 Amplitude 데이터 비교 완료
- 섹션별 불일치 항목 식별
- 검증 리포트 생성 (테이블 형식)
- 정합성 점수 계산
- 적절한 후속 조치 권장

### ❌ SYSTEM FAILURE:

- 서비스 컨텍스트 임의 수정 (검증은 읽기 전용)
- 비교 없이 결과 생성
- 불일치 항목 누락

**Master Rule:** 검증 모드는 읽기 전용이다. 비교하고 리포트하되, 절대 수정하지 않는다.
