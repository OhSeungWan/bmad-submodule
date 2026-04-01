# Quick-Dev Workflow Enhancement: Simplify Step + Visual Companion

## Overview

bmad-quick-dev 워크플로우에 두 가지 기능을 추가한다:

1. **`/simplify` 자동 실행 스텝** — implement 직후, review 직전에 코드 리뷰/정리 수행
2. **Visual Companion 통합** — clarify/plan 단계에서 시각적 표현이 필요할 때 아스키아트 대신 로컬 brainstorm 서버를 활용하여 HTML 기반 시각 정보 제공

## Scope

- 대상 디렉토리: `_bmad/bmm/4-implementation/bmad-quick-dev/`
- 별도 브랜치: `feature/quick-dev-simplify-visual-companion`
- 기존 review(adversarial review) 단계는 그대로 유지

## Workflow 변경

### 변경 전 (5단계)

```
step-01-clarify-and-route → step-02-plan → step-03-implement → step-04-review → step-05-present
```

### 변경 후 (6단계 + 유틸리티 파일)

```
step-01-clarify-and-route (+VC 참조)
→ step-02-plan (+VC 참조, plan 완료 시 서버 정리)
→ step-03-implement
→ step-04-simplify (신규)
→ step-05-review (기존 step-04)
→ step-06-present (기존 step-05)

+ visual-companion.md (독립 유틸리티 파일)
```

## 파일별 변경 상세

### 1. `visual-companion.md` (신규)

독립 유틸리티 파일. step-01/02에서 필요 시 참조.

**내용:**
- **서버 시작 절차**: superpowers brainstorm server (`skills/brainstorming/scripts/start-server.sh --project-dir {project-root}`) 실행. `screen_dir`, `state_dir` 변수 저장. 사용자에게 URL 안내.
- **사용 규칙**: 시각적 표현이 필요한 모든 경우(아키텍처 다이어그램, 데이터 플로우, UI 모커프, 플로우차트, 상태 머신 등)에 아스키아트/텍스트 다이어그램 대신 Visual Companion HTML을 작성. 텍스트로 충분한 질문(요구사항, 트레이드오프 리스트 등)은 터미널 사용.
- **HTML 작성 규칙**: content fragment 방식 사용 (서버가 프레임 템플릿 자동 래핑). 시맨틱 파일명 사용. 파일명 재사용 금지. CSS 클래스(options, cards, mockup, split, pros-cons 등) 활용.
- **이벤트 읽기**: `$STATE_DIR/events` 파일에서 사용자 브라우저 인터랙션(클릭, 선택) 읽기. 터미널 텍스트와 병합하여 피드백 파악.
- **서버 정리 절차**: `scripts/stop-server.sh $SESSION_DIR` 실행. plan 단계 완료 후 호출.
- **서버 생존 확인**: 각 HTML 작성 전 `$STATE_DIR/server-info` 존재 확인. 없으면 재시작.
- **스크립트 경로**: superpowers 플러그인 캐시 디렉토리 기준 상대 경로 사용. 런타임에 플러그인 경로 탐색 필요.

### 2. `step-01-clarify-and-route.md` (수정)

RULES 섹션에 다음 추가:
```
- 시각적 표현이 필요한 경우(다이어그램, 모커프, 플로우차트 등) 아스키아트를 사용하지 않는다. 
  대신 `./visual-companion.md`를 읽고 Visual Companion 서버를 시작하여 HTML로 제공한다.
```

INSTRUCTIONS의 "Clarify intent" 단계에서:
- 시각적 질문이 발생할 때 visual-companion.md를 참조하여 서버 시작 및 HTML 작성

### 3. `step-02-plan.md` (수정)

RULES 섹션에 동일한 Visual Companion 지침 추가.

INSTRUCTIONS에서:
- 아키텍처/데이터 플로우 다이어그램 등을 Visual Companion HTML로 렌더링하여 사용자에게 제시
- CHECKPOINT 1 이후(Approve 또는 step-03로 넘어가기 직전): Visual Companion 서버가 실행 중이면 정리(stop-server) 실행

### 4. `step-03-implement.md` (수정)

NEXT 섹션 변경:
```
기존: Read fully and follow `./step-04-review.md`
변경: Read fully and follow `./step-04-simplify.md`
```

### 5. `step-04-simplify.md` (신규)

```yaml
---
---
```

```markdown
# Step 4: Simplify

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- 이 단계는 구현 코드의 품질 개선과 정리를 목적으로 한다.
- 기능 변경이나 새로운 기능 추가는 하지 않는다.

## INSTRUCTIONS

### Invoke Simplify

`/simplify` (Claude Code 공식 명령어)를 호출하여 step-03에서 변경된 코드를 대상으로 리뷰 및 정리를 수행한다.

대상 범위:
- `{baseline_commit}` 이후 변경된 모든 파일
- `{baseline_commit}`이 없거나 `NO_VCS`인 경우, step-03에서 작업한 파일 목록을 기준으로 수행

### Simplify 결과 반영

simplify 스킬이 제안하는 변경사항을 적용한다:
- 코드 재사용 개선
- 불필요한 복잡성 제거
- 일관성 및 가독성 향상
- 기존 프로젝트 패턴/컨벤션 준수

### Self-Check

simplify 적용 후 기존 기능이 깨지지 않았는지 확인:
- 테스트가 존재하면 실행
- 타입 체크가 가능하면 실행
- 빌드가 가능하면 실행

문제 발견 시 simplify 변경사항을 되돌리고 원본 구현을 유지한다.

## NEXT

Read fully and follow `./step-05-review.md`
```

### 6. `step-04-review.md` → `step-05-review.md` (파일명 변경)

내용 변경 없음. NEXT 섹션만 수정:
```
기존: Read fully and follow `./step-05-present.md`
변경: Read fully and follow `./step-06-present.md`
```

### 7. `step-05-present.md` → `step-06-present.md` (파일명 변경)

내용 변경 없음.

### 8. `workflow.md` (수정)

"First Step Execution" 섹션은 변경 없음 (step-01로 시작).

워크플로우 아키텍처 설명에 6단계 반영:
```
clarify → plan → implement → simplify → review → present
```

### 9. `step-01-clarify-and-route.md` 내부 참조 수정

EARLY EXIT 라우팅에서:
- `in-review` selected → `./step-05-review.md`로 변경 (기존 `./step-04-review.md`)

### 10. `step-oneshot.md` (변경 없음)

one-shot 경로는 simplify/Visual Companion 없이 기존 동작 유지.

## Visual Companion 스크립트 배치

superpowers v5.0.7의 brainstorm server 스크립트를 프로젝트 내 `_bmad/_tools/visual-companion/`에 복사하여 사용한다. 플러그인 캐시 경로에 의존하지 않는다.

**복사 대상 파일 (superpowers v5.0.7 `skills/brainstorming/scripts/` 기준):**
- `server.cjs` — 로컬 서버 핵심 로직
- `start-server.sh` — 서버 시작 스크립트
- `stop-server.sh` — 서버 정리 스크립트
- `frame-template.html` — CSS 클래스 정의, 테마
- `helper.js` — 클라이언트 사이드 인터랙션

**배치 경로:** `_bmad/_tools/visual-companion/`

## Superpowers 참조 버전

이 스펙은 **superpowers v5.0.7**을 기준으로 작성되었다.
향후 superpowers 업데이트 시 다음 파일/경로의 변경 여부를 확인해야 한다:

| 참조 대상 | 경로 (v5.0.7 기준) | 용도 |
|-----------|-------------------|------|
| Visual Companion 가이드 | `skills/brainstorming/visual-companion.md` | HTML 작성 규칙, CSS 클래스, 이벤트 포맷 |
| Brainstorm Server | `skills/brainstorming/scripts/server.cjs` | 로컬 서버 핵심 로직 |
| 서버 시작 스크립트 | `skills/brainstorming/scripts/start-server.sh` | 서버 시작 인터페이스, CLI 옵션 |
| 서버 정지 스크립트 | `skills/brainstorming/scripts/stop-server.sh` | 서버 정리 인터페이스 |
| 프레임 템플릿 | `skills/brainstorming/scripts/frame-template.html` | CSS 클래스 정의, 테마 |
| 헬퍼 스크립트 | `skills/brainstorming/scripts/helper.js` | 클라이언트 사이드 인터랙션 |

**변경 감지 체크리스트:**
- [ ] `start-server.sh` CLI 옵션 변경 여부 (`--project-dir`, `--host`, `--url-host`, `--foreground`)
- [ ] 서버 출력 JSON 포맷 변경 여부 (`screen_dir`, `state_dir`, `port`, `url`)
- [ ] `$STATE_DIR/events` 이벤트 포맷 변경 여부
- [ ] `$STATE_DIR/server-info`, `$STATE_DIR/server-stopped` 파일 규약 변경 여부
- [ ] CSS 클래스명 변경 여부 (options, cards, mockup, split, pros-cons 등)
- [ ] content fragment vs full document 판별 규칙 변경 여부

## 의존성

- superpowers 플러그인 v5.0.7+ (brainstorm server 포함)
- Node.js (brainstorm server 실행에 필요)
- `/simplify` (Claude Code 공식 명령어)

## 영향 범위

- bmad-quick-dev 워크플로우만 변경
- bmad-agent-quick-flow-solo-dev(Barry) Capabilities 테이블 변경 없음
- customize.yaml 변경 없음
- 기존 adversarial review 프로세스 그대로 유지
