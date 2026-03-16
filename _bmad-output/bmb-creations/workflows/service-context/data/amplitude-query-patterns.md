# Amplitude Query Patterns

서비스 컨텍스트 추출에 사용되는 Amplitude MCP 쿼리 패턴입니다.

## Sub-Agent A: 서비스 기본 정보

### 사용 도구
- `get_context` — 사용자의 조직 및 접근 가능한 프로젝트 목록
- `get_project_context` — 선택된 프로젝트의 상세 설정

### 추출 대상
- 프로젝트 이름, ID
- 주요 이벤트 목록
- 프로젝트 설정 및 메타데이터

## Sub-Agent B: 퍼널/차트 구조

### 사용 도구
- `get_charts` — 프로젝트의 기존 차트 목록
- `search` — 퍼널 관련 차트 검색

### 추출 대상
- 기존 퍼널 차트 구조
- 퍼널 단계별 이벤트
- 차트 이름 및 설명

## Sub-Agent C: 이벤트/지표 후보

### 사용 도구
- `get_event_properties` — 이벤트 속성 목록
- `search` — 지표 관련 이벤트 검색

### 추출 대상
- 주요 이벤트 및 속성
- 지표 후보 (전환율, 리텐션 등)
- 이벤트 간 관계

## Fallback 패턴

Sub-Agent 사용 불가 시 메인 스레드에서 순차 실행:
1. get_context → 프로젝트 선택
2. get_charts → 차트/퍼널 추출
3. get_event_properties → 이벤트/지표 추출
