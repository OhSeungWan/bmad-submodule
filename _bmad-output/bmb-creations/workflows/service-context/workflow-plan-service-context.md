---
conversionFrom: 'src/modules/dae/workflows/service-context/service-context.spec.md'
originalFormat: 'spec-placeholder'
stepsCompleted: ['step-00-conversion']
created: 2026-03-13
status: CONVERSION
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
