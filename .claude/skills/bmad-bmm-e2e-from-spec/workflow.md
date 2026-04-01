# E2E Test from Tech-Spec Workflow

**Goal:** Tech-Spec 문서를 기반으로 E2E 테스트를 설계 → 구현 → 검증하는 3단계 워크플로우.

**Your Role:** E2E 테스트 전문가로서 Tech-Spec의 AC를 E2E 테스트로 변환한다.
- Communicate all responses in {communication_language}
- Generate all documents in {document_output_language}
- 각 phase의 instructions를 정확히 따른다
- phase 간 산출물을 연결한다 (design → implement → verify)

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `implementation_artifacts`
- `date` as system-generated current datetime

### E2E Context Loading (선택)

- 경로: `{project-root}/_bmad/_config/e2e-context.md` (고정 경로, 고정 이름)
- **파일이 있으면**: 해당 설정으로 defaults 오버라이드
- **파일이 없으면**: 아래 defaults 사용, 경고 없이 정상 진행

### Defaults

e2e-context.md가 없을 때 사용하는 기본값:

| 항목 | 기본값 |
|------|--------|
| e2e_framework | playwright |
| source_dirs | `["src", "app"]` (존재하는 경로만 사용) |
| test_dir | `tests/e2e` |
| test_structure | feature-colocated |
| locator_priority | data-testid > role > css |
| fixture_pattern | base → feature → spec |
| test_lang | korean |
| run_command | `npx playwright test {test_path} --project=chromium --reporter=list` |

### Paths

- `test_dir` = `{project-root}/tests/e2e`
- `source_dirs` = `["{project-root}/src", "{project-root}/app"]`
- `e2e_context_path` = `{project-root}/_bmad/_config/e2e-context.md`
- `validation` = `./checklist.md`

### Input File Patterns

| Phase | 입력 파일 | 검색 경로 |
|-------|----------|----------|
| design | `tech-spec-*.md` | `{implementation_artifacts}/` |
| implement | `e2e-test-design-*.md` | `{implementation_artifacts}/tests/` |
| verify | `e2e-test-design-*.md` | `{implementation_artifacts}/tests/` |

---

## EXECUTION

### Argument Parsing

`$ARGUMENTS` 형식: `<phase> <filename>`

- **phase**: `design` | `implement` | `verify`
- **filename**: 대상 파일명 (경로 없이 파일명만)

<workflow>
  <step n="1" goal="Phase 및 파일 결정">
    <check if="$ARGUMENTS에 phase가 있음">
      <action>phase를 추출한다 (첫 번째 단어)</action>
      <action>filename을 추출한다 (두 번째 단어, 있으면)</action>
    </check>

    <check if="$ARGUMENTS가 비어있음">
      <output>어떤 단계를 실행할까요?

1. **design** — Tech-Spec → 테스트 설계 문서 작성 (코드 생성 없음)
   - 메인 디렉토리에서 실행
   - 입력: tech-spec-*.md
   - 출력: e2e-test-design-*.md

2. **implement** — 설계 문서 → 실제 테스트 코드 작성
   - 워크트리에서 실행 (기능 구현 전)
   - 입력: e2e-test-design-*.md
   - 출력: tests/e2e/ 하위 파일들

3. **verify** — 구현 완료 후 E2E 테스트 실행 및 리포트
   - 워크트리에서 실행 (기능 구현 완료 후)
   - 입력: e2e-test-design-*.md
   - 출력: e2e-test-report-*.md
      </output>
      <ask>번호 또는 phase명을 입력해주세요:</ask>
    </check>

    <check if="filename이 없음">
      <action>phase에 따라 해당 패턴의 파일을 검색한다:</action>
      <action>design → {implementation_artifacts}/tech-spec-*.md</action>
      <action>implement → {implementation_artifacts}/tests/e2e-test-design-*.md</action>
      <action>verify → {implementation_artifacts}/tests/e2e-test-design-*.md</action>

      <check if="파일이 1개">
        <action>자동 선택</action>
      </check>
      <check if="파일이 여러 개">
        <output>여러 파일이 있습니다. 선택해주세요:</output>
        <action>번호 매기기하여 목록 표시</action>
        <ask>번호를 선택해주세요:</ask>
      </check>
      <check if="파일이 없음">
        <ask>대상 파일 경로를 입력해주세요:</ask>
      </check>
    </check>
  </step>

  <step n="2" goal="Phase별 instructions 실행">
    <check if="phase == design">
      <action>./instructions.md를 로드하고 그 안의 지시사항을 따른다</action>
      <action>입력: Tech-Spec 파일</action>
      <action>출력: {implementation_artifacts}/tests/e2e-test-design-{feature}.md</action>
      <action>컨텍스트: 메인 디렉토리에서 실행</action>
    </check>

    <check if="phase == implement">
      <action>./implement-instructions.md를 로드하고 그 안의 지시사항을 따른다</action>
      <action>입력: 설계 문서 (e2e-test-design-*.md)</action>
      <action>출력: tests/e2e/ 하위 테스트 파일들</action>
      <action>컨텍스트: 워크트리에서 실행 (기능 구현 전, TDD)</action>
    </check>

    <check if="phase == verify">
      <action>./verify-instructions.md를 로드하고 그 안의 지시사항을 따른다</action>
      <action>입력: 설계 문서 (e2e-test-design-*.md)</action>
      <action>출력: {implementation_artifacts}/tests/e2e-test-report-{feature}.md</action>
      <action>컨텍스트: 워크트리에서 실행 (기능 구현 완료 후)</action>
    </check>
  </step>

  <step n="3" goal="Validation">
    <action>./checklist.md에서 해당 phase의 체크리스트를 검증한다</action>
    <action>사용자에게 완료 상태를 보고한다</action>
    <action>다음 phase 안내를 제공한다</action>
  </step>
</workflow>
