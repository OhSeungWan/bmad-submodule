# Workflows Reference

DAE 모듈에는 9개의 워크플로우가 포함되어 있습니다.

---

## Core Workflows

### Data Analysis (DA)

**ID:** `bmad:dae:workflows:data-analysis`
**Trigger:** `[DA]`

**Purpose:**
Amplitude 데이터 조회 및 분석을 통해 사용자 질문에 데이터 기반 답변 제공

**When to Use:**
- 특정 지표나 데이터를 확인하고 싶을 때
- 데이터 관련 질문에 답이 필요할 때
- 트렌드나 추이를 파악하고 싶을 때

**Input:**
- 사용자 질문 (자연어)

**Output:**
- 데이터 기반 답변 (대화형)

---

### Experiment Design (ED)

**ID:** `bmad:dae:workflows:experiment-design`
**Trigger:** `[ED]`

**Purpose:**
A/B 테스트 가설 수립 및 실험 계획서 작성

**When to Use:**
- A/B 테스트를 계획할 때
- 가설을 수립하고 검증 방법을 설계할 때
- 실험 샘플 크기나 기간을 결정할 때

**Input:**
- 실험 목표 (무엇을 개선하고 싶은지)
- 대상 퍼널/기능

**Output:**
- `experiment-plan-{name}-{date}.md` — 실험 계획서

---

### Insight Extraction (IE)

**ID:** `bmad:dae:workflows:insight-extraction`
**Trigger:** `[IE]`

**Purpose:**
과거 실험 및 데이터에서 패턴과 인사이트 발견

**When to Use:**
- 특정 퍼널이나 기능의 인사이트가 필요할 때
- 과거 데이터에서 패턴을 찾고 싶을 때
- 의사결정을 위한 근거가 필요할 때

**Input:**
- 분석 대상 (퍼널명 또는 기능명)

**Output:**
- `insight-report-{target}-{date}.md` — 인사이트 리포트

---

## Feature Workflows

### Funnel Analysis (FA)

**ID:** `bmad:dae:workflows:funnel-analysis`
**Trigger:** `[FA]`

**Purpose:**
특정 퍼널의 심층 분석 — 전환율, 병목, 개선 제안

**When to Use:**
- 퍼널의 전환율을 분석하고 싶을 때
- 병목 지점을 찾고 싶을 때
- 퍼널 개선 방안이 필요할 때

**Input:**
- 퍼널명 또는 퍼널 정의 (이벤트 시퀀스)

**Output:**
- `funnel-analysis-{name}-{date}.md` — 퍼널 분석 리포트

---

### Experiment Results (ER)

**ID:** `bmad:dae:workflows:experiment-results`
**Trigger:** `[ER]`

**Purpose:**
A/B 테스트 결과 해석 및 인사이트 도출

**When to Use:**
- A/B 테스트가 완료된 후
- 실험 결과를 해석하고 싶을 때
- 다음 액션을 결정해야 할 때

**Input:**
- 실험 ID 또는 실험명

**Output:**
- `experiment-results-{name}-{date}.md` — 실험 결과 리포트

---

### Impact Analysis (IA)

**ID:** `bmad:dae:workflows:impact-analysis`
**Trigger:** `[IA]`

**Purpose:**
기능 변경 시 예상 영향 범위 및 위험도 분석

**When to Use:**
- 기능 변경이나 릴리즈 전
- 변경의 예상 영향을 파악하고 싶을 때
- 모니터링 포인트를 정의하고 싶을 때

**Input:**
- 변경 사항 설명 (기능/UI 변경 내용)

**Output:**
- `impact-analysis-{feature}-{date}.md` — 영향도 분석 리포트

---

### Risk Monitoring (RM)

**ID:** `bmad:dae:workflows:risk-monitoring`
**Trigger:** `[RM]`

**Purpose:**
이상 징후 감지 및 선제적 알림

**When to Use:**
- 주요 지표의 상태를 확인하고 싶을 때
- 이상 징후가 있는지 체크하고 싶을 때
- 선제적 모니터링을 설정하고 싶을 때

**Input:**
- 없음 (자동 실행 가능)

**Output:**
- 대화형 알림 및 분석

---

## Utility Workflows

### Service Context (SC)

**ID:** `bmad:dae:workflows:service-context`
**Trigger:** `[SC]`

**Purpose:**
서비스 맥락 설정 — 퍼널 구조, 주요 지표 정의 학습

**When to Use:**
- DAE 모듈 최초 사용 시
- 서비스 구조가 크게 변경되었을 때
- 재만에게 새로운 맥락을 알려주고 싶을 때

**Input:**
- 서비스 설명 또는 Amplitude 프로젝트 정보

**Output:**
- 사이드카 메모리 업데이트

---

### Report Generation (RG)

**ID:** `bmad:dae:workflows:report-generation`
**Trigger:** `[RG]`

**Purpose:**
분석 결과를 마크다운 또는 PDF 리포트로 문서화

**When to Use:**
- 분석 결과를 문서로 남기고 싶을 때
- 팀과 공유할 리포트가 필요할 때
- 대화형 분석을 정리하고 싶을 때

**Input:**
- 리포트 내용 (분석 결과, 인사이트)

**Output:**
- `{analysis_output_folder}/report-{title}-{date}.md` — 분석 리포트

---

## Workflow Connections

```
[Service Context] ← 최초 1회 설정
        ↓
[Data Analysis] ←→ [Funnel Analysis]
        ↓
[Insight Extraction] → [Experiment Design]
        ↓
[Experiment Results] → [Impact Analysis]
        ↓
[Risk Monitoring] (상시)
        ↓
[Report Generation] (필요시)
```
