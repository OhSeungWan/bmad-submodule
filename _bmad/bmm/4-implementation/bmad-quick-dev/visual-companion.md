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

### 스크립트 경로

서버 스크립트는 프로젝트 내 `_bmad/_tools/visual-companion/`에 위치한다.

```bash
SCRIPT_DIR="{project-root}/_bmad/_tools/visual-companion"
```

### 서버 실행

```bash
"$SCRIPT_DIR/start-server.sh" --project-dir {project-root}
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
"$SCRIPT_DIR/stop-server.sh" "$SESSION_DIR"
```

`SESSION_DIR`은 서버 시작 시 `screen_dir`의 상위 디렉토리이다. `--project-dir`을 사용했으므로 `.superpowers/brainstorm/` 하위에 세션 파일이 보존된다.
