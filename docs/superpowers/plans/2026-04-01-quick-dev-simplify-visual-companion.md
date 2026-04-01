# Quick-Dev Simplify + Visual Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** bmad-quick-dev 워크플로우에 `/simplify` 자동 실행 스텝과 Visual Companion(로컬 brainstorm 서버) 통합을 추가한다.

**Architecture:** 기존 5단계 워크플로우를 6단계로 확장하고, Visual Companion 로직을 독립 유틸리티 파일로 분리하여 step-01/02에서 참조한다. 모든 변경은 `_bmad/bmm/4-implementation/bmad-quick-dev/`와 `.claude/skills/bmad-quick-dev/` 양쪽에 동일하게 적용한다.

**Tech Stack:** Markdown (BMad workflow step files), Bash (superpowers brainstorm server scripts)

**Spec:** `docs/superpowers/specs/2026-04-01-quick-dev-simplify-visual-companion-design.md`

**Branch:** `feature/quick-dev-simplify-visual-companion`

---

## File Structure

모든 파일은 `_bmad/bmm/4-implementation/bmad-quick-dev/` (원본)와 `.claude/skills/bmad-quick-dev/` (미러) 양쪽에 존재한다. 각 태스크에서 원본을 먼저 작업하고, 미러에 복사한다.

| 파일 | 변경 유형 |
|------|-----------|
| `visual-companion.md` | 신규 생성 |
| `step-04-simplify.md` | 신규 생성 |
| `step-04-review.md` → `step-05-review.md` | 이름 변경 + NEXT 수정 |
| `step-05-present.md` → `step-06-present.md` | 이름 변경 |
| `step-03-implement.md` | NEXT 참조 수정 |
| `step-01-clarify-and-route.md` | RULES 추가 + EARLY EXIT 참조 수정 |
| `step-02-plan.md` | RULES 추가 + 서버 정리 로직 추가 |
| `workflow.md` | 워크플로우 설명 업데이트 |

---

### Task 0: 브랜치 생성

**Files:**
- None (git operation only)

- [ ] **Step 1: feature 브랜치 생성**

```bash
cd /Users/park-yigeon/workspace/doublecheck/bmad-submodule
git checkout -b feature/quick-dev-simplify-visual-companion
```

- [ ] **Step 2: 브랜치 확인**

```bash
git branch --show-current
```
Expected: `feature/quick-dev-simplify-visual-companion`

---

### Task 1: 기존 step 파일 이름 변경 (review, present)

파일명 변경을 먼저 수행해야 이후 태스크에서 참조 충돌이 없다.

**Files:**
- Rename: `step-04-review.md` → `step-05-review.md` (양쪽 디렉토리)
- Rename: `step-05-present.md` → `step-06-present.md` (양쪽 디렉토리)

- [ ] **Step 1: _bmad 원본 디렉토리에서 파일명 변경**

```bash
cd /Users/park-yigeon/workspace/doublecheck/bmad-submodule
git mv _bmad/bmm/4-implementation/bmad-quick-dev/step-04-review.md _bmad/bmm/4-implementation/bmad-quick-dev/step-05-review.md
git mv _bmad/bmm/4-implementation/bmad-quick-dev/step-05-present.md _bmad/bmm/4-implementation/bmad-quick-dev/step-06-present.md
```

- [ ] **Step 2: .claude/skills 미러 디렉토리에서 파일명 변경**

```bash
git mv .claude/skills/bmad-quick-dev/step-04-review.md .claude/skills/bmad-quick-dev/step-05-review.md
git mv .claude/skills/bmad-quick-dev/step-05-present.md .claude/skills/bmad-quick-dev/step-06-present.md
```

- [ ] **Step 3: step-05-review.md의 NEXT 참조 수정 (양쪽)**

`_bmad/bmm/4-implementation/bmad-quick-dev/step-05-review.md`와 `.claude/skills/bmad-quick-dev/step-05-review.md` 모두에서:

```
기존: Read fully and follow `./step-05-present.md`
변경: Read fully and follow `./step-06-present.md`
```

- [ ] **Step 4: 변경 확인**

```bash
ls _bmad/bmm/4-implementation/bmad-quick-dev/step-0*.md
ls .claude/skills/bmad-quick-dev/step-0*.md
grep -n "step-06-present" _bmad/bmm/4-implementation/bmad-quick-dev/step-05-review.md
grep -n "step-06-present" .claude/skills/bmad-quick-dev/step-05-review.md
```

Expected: 양쪽 모두 `step-05-review.md`, `step-06-present.md` 존재. NEXT에 `step-06-present.md` 참조.

- [ ] **Step 5: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/step-05-review.md \
       _bmad/bmm/4-implementation/bmad-quick-dev/step-06-present.md \
       .claude/skills/bmad-quick-dev/step-05-review.md \
       .claude/skills/bmad-quick-dev/step-06-present.md
git commit -m "refactor: rename quick-dev step-04/05 to step-05/06 for simplify insertion"
```

---

### Task 2: visual-companion.md 생성

**Files:**
- Create: `_bmad/bmm/4-implementation/bmad-quick-dev/visual-companion.md`
- Create: `.claude/skills/bmad-quick-dev/visual-companion.md`

- [ ] **Step 1: visual-companion.md 작성 (원본)**

`_bmad/bmm/4-implementation/bmad-quick-dev/visual-companion.md` 파일을 생성한다:

```markdown
# Visual Companion Utility

시각적 표현이 필요할 때 아스키아트/텍스트 다이어그램 대신 로컬 brainstorm 서버를 통해 HTML 기반 시각 정보를 제공한다.

> 이 파일은 superpowers v5.0.7의 brainstorm server를 기반으로 작성되었다.
> 업데이트 시 `docs/superpowers/specs/2026-04-01-quick-dev-simplify-visual-companion-design.md`의 변경 감지 체크리스트를 참조한다.

## 언제 사용하는가

**Visual Companion을 사용하는 경우** — 시각적으로 보여주는 것이 이해에 도움이 되는 모든 경우:
- 아키텍처 다이어그램, 시스템 컴포넌트 구조
- 데이터 플로우, 상태 머신, 플로우차트
- UI 모커프, 와이어프레임, 레이아웃 비교
- 사이드바이사이드 시각 비교
- 엔티티 관계도

**터미널을 사용하는 경우** — 텍스트로 충분한 경우:
- 요구사항, 스코프 질문
- 트레이드오프 리스트, 장단점 비교 (텍스트)
- 기술적 의사결정 (API 설계, 데이터 모델링)
- 개념적 A/B/C 선택지

## 서버 시작

### 스크립트 경로 탐색

```bash
SUPERPOWERS_SCRIPTS="$(ls -d ~/.claude/plugins/cache/claude-plugins-official/superpowers/*/skills/brainstorming/scripts 2>/dev/null | sort -V | tail -1)"
```

`SUPERPOWERS_SCRIPTS`가 비어있으면 superpowers 플러그인이 설치되지 않은 것이다. 사용자에게 안내하고 Visual Companion 없이 진행한다.

### 서버 실행

```bash
"$SUPERPOWERS_SCRIPTS/start-server.sh" --project-dir {project-root}
```

서버가 반환하는 JSON에서 다음 값을 저장한다:
- `screen_dir` — HTML 파일을 작성할 디렉토리
- `state_dir` — 이벤트 및 서버 상태 디렉토리
- `url` — 사용자에게 안내할 브라우저 URL
- `port` — 서버 포트

사용자에게 URL을 안내한다: "브라우저에서 {url}을 열어주세요."

## HTML 작성 규칙

1. **Content fragment 방식을 사용한다.** `<!DOCTYPE`이나 `<html>`로 시작하지 않는 HTML을 작성하면 서버가 자동으로 프레임 템플릿으로 래핑한다.
2. **시맨틱 파일명을 사용한다:** `architecture.html`, `data-flow.html`, `layout-comparison.html`
3. **파일명을 재사용하지 않는다.** 반복 시 `-v2`, `-v3` 접미사를 붙인다.
4. **Write 도구로 작성한다.** cat/heredoc을 사용하지 않는다.
5. **매 작성 전 서버 생존을 확인한다:** `$STATE_DIR/server-info` 파일 존재 확인. 없거나 `$STATE_DIR/server-stopped`가 있으면 서버를 재시작한다.

### 사용 가능한 CSS 클래스

| 클래스 | 용도 |
|--------|------|
| `.options` + `.option` | A/B/C 선택지 (data-choice, onclick="toggleSelect(this)") |
| `.options[data-multiselect]` | 복수 선택 가능 |
| `.cards` + `.card` | 비주얼 디자인 카드 |
| `.mockup` + `.mockup-header` + `.mockup-body` | 모커프 컨테이너 |
| `.split` | 사이드바이사이드 비교 |
| `.pros-cons` + `.pros` + `.cons` | 장단점 |
| `.mock-nav`, `.mock-sidebar`, `.mock-content`, `.mock-button`, `.mock-input` | 와이어프레임 요소 |
| `.placeholder` | 플레이스홀더 영역 |
| `h2`, `h3`, `.subtitle`, `.section`, `.label` | 타이포그래피 |

### 예시: 아키텍처 다이어그램

```html
<h2>시스템 아키텍처</h2>
<p class="subtitle">제안된 컴포넌트 구조를 확인해주세요</p>

<div class="mockup">
  <div class="mockup-header">Architecture Overview</div>
  <div class="mockup-body">
    <!-- SVG 또는 HTML/CSS로 다이어그램 렌더링 -->
  </div>
</div>
```

### 예시: 선택지 제시

```html
<h2>어떤 접근법이 적절한가요?</h2>

<div class="options">
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content">
      <h3>접근법 제목</h3>
      <p>설명</p>
    </div>
  </div>
</div>
```

## 이벤트 읽기

사용자가 브라우저에서 옵션을 클릭하면 `$STATE_DIR/events`에 JSON lines로 기록된다:

```jsonl
{"type":"click","choice":"a","text":"Option A","timestamp":1706000101}
```

다음 턴에서 이 파일을 읽어 사용자의 브라우저 인터랙션을 확인한다. 터미널 텍스트와 병합하여 피드백을 파악한다. 파일이 없으면 브라우저 인터랙션이 없었던 것이다.

## 비활성 화면 전환

다음 질문이 시각적이 아닌 경우(터미널에서 텍스트 질문), 대기 화면을 push하여 이전 화면을 클리어한다:

```html
<div style="display:flex;align-items:center;justify-content:center;min-height:60vh">
  <p class="subtitle">터미널에서 계속 진행 중...</p>
</div>
```

## 서버 정리

plan 단계 완료 후 (step-02의 CHECKPOINT 1에서 Approve 이후) 서버를 정리한다:

```bash
"$SUPERPOWERS_SCRIPTS/stop-server.sh" "$SESSION_DIR"
```

`SESSION_DIR`은 서버 시작 시 `screen_dir`의 상위 디렉토리이다. `--project-dir`을 사용했으므로 `.superpowers/brainstorm/` 하위에 세션 파일이 보존된다.
```

- [ ] **Step 2: 미러에 복사**

`.claude/skills/bmad-quick-dev/visual-companion.md`에 동일한 내용을 복사한다.

- [ ] **Step 3: 파일 존재 확인**

```bash
ls -la _bmad/bmm/4-implementation/bmad-quick-dev/visual-companion.md
ls -la .claude/skills/bmad-quick-dev/visual-companion.md
diff _bmad/bmm/4-implementation/bmad-quick-dev/visual-companion.md .claude/skills/bmad-quick-dev/visual-companion.md
```

Expected: 양쪽 파일 존재, diff 결과 없음 (동일).

- [ ] **Step 4: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/visual-companion.md \
       .claude/skills/bmad-quick-dev/visual-companion.md
git commit -m "feat: add visual-companion.md utility for quick-dev workflow"
```

---

### Task 3: step-04-simplify.md 생성

**Files:**
- Create: `_bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md`
- Create: `.claude/skills/bmad-quick-dev/step-04-simplify.md`

- [ ] **Step 1: step-04-simplify.md 작성 (원본)**

`_bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md` 파일을 생성한다:

```markdown
---
---

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

simplify가 제안하는 변경사항을 적용한다:
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

- [ ] **Step 2: 미러에 복사**

`.claude/skills/bmad-quick-dev/step-04-simplify.md`에 동일한 내용을 복사한다.

- [ ] **Step 3: 파일 존재 및 동일성 확인**

```bash
ls -la _bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md
ls -la .claude/skills/bmad-quick-dev/step-04-simplify.md
diff _bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md .claude/skills/bmad-quick-dev/step-04-simplify.md
```

Expected: 양쪽 파일 존재, diff 결과 없음.

- [ ] **Step 4: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md \
       .claude/skills/bmad-quick-dev/step-04-simplify.md
git commit -m "feat: add step-04-simplify to quick-dev workflow"
```

---

### Task 4: step-03-implement.md NEXT 참조 수정

**Files:**
- Modify: `_bmad/bmm/4-implementation/bmad-quick-dev/step-03-implement.md` (마지막 줄 NEXT 섹션)
- Modify: `.claude/skills/bmad-quick-dev/step-03-implement.md` (마지막 줄 NEXT 섹션)

- [ ] **Step 1: NEXT 참조 변경 (양쪽)**

양쪽 파일 모두에서:

```
기존: Read fully and follow `./step-04-review.md`
변경: Read fully and follow `./step-04-simplify.md`
```

- [ ] **Step 2: 변경 확인**

```bash
grep "step-04" _bmad/bmm/4-implementation/bmad-quick-dev/step-03-implement.md
grep "step-04" .claude/skills/bmad-quick-dev/step-03-implement.md
```

Expected: 양쪽 모두 `step-04-simplify.md` 참조.

- [ ] **Step 3: 동일성 확인**

```bash
diff _bmad/bmm/4-implementation/bmad-quick-dev/step-03-implement.md .claude/skills/bmad-quick-dev/step-03-implement.md
```

Expected: diff 결과 없음.

- [ ] **Step 4: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/step-03-implement.md \
       .claude/skills/bmad-quick-dev/step-03-implement.md
git commit -m "refactor: update step-03 NEXT reference to step-04-simplify"
```

---

### Task 5: step-01-clarify-and-route.md 수정

**Files:**
- Modify: `_bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md`
- Modify: `.claude/skills/bmad-quick-dev/step-01-clarify-and-route.md`

두 가지 수정: (1) RULES에 Visual Companion 지침 추가, (2) EARLY EXIT의 `step-04-review.md` 참조를 `step-05-review.md`로 변경.

- [ ] **Step 1: RULES 섹션에 Visual Companion 지침 추가 (양쪽)**

양쪽 파일 모두의 RULES 섹션 마지막에 추가:

```markdown
- 시각적 표현이 필요한 경우(다이어그램, 모커프, 플로우차트, 아키텍처 등) 아스키아트/텍스트 다이어그램을 사용하지 않는다. 대신 `./visual-companion.md`를 읽고 Visual Companion 서버를 시작하여 HTML로 제공한다.
```

- [ ] **Step 2: EARLY EXIT 참조 수정 (양쪽)**

양쪽 파일 모두에서:

```
기존: - If it points to a file that matches the spec template (has `status` frontmatter with a recognized value: ready-for-dev, in-progress, or in-review) → set `spec_file` and **EARLY EXIT** to the appropriate step (step-03 for ready/in-progress, step-04 for review).
변경: - If it points to a file that matches the spec template (has `status` frontmatter with a recognized value: ready-for-dev, in-progress, or in-review) → set `spec_file` and **EARLY EXIT** to the appropriate step (step-03 for ready/in-progress, step-05 for review).
```

그리고:

```
기존: - If `in-review` selected: Set `spec_file`. **EARLY EXIT** → `./step-04-review.md`
변경: - If `in-review` selected: Set `spec_file`. **EARLY EXIT** → `./step-05-review.md`
```

- [ ] **Step 3: 변경 확인**

```bash
grep -n "visual-companion" _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md
grep -n "step-05-review" _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md
grep -n "step-04-review" _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md
```

Expected: visual-companion 참조 있음, step-05-review 참조 있음, step-04-review 참조 없음.

- [ ] **Step 4: 동일성 확인**

```bash
diff _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md .claude/skills/bmad-quick-dev/step-01-clarify-and-route.md
```

Expected: diff 결과 없음.

- [ ] **Step 5: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md \
       .claude/skills/bmad-quick-dev/step-01-clarify-and-route.md
git commit -m "feat: add Visual Companion reference and update review step refs in step-01"
```

---

### Task 6: step-02-plan.md 수정

**Files:**
- Modify: `_bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md`
- Modify: `.claude/skills/bmad-quick-dev/step-02-plan.md`

두 가지 수정: (1) RULES에 Visual Companion 지침 추가, (2) CHECKPOINT 1의 Approve 분기 후 서버 정리 로직 추가.

- [ ] **Step 1: RULES 섹션에 Visual Companion 지침 추가 (양쪽)**

양쪽 파일 모두의 RULES 섹션 마지막에 추가:

```markdown
- 시각적 표현이 필요한 경우(다이어그램, 모커프, 플로우차트, 아키텍처 등) 아스키아트/텍스트 다이어그램을 사용하지 않는다. 대신 `./visual-companion.md`를 읽고 Visual Companion 서버를 시작하여 HTML로 제공한다.
```

- [ ] **Step 2: CHECKPOINT 1 Approve 분기에 서버 정리 추가 (양쪽)**

양쪽 파일 모두의 CHECKPOINT 1 섹션에서 `- **A**:` 분기 내용을 수정:

```
기존:
- **A**: Rename `{wipFile}` to `{spec_file}`, set status `ready-for-dev`. Everything inside `<frozen-after-approval>` is now locked — only the human can change it. Display the finalized spec path to the user as a CWD-relative path (no leading `/`) so it is clickable in the terminal. → Step 3.

변경:
- **A**: Rename `{wipFile}` to `{spec_file}`, set status `ready-for-dev`. Everything inside `<frozen-after-approval>` is now locked — only the human can change it. Display the finalized spec path to the user as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If Visual Companion server is running, stop it now (see `./visual-companion.md` § 서버 정리). → Step 3.
```

- [ ] **Step 3: 변경 확인**

```bash
grep -n "visual-companion" _bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md
grep -n "Visual Companion server" _bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md
```

Expected: RULES에 visual-companion 참조, CHECKPOINT에 서버 정리 참조.

- [ ] **Step 4: 동일성 확인**

```bash
diff _bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md .claude/skills/bmad-quick-dev/step-02-plan.md
```

Expected: diff 결과 없음.

- [ ] **Step 5: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md \
       .claude/skills/bmad-quick-dev/step-02-plan.md
git commit -m "feat: add Visual Companion reference and server cleanup in step-02"
```

---

### Task 7: workflow.md 업데이트

**Files:**
- Modify: `_bmad/bmm/4-implementation/bmad-quick-dev/workflow.md`
- Modify: `.claude/skills/bmad-quick-dev/workflow.md`

- [ ] **Step 1: 워크플로우 아키텍처 설명 업데이트 (양쪽)**

양쪽 파일 모두의 `## WORKFLOW ARCHITECTURE` 섹션 설명 부분에서 step-file 목록이 언급되는 곳에 6단계 워크플로우를 반영한다. `This uses **step-file architecture**` 문단 이후에 다음을 추가:

```markdown
### Workflow Steps

```
step-01-clarify-and-route → step-02-plan → step-03-implement → step-04-simplify → step-05-review → step-06-present
```

Utility files:
- `visual-companion.md` — 시각적 표현이 필요할 때 step-01/02에서 참조하는 로컬 brainstorm 서버 유틸리티
```

- [ ] **Step 2: 변경 확인**

```bash
grep -n "step-04-simplify" _bmad/bmm/4-implementation/bmad-quick-dev/workflow.md
grep -n "visual-companion" _bmad/bmm/4-implementation/bmad-quick-dev/workflow.md
```

Expected: 양쪽 참조 존재.

- [ ] **Step 3: 동일성 확인**

```bash
diff _bmad/bmm/4-implementation/bmad-quick-dev/workflow.md .claude/skills/bmad-quick-dev/workflow.md
```

Expected: diff 결과 없음.

- [ ] **Step 4: 커밋**

```bash
git add _bmad/bmm/4-implementation/bmad-quick-dev/workflow.md \
       .claude/skills/bmad-quick-dev/workflow.md
git commit -m "docs: update workflow.md with 6-step workflow and visual-companion reference"
```

---

### Task 8: 전체 검증

**Files:**
- All modified files (read-only verification)

- [ ] **Step 1: 파일 목록 검증**

```bash
ls _bmad/bmm/4-implementation/bmad-quick-dev/*.md | sort
ls .claude/skills/bmad-quick-dev/*.md | sort
```

Expected (양쪽 동일):
```
SKILL.md
spec-template.md
step-01-clarify-and-route.md
step-02-plan.md
step-03-implement.md
step-04-simplify.md     ← 신규
step-05-review.md       ← 기존 step-04
step-06-present.md      ← 기존 step-05
step-oneshot.md
visual-companion.md     ← 신규
workflow.md
```

- [ ] **Step 2: NEXT 체인 검증**

```bash
echo "=== step-01 NEXT ===" && grep "Read fully and follow" _bmad/bmm/4-implementation/bmad-quick-dev/step-01-clarify-and-route.md
echo "=== step-02 NEXT ===" && grep "Read fully and follow" _bmad/bmm/4-implementation/bmad-quick-dev/step-02-plan.md
echo "=== step-03 NEXT ===" && grep "Read fully and follow" _bmad/bmm/4-implementation/bmad-quick-dev/step-03-implement.md
echo "=== step-04 NEXT ===" && grep "Read fully and follow" _bmad/bmm/4-implementation/bmad-quick-dev/step-04-simplify.md
echo "=== step-05 NEXT ===" && grep "Read fully and follow" _bmad/bmm/4-implementation/bmad-quick-dev/step-05-review.md
```

Expected chain:
```
step-01 → step-02-plan.md
step-02 → step-03-implement.md
step-03 → step-04-simplify.md
step-04 → step-05-review.md
step-05 → step-06-present.md
```

- [ ] **Step 3: 기존 step-04-review.md 참조가 남아있지 않은지 확인**

```bash
grep -r "step-04-review" _bmad/bmm/4-implementation/bmad-quick-dev/
grep -r "step-04-review" .claude/skills/bmad-quick-dev/
```

Expected: 결과 없음 (모든 참조가 step-05-review로 변경됨).

- [ ] **Step 4: 양쪽 디렉토리 완전 동일성 확인**

```bash
diff -r _bmad/bmm/4-implementation/bmad-quick-dev/ .claude/skills/bmad-quick-dev/
```

Expected: diff 결과 없음.

- [ ] **Step 5: 커밋 로그 확인**

```bash
git log --oneline feature/quick-dev-simplify-visual-companion --not master
```

Expected: Task 0~7의 커밋들이 순서대로 나열됨.
