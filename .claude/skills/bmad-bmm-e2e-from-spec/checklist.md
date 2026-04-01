# E2E from Tech-Spec - 3단계 Validation Checklist

---

## Phase 1: 설계 (instructions.md)

### Tech-Spec 기반 검증
- [ ] Tech-Spec 문서가 로드됨
- [ ] Acceptance Criteria가 테스트 시나리오로 매핑됨
- [ ] 영향받는 페이지/라우트가 모두 식별됨
- [ ] 테스트 계획이 사용자 승인을 받음

### 설계 문서 품질
- [ ] 설계 문서가 `{implementation_artifacts}/tests/e2e-test-design-{feature}.md`에 생성됨
- [ ] POM 설계에 locator 전략이 명시됨 (testid > role > css)
- [ ] Spec 시나리오가 의사 코드로 작성됨 (실제 코드 아님)
- [ ] 테스트 데이터에 실제 값이 포함됨
- [ ] data-testid 추가 필요 목록이 작성됨
- [ ] 파일 구조가 기존 테스트 구조와 일관됨
- [ ] API Mock 필요 여부가 판정됨 (필요 시 §7 Mock 설계 포함)

### 산출물
- [ ] 설계 문서 생성 완료
- [ ] Tech-Spec에 `## E2E Test Design` 섹션 추가됨
- [ ] Tech-Spec에 `## E2E data-testid 요구사항` 섹션 추가됨 (추가 필요 항목 있는 경우)
- [ ] **실제 코드 파일(.spec.ts, .page.ts)이 생성되지 않았음**

---

## Phase 2: 테스트 코드 구현 (implement-instructions.md)

### 코드 변환 검증 (Feature-Colocated 구조)
- [ ] feature 폴더가 `tests/e2e/{feature-name}/`에 생성됨
- [ ] 설계 문서의 모든 Spec 파일이 feature 폴더 내에 생성됨
- [ ] POM 클래스가 `{feature}.page.ts`로 feature 폴더 내에 생성됨
- [ ] 공통 테스트 데이터가 `_shared/test-data.ts`에 정의됨

### Fixture B 패턴 (feature별 분리)
- [ ] Feature fixture가 `{feature}.fixture.ts`로 생성됨
- [ ] Feature fixture가 `_shared/base.fixture.ts`를 확장함 (base에 직접 추가하지 않음)
- [ ] Feature fixture에 POM + Mock이 함께 등록됨
- [ ] Spec에서 feature fixture를 import함 (`import { test } from './{feature}.fixture'`)

### API Mock 구현 (설계 문서 §7이 있는 경우)
- [ ] Mock JSON 데이터가 `{feature}/mocks/` 하위에 생성됨
- [ ] Mock fixture가 feature fixture 내에 통합됨
- [ ] POM 클래스에 `page.route()` 호출이 포함되지 않음 (관심사 분리)

### POM 품질
- [ ] Page Object가 페이지별로 분리됨
- [ ] Locator에 `data-testid` 우선 사용 (`{section}-{element}` 컨벤션)
- [ ] 설계 문서의 메서드 목록 그대로 구현됨
- [ ] `waitForTimeout` 대신 요소 기반 대기 사용
- [ ] 기존 POM/fixture 재사용 (중복 생성 없음)

### data-testid 부착
- [ ] 설계 문서 §9의 data-testid가 소스 코드에 부착됨
- [ ] POM locator가 부착된 data-testid를 참조함
- [ ] 기존 data-testid가 변경되지 않았음

### 테스트 코드 품질
- [ ] 테스트 이름이 한글로 명확
- [ ] 각 테스트가 독립적 (순서 의존 없음)
- [ ] 설계 문서 AC와 1:1 대응 가능
- [ ] Mock 호출이 `page.goto()` 이전에 위치함 (Mock 사용 시)

### 산출물
- [ ] 설계 문서 §3의 파일 구조와 실제 생성 파일 일치
- [ ] **이 단계에서 테스트를 실행하지 않았음**

---

## Phase 3: 검증 (verify-instructions.md)

### 실행 검증
- [ ] 개발 서버 실행 상태에서 테스트 실행됨
- [ ] 전체 테스트 결과가 분류됨 (PASS / FAIL / SKIP)

### 실패 처리 (핵심)
- [ ] 실패한 테스트를 수정하여 통과시키지 않음
- [ ] 실패 원인이 분류됨 (IMPL_BUG, IMPL_MISSING, SPEC_AMBIGUOUS, ENV_ISSUE, ROUTE_ERROR, TESTID_MISSING, MOCK_MISMATCH)
- [ ] 각 실패에 에러 메시지, 스크린샷, 예상 vs 실제 분석 포함
- [ ] 사용자 피드백을 받은 후에만 조치 수행
- [ ] `test.skip()`은 사용자 승인 후에만 사용

### 산출물
- [ ] 실패 리포트가 사용자에게 제시됨
- [ ] 리포트 파일이 `{implementation_artifacts}/tests/e2e-test-report-{feature}.md`에 저장됨
- [ ] 설계 문서 상태가 "검증 완료"로 갱신됨
- [ ] Tech-Spec `## E2E Test Design` → `## E2E Test Results`로 갱신됨
- [ ] AC → 테스트 매핑에 결과가 포함됨
- [ ] 미해결 사항이 정리됨
