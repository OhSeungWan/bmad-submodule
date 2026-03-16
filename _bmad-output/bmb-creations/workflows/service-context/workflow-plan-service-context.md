---
conversionFrom: 'src/modules/dae/workflows/service-context/service-context.spec.md'
originalFormat: 'spec-placeholder'
stepsCompleted: ['step-00-conversion', 'step-02-classification', 'step-03-requirements', 'step-04-tools', 'step-05-plan-review', 'step-06-design', 'step-07-foundation', 'step-08-build-step-01', 'step-09-build-all-steps']
created: 2026-03-13
status: APPROVED_FOR_DESIGN
approvedDate: 2026-03-13
---

# Workflow Creation Plan

## Conversion Source

**Original Path:** src/modules/dae/workflows/service-context/service-context.spec.md
**Original Format:** Spec placeholder (아직 구현되지 않은 스펙 문서)
**Detected Structure:** 단일 스펙 파일 - 워크플로우 목표, 스텝 계획, 입출력 정의가 포함된 플레이스홀더

---

## Original Workflow Analysis

### Goal (from source)

서비스 맥락 설정 — 퍼널 구조, 주요 지표 정의 학습. 서비스의 퍼널 구조, 주요 지표, 이벤트 정의를 학습하여 에이전트의 사이드카 메모리에 저장. 이후 분석에서 맥락을 활용.

### Original Steps (Complete List)

**Step 1:** gather-service-info - 서비스 정보 수집
**Step 2:** map-funnels - 주요 퍼널 매핑
**Step 3:** define-metrics - 핵심 지표 정의
**Step 4:** save-context - 사이드카 메모리에 저장

### Output / Deliverable

- Non-document 워크플로우 (메모리 업데이트)
- 사이드카 메모리 업데이트: 퍼널 구조, 주요 지표 및 정의, 서비스 맥락

### Input Requirements

**Required:**
- 서비스 설명 또는 Amplitude 프로젝트 정보

**Optional:**
- 퍼널 정의 문서
- 지표 정의 문서
- 기존 대시보드 참조

### Key Instructions to LLM

- 에이전트(재만/data-analyst)의 페르소나와 커뮤니케이션 스타일을 유지
- Amplitude MCP 도구(get_charts, get_event_properties, search) 활용
- 사용자 입력과 자동 추출을 병행
- 최초 1회 실행 또는 서비스 변경 시 재실행
- 사이드카 메모리 경로: `{project-root}/_bmad/_memory/data-analyst-sidecar/`

---

## Conversion Notes

**What works well in original:**
- 명확한 4단계 스텝 구조
- 입출력 요구사항이 잘 정의됨
- 에이전트 통합 방식(사이드카 메모리)이 명확

**What needs improvement:**
- 실제 구현이 없음 (플레이스홀더 스펙만 존재)
- 각 스텝의 상세 지침이 없음
- Amplitude MCP 활용 방법이 구체적이지 않음
- 사이드카 메모리 저장 형식이 정의되지 않음

**Compliance gaps identified:**
- workflow.md 파일 없음
- step 파일들 없음
- BMAD step-file architecture 미적용
- 메뉴/진행 흐름 미정의
- frontmatter 없음

---

## User Feedback (Conversion Discovery)

**보존할 것:** 특별히 지정 없음 (스펙 구조 유지)
**문제/우려:** 서비스 변경, 퍼널 변경, 지표 변경 시 업데이트가 잘 되는지에 대한 우려 → 편집/업데이트 모드 필요
**추가 기능:** 사이드카 메모리 외에 별도 출력 문서가 필요 — 컨텍스트 부족 시 이어갈 수 있도록
**사용 대상:** 재만(data-analyst) 에이전트가 실행

---

## Classification Decisions

**Workflow Name:** service-context
**Target Path:** _bmad/dae/workflows/service-context/

**4 Key Decisions:**
1. **Document Output:** true (서비스 컨텍스트 문서 생성 + 사이드카 메모리 업데이트)
2. **Module Affiliation:** DAE 모듈
3. **Session Type:** single-session
4. **Lifecycle Support:** tri-modal (steps-c/, steps-e/, steps-v/)

**Structure Implications:**
- steps-c/ (최초 서비스 컨텍스트 생성)
- steps-e/ (퍼널/지표 변경 시 부분 업데이트)
- steps-v/ (저장된 컨텍스트와 실제 데이터 정합성 검증)
- data/ 폴더 공유 (모드 간 일관성 유지)
- 출력물: 서비스 컨텍스트 문서 + 사이드카 메모리 업데이트

---

## Requirements

**Flow Structure:**
- Pattern: linear (자동 추출 → 사용자 확인/보완 패턴)
- Phases: 서비스 정보 수집 → 퍼널 매핑 → 지표 정의 → 저장
- Estimated steps: 4-5개

**User Interaction:**
- Style: mixed (자동 추출은 autonomous, 확인/보완은 collaborative)
- Decision points: 각 단계에서 자동 추출 결과를 사용자가 확인/수정/보완
- Checkpoint frequency: 매 단계 완료 후

**Inputs Required:**
- Required: Amplitude 프로젝트 ID (또는 프로젝트 선택)
- Optional: 서비스 설명, 퍼널 정의 문서, 지표 정의 문서, 기존 대시보드 URL
- Prerequisites: Amplitude MCP 연결

**Output Specifications:**
- Type: document + sidecar memory update
- Format: structured
- Sections: 서비스 개요, 퍼널 구조, 핵심 지표, 이벤트 정의, 메모
- Frequency: single (최초 1회, 이후 편집 모드로 업데이트)

**Success Criteria:**
- 서비스의 주요 퍼널이 빠짐없이 매핑됨
- 핵심 지표가 정의되고 Amplitude 이벤트와 연결됨
- 사이드카 메모리가 업데이트되어 이후 분석에서 맥락 활용 가능
- 서비스 컨텍스트 문서가 생성되어 나중에 참조 가능

**Instruction Style:**
- Overall: mixed
- Notes: Amplitude 데이터 추출/메모리 저장은 prescriptive, 사용자 대화/확인은 intent-based

---

## Tools Configuration

**Core BMAD Tools:**
- **Advanced Elicitation:** included - Integration point: Phase 3(사용자 확인/보완) 메뉴 옵션으로 제공
- **Party Mode:** excluded - 데이터 기반 정리 워크플로우에 부적합
- **Brainstorming:** excluded - 창의적 발산 불필요

**LLM Features:**
- **Web-Browsing:** excluded - Amplitude MCP로 충분
- **File I/O:** included - 서비스 컨텍스트 문서 생성 + 사이드카 메모리 읽기/쓰기
- **Sub-Agents:** included - Amplitude 데이터 추출 병렬화 (서비스 정보 / 퍼널·차트 구조 / 이벤트·지표 후보)
- **Sub-Processes:** excluded

**Memory:**
- Type: single-session
- Tracking: 사이드카 메모리 파일 읽기/쓰기 (`_bmad/_memory/data-analyst-sidecar/`)

**External Integrations:**
- Amplitude MCP: get_context, get_charts, get_event_properties, search

**Installation Requirements:**
- Amplitude MCP 연결 필요 (이미 설치됨)

## Updated Workflow Structure (with Sub-Agents)

**Phase 1: 초기화**
- 사용자 환영, 워크플로우 설명
- Amplitude 프로젝트 선택/입력
- 기존 사이드카 메모리 확인

**Phase 2: 데이터 추출 (Sub-Agents 병렬)**
- Sub-Agent A: 서비스 기본 정보 추출
- Sub-Agent B: 퍼널/차트 구조 추출
- Sub-Agent C: 이벤트/지표 후보 추출

**Phase 3: 사용자 확인/보완**
- 종합된 추출 결과 제시
- 사용자 확인, 수정, 보완

**Phase 4: 저장 및 완료**
- 서비스 컨텍스트 문서 생성
- 사이드카 메모리 업데이트
- 결과 요약 제시

---

## Workflow Design

### File Structure

```
service-context/
├── workflow.md
├── data/
│   └── amplitude-query-patterns.md
├── templates/
│   └── service-context-template.md
├── steps-c/
│   ├── step-01-init.md
│   ├── step-02-extract-data.md
│   ├── step-03-review-and-refine.md
│   └── step-04-save-complete.md
├── steps-e/
│   ├── step-01-assess.md
│   ├── step-02-update.md
│   └── step-03-save-complete.md
└── steps-v/
    └── step-01-validate.md
```

### Create Mode (steps-c/)

**step-01-init** (Init, Non-Continuable, Auto-proceed)
- 사용자 환영, 워크플로우 설명
- Amplitude 프로젝트 선택/입력 (get_context로 프로젝트 목록 제시)
- 기존 사이드카 메모리 확인
- 출력 파일 생성 (템플릿 기반)
- Menu: Auto-proceed to step-02

**step-02-extract-data** (Middle Simple, C only)
- Pattern 4 (Parallel Execution) Sub-Agents:
  - Sub-Agent A: get_context → 프로젝트 기본 정보, 이벤트 목록
  - Sub-Agent B: get_charts → 퍼널/차트 구조 추출
  - Sub-Agent C: get_event_properties + search → 이벤트 속성, 지표 후보
- Fallback: Sub-Agent 불가 시 메인 스레드 순차 실행
- 추출 결과를 출력 파일에 append
- Menu: C only

**step-03-review-and-refine** (Middle Standard, A/C)
- 추출 결과를 섹션별로 사용자에게 제시
  - 서비스 개요 → 확인/수정
  - 퍼널 구조 → 확인/수정/추가
  - 핵심 지표 → 확인/수정/추가
  - 이벤트 정의 → 확인/수정
- 수정 사항을 출력 파일에 반영
- Menu: A/C (Advanced Elicitation으로 더 깊은 탐구 가능)

**step-04-save-complete** (Final, 없음)
- 출력 문서 최종 정리
- 사이드카 메모리 업데이트 (memories.md에 서비스 컨텍스트 저장)
- 결과 요약 제시
- 검증 모드 실행 제안 (선택)

### Edit Mode (steps-e/)

**step-01-assess**
- 기존 서비스 컨텍스트 문서 로드
- 사용자에게 변경 사항 질문 (퍼널 변경? 지표 변경? 서비스 변경?)
- 변경 범위 파악

**step-02-update**
- 변경된 부분만 Amplitude 재추출
- 사용자 확인/보완
- 출력 문서 해당 섹션 업데이트

**step-03-save-complete**
- 문서 저장 + 사이드카 메모리 업데이트
- 변경 요약 제시
- 검증 모드 실행 제안

### Validate Mode (steps-v/)

**step-01-validate**
- 저장된 컨텍스트 문서 로드
- Amplitude에서 현재 데이터 추출 (Sub-Agents 가능)
- 불일치 항목 식별:
  - 누락된 퍼널/이벤트
  - 변경된 지표
  - 새로 추가된 이벤트
- 불일치 리포트 생성
- 편집 모드 실행 제안

### Role and Persona

- 재만(data-analyst) 에이전트의 페르소나와 커뮤니케이션 스타일 유지
- 한국어로 소통
- 친절하고 전문적인 톤, 차근차근 설명

### Subprocess Optimization

- step-02-extract-data: Pattern 4 (Parallel Execution) — 3개 Sub-Agent 병렬
- steps-v/step-01-validate: Pattern 4 가능 — 현재 데이터 추출 병렬화
- 모든 subprocess에 graceful fallback 포함

### Cross-Mode Integration

- Create → Validate: step-04에서 검증 모드 제안
- Edit → Validate: step-03에서 검증 모드 제안
- Validate → Edit: 리포트에서 편집 모드 제안

---

## Foundation Build Complete

**Created:**
- Folder structure at: _bmad-output/bmb-creations/workflows/service-context/
- workflow.md (tri-modal 라우팅: create/edit/validate)
- templates/service-context-template.md (structured 출력 템플릿)
- data/amplitude-query-patterns.md (Amplitude 쿼리 패턴 참조)
- steps-c/, steps-e/, steps-v/ 폴더

**Configuration:**
- Workflow name: service-context
- Continuable: no (single-session)
- Document output: yes (structured)
- Mode: tri-modal (create/edit/validate)

**Next Steps:**
- Step 8: Build step-01-init (Create mode)
- Step 9: Build remaining steps (step-02 ~ step-04, edit mode, validate mode)
