# E2E 검증 실행 (구현 완료 후)

**Goal**: 기능 구현이 완료된 후 E2E 테스트를 실행하고, 실패 시 테스트를 수정하지 않고 원인을 분석하여 리포트한다.

**실행 컨텍스트**: 워크트리에서 기능 구현 완료 후 실행한다.

**전제 조건**:
- `implement-instructions.md`에 따라 테스트 코드가 이미 작성됨
- 기능 구현이 완료됨 (또는 특정 범위까지 구현 완료)

**핵심 원칙**: 테스트가 실패하면 **구현이 스펙과 다르다는 신호**이므로, 테스트를 고쳐서 통과시키는 것이 아니라 왜 실패했는지를 분석한다.

---

## Step 0: 검증 준비

### 0-1. 설계 문서 로드

원본 설계 문서를 로드하여 AC ↔ 테스트 매핑을 확인한다.

- `{implementation_artifacts}/tests/e2e-test-design-*.md`

### 0-2. 테스트 환경 확인

```bash
# 개발 서버 실행 여부 확인
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Playwright 설치 확인
npx playwright --version
```

- 개발 서버가 꺼져 있으면 `npm run dev` 안내
- Playwright 브라우저가 없으면 `npx playwright install chromium` 안내

### 0-3. 테스트 파일 존재 확인

```bash
# Feature-Colocated 구조 확인
ls tests/e2e/*/
find tests/e2e/ -name "*.spec.ts"
find tests/e2e/ -name "*.page.ts"
find tests/e2e/ -name "*.fixture.ts"
```

- 테스트 파일이 없으면 `implement-instructions.md` 단계를 먼저 수행하도록 안내
- feature 폴더 구조가 아닌 flat 구조로 되어 있으면 사용자에게 알림

---

## Step 1: 전체 테스트 실행

### 1-1. 실행

```bash
npx playwright test tests/e2e/ --project=chromium --reporter=list
```

### 1-2. 결과 분류

테스트 결과를 세 카테고리로 분류:

- **✅ PASS**: 스펙대로 구현됨
- **❌ FAIL**: 스펙과 구현이 불일치
- **⏭️ SKIP**: 테스트 환경 제약 (데이터 없음, 페이지 접근 불가 등)

---

## Step 2: 실패 분석

> **⚠️ 절대 테스트 코드를 수정하여 통과시키지 않는다.**

각 실패 테스트에 대해 다음을 분석한다:

### 2-1. 분석 항목

1. **에러 메시지**: Playwright가 보고한 정확한 에러
2. **스크린샷**: 실패 시점의 페이지 상태 (`test-results/` 확인)
3. **예상 vs 실제**: 테스트가 기대한 것과 실제 동작의 차이
4. **원인 분류**:
   - `IMPL_MISSING`: 구현이 아직 안 됨
   - `IMPL_BUG`: 구현했으나 버그
   - `SPEC_AMBIGUOUS`: 스펙이 모호하여 구현이 다름
   - `ENV_ISSUE`: 테스트 환경 문제 (데이터, 서버 상태 등)
   - `ROUTE_ERROR`: 라우트/URL 구조 문제
   - `TESTID_MISSING`: `data-testid` 미부착으로 안정적 선택 불가
   - `MOCK_MISMATCH`: Mock 응답이 실제 API 스키마와 불일치 (Mock 사용 시)
5. **관련 코드**: 문제가 있는 소스 파일과 라인

### 2-2. 스크린샷 분석

실패 테스트의 스크린샷을 반드시 확인한다.

```bash
ls test-results/
```

- 스크린샷 없이 실패를 판단하지 않는다
- 빈 페이지, 에러 페이지, 예상과 다른 UI 등을 식별

---

## Step 3: 리포트 작성

### 3-1. 사용자에게 리포트 제시

```markdown
## E2E 테스트 리포트

### 요약
- 총 테스트: N개
- ✅ 통과: N개
- ❌ 실패: N개
- ⏭️ 스킵: N개

### 실패 상세

#### ❌ [테스트 이름]
- **Spec 파일**: tests/e2e/xxx.spec.ts:NN
- **대응 AC**: AC N
- **기대 동작**: (설계 문서 기반)
- **실제 동작**: (관찰된 결과)
- **원인 분류**: IMPL_BUG | IMPL_MISSING | SPEC_AMBIGUOUS | ENV_ISSUE | ROUTE_ERROR | TESTID_MISSING
- **스크린샷**: (확인 여부 및 소견)
- **관련 코드**: src/path/to/file.ts:NN
- **제안**: (수정 방향)

### 스킵 사유

#### ⏭️ [테스트 이름]
- **사유**: (왜 스킵되었는지)
- **해결 방법**: (데이터 제공, 환경 설정 등)

### data-testid 추가 필요 목록

| 컴포넌트 파일 | 요소 | 제안 testid |
|--------------|------|------------|
| src/path/Component.tsx | 제출 버튼 | `submit-button` |
```

### 3-2. 사용자 피드백 수집

<ask>
리포트를 확인해주세요. 각 실패 항목에 대해 선택해주세요:

1. **구현 수정 필요** → 소스 코드 수정
2. **스펙 변경 필요** → 설계 문서 AC 조정 + 테스트 갱신
3. **data-testid 추가** → 컴포넌트에 testid 부착 후 재실행
4. **Mock 데이터 수정** → Mock JSON이 실제 API 스키마와 불일치 시 갱신
5. **테스트 환경 문제** → 데이터/URL 제공
6. **무시** → 현재 단계에서 스킵 처리
</ask>

---

## Step 4: 피드백 반영 및 재실행

### 4-1. 피드백에 따른 처리

- **구현 수정 필요**: 관련 소스 코드 수정
- **스펙 변경 필요**: 설계 문서 해당 AC 조정 → 테스트 코드 갱신
- **data-testid 추가**: 컴포넌트에 `data-testid` 속성 부착 → POM locator 업데이트
- **Mock 데이터 수정**: Mock JSON 파일의 응답 구조를 실제 API와 일치시킴
- **테스트 환경 문제**: test-data 업데이트, 환경 설정 조정
- **무시**: `test.skip()` 처리 + 사유 주석

### 4-2. 실패 테스트만 재실행

```bash
npx playwright test tests/e2e/ --project=chromium --grep "실패 테스트 이름"
```

### 4-3. 반복

모든 실패가 해결되거나 사용자가 중단할 때까지 Step 1-4를 반복한다.

---

## Step 5: 최종 리포트 및 문서 업데이트

### 5-1. 리포트 파일 저장

최종 리포트를 `{implementation_artifacts}/tests/e2e-test-report-{feature}.md`에 저장한다.

### 5-2. 설계 문서 상태 갱신

설계 문서(`e2e-test-design-*.md`)의 상단 메타데이터를 갱신:

```markdown
**상태**: 검증 완료
**검증일**: {date}
**결과**: ✅ N pass / ❌ N fail / ⏭️ N skip
```

### 5-3. Tech-Spec 업데이트

Tech-Spec의 `## E2E Test Design` 섹션을 `## E2E Test Results`로 갱신:

```markdown
## E2E Test Results

**설계 문서**: {implementation_artifacts}/tests/e2e-test-design-{feature}.md
**리포트**: {implementation_artifacts}/tests/e2e-test-report-{feature}.md
**검증일**: {date}
**상태**: 검증 완료

### 테스트 결과

| Spec 파일 | 테스트 수 | 결과 |
|-----------|----------|------|
| feature-a.spec.ts | N개 | ✅ All pass |
| feature-b.spec.ts | N개 | ✅ N pass, ⏭️ N skip |

### AC → 테스트 매핑

| AC | 테스트 | 결과 |
|----|--------|------|
| AC 1 | (테스트명) | ✅ |
| AC 2 | (테스트명) | ✅ |

### 실행 방법

```bash
# 전체 실행
npx playwright test tests/e2e/ --project=chromium --reporter=list

# Spec별 개별 실행
npx playwright test tests/e2e/xxx.spec.ts --project=chromium
```

### 검증 항목 요약

- ✅ (통과 항목)
- ❌ (실패 항목과 원인)
- ⏭️ (스킵 항목과 사유)

### 미해결 사항

- (있으면 기재, 없으면 "없음")
```

### 5-4. 완료 확인

- [ ] 최종 리포트가 `{implementation_artifacts}/tests/`에 저장됨
- [ ] 설계 문서 상태가 "검증 완료"로 갱신됨
- [ ] Tech-Spec에 `## E2E Test Results` 섹션이 추가됨
- [ ] AC → 테스트 매핑이 결과와 함께 기재됨
- [ ] 미해결 사항이 정리됨

---

## 핵심 규칙

### ✅ DO

- 실패 시 구현 코드의 문제를 추적
- 스크린샷을 반드시 확인
- 사용자에게 실패 원인과 수정 방향을 명확히 제시
- 사용자 피드백을 받은 후에만 조치 수행
- AC ↔ 테스트 결과를 1:1 대응하여 보고

### ❌ DON'T

- **절대 테스트를 수정하여 통과시키지 않는다** (expect 조건 완화, 검증 제거 등)
- 테스트 실패를 `test.skip()`으로 무시하지 않는다 (사용자 승인 없이)
- 스크린샷 분석 없이 실패를 판단하지 않는다
- 사용자 피드백 없이 소스 코드를 수정하지 않는다
