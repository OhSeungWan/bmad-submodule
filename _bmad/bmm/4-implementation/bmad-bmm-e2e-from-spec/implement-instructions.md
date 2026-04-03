# E2E 테스트 코드 구현 (설계 문서 기반)

**Goal**: 설계 문서(`e2e-test-design-*.md`)를 기반으로 실제 E2E 테스트 코드를 작성한다.

**실행 컨텍스트**: 워크트리에서 기능 구현과 함께 실행한다.

**전제 조건**: `e2e-from-spec` 설계 단계에서 작성된 설계 문서가 `{implementation_artifacts}/tests/` 에 존재해야 한다.

---

## Step 0: 설계 문서 로드 및 환경 확인

### 0-1. 설계 문서 로드

사용자 인자로 전달된 설계 문서를 찾는다.

- `{implementation_artifacts}/tests/e2e-test-design-*.md` 에서 검색
- 파일이 없으면 사용자에게 경로를 질문
- 다음 섹션을 파싱:
  - **파일 구조** (§3): 생성할 파일 목록
  - **POM 설계** (§4): 클래스, 메서드, locator
  - **Spec 시나리오** (§5): 테스트 로직 (의사 코드)
  - **테스트 데이터** (§6): 상수 및 값
  - **Fixture 확장** (§7): merged-fixtures.ts 변경
  - **data-testid 목록** (§8): 구현에 함께 적용할 사항

### 0-2. 워크트리 테스트 환경 확인

현재 워크트리의 테스트 자산을 확인한다.

**환경 감지:**
```bash
# 워크트리 여부 판별
test -f .git && echo "worktree" || echo "main"
```

**확인 사항:**
- `playwright.config.ts` 존재 여부
- `package.json`에 `@playwright/test` 의존성 및 `test:e2e` 스크립트 존재 여부
- 기존 `playwright/e2e/` 디렉토리 구조 (Feature-Colocated 패턴 여부)
- 기존 `playwright/support/merged-fixtures.ts` 존재 여부
- 기존 feature 폴더 목록 및 POM/fixture/mock 패턴
- 충돌 없이 추가 가능한지 확인

**환경 미비 시:** 사용자에게 메인 프로젝트에서 E2E 인프라 머지가 필요한지 안내

---

## Step 1: 테스트 코드 작성

설계 문서의 각 섹션을 참조하여 실제 코드를 작성한다.

### 1-1. 테스트 데이터 정의

**공통 상수** (BASE_URL 등)는 `playwright/support/test-data.ts`에 추가한다.
**feature 전용 상수**는 feature fixture 파일 내에 정의하거나 별도 `test-data.ts`로 분리한다.

- 기존 `support/test-data.ts`가 있으면 **추가**하는 방식
- 설계 문서의 값을 그대로 사용

### 1-2. API Mock 데이터 구현 (설계 문서 §7이 있는 경우)

설계 문서 §7에 API Mock 설계가 있으면, 아래 순서로 구현한다.
§7이 "Mock 불필요"로 판정되었으면 이 단계를 건너뛴다.

#### A. Mock JSON 데이터 생성

**feature 폴더 내** `mocks/` 에 설계 문서 §7의 응답 데이터를 JSON으로 작성.

```
playwright/e2e/{feature-name}/mocks/
├── {endpoint}-success.json     # 정상 응답
├── {endpoint}-error.json       # 에러 응답 (선택)
└── {endpoint}-empty.json       # 빈 데이터 응답 (선택)
```

**Mock JSON 네이밍 규칙:**
- `{endpoint}-{variant}.json` 형태: `product-list-success.json`, `config-error.json`
- 실제 API 스키마와 동일한 구조 유지 (Rentre API OAS 참조)
- success / error / empty 등 시나리오별 분리

#### B. Mock을 Feature Fixture에 통합

Mock은 **feature fixture 내부에** POM과 함께 정의한다 (별도 mock.fixture.ts 불필요).

**구현 원칙:**
- `page.route()` 로 네트워크 가로채기 — **`page.goto()` 전에 등록**
- 각 mock은 Playwright custom fixture로 노출
- 테스트에서 `await mockXxxAPI()` 형태로 호출하여 활성화
- `page.unrouteAll({ behavior: 'ignoreErrors' })` 로 테스트 후 정리

### 1-3. Page Object Model 생성

**feature 폴더 내** `{feature}.page.ts`에 설계 문서 §4의 POM 클래스를 구현.

```
playwright/e2e/{feature-name}/{feature-name}.page.ts
```

**구현 원칙:**
- 설계 문서의 메서드 목록 그대로 구현
- 설계 문서의 locator 전략 그대로 적용
- `waitForTimeout` 최소화, 요소 기반 대기 우선
- 기존 POM이 있으면 확장 (중복 생성 금지)
- **POM 클래스 안에 `page.route()` 호출을 넣지 않는다** (Mock은 fixture 영역)

**Locator 우선순위 (설계 문서에 명시된 대로):**
1. `data-testid` → `page.getByTestId('...')`
2. Role/Label → `page.getByRole(...)`, `page.getByLabel(...)`
3. CSS selector → `page.locator('...')` (마지막 수단)

### 1-4. Feature Fixture 생성 (Fixture B 패턴)

> **핵심 아키텍처**: `support/merged-fixtures` → `{feature}.fixture` → spec에서 import
>
> 각 feature는 자체 fixture 파일을 가지며, `support/merged-fixtures.ts`를 확장한다.
> **merged-fixtures에 모든 POM/Mock을 쌓지 않는다** — feature가 늘어나면 비대해지고 불필요한 오버헤드 발생.

**Fixture 체이닝 구조:**

```
playwright/support/merged-fixtures.ts      ← 공통 (viewport, 인증 등)
    ↑ extends
playwright/e2e/{feature}/{feature}.fixture.ts  ← feature 전용 (POM + Mock)
    ↑ import
playwright/e2e/{feature}/*.spec.ts           ← spec 파일
```

**Feature Fixture 패턴 예시:**

```typescript
// playwright/e2e/plp/plp.fixture.ts
import { test as base } from '../../support/merged-fixtures';
import { PlpPage } from './plp.page';
import brandListSuccess from './mocks/brand-list-success.json';

type PlpFixtures = {
  plpPage: PlpPage;
  mockBrandAPI: (variant?: 'success' | 'empty' | 'error') => Promise<void>;
};

export const test = base.extend<PlpFixtures>({
  plpPage: async ({ page }, use) => {
    await use(new PlpPage(page));
  },
  mockBrandAPI: async ({ page }, use) => {
    await use(async (variant = 'success') => {
      const responses = {
        success: { status: 200, json: brandListSuccess },
        empty: { status: 200, json: { data: [] } },
        error: { status: 500, json: { message: 'Server Error' } },
      };
      await page.route('**/api/v*/brand/**', (route) =>
        route.fulfill(responses[variant])
      );
    });
  },
});

export { expect } from '@playwright/test';
```

**기존 feature fixture가 있을 때:** 새 feature fixture를 추가하더라도 기존 fixture를 수정하지 않는다. 각 feature는 독립적이다.

### 1-5. Spec 파일 생성

**feature 폴더 내**에 설계 문서 §5의 시나리오를 실제 코드로 변환.

```
playwright/e2e/{feature-name}/{scenario}.spec.ts
```

**변환 원칙:**
- 의사 코드의 Given/When/Then → 실제 Playwright 호출
- 테스트 이름은 설계 문서의 한글 이름 그대로
- 각 테스트는 독립적 (순서 의존 없음)
- `test.describe` 블록으로 기능 단위 그룹화
- **feature fixture에서 `test`를 import** (Playwright 기본 test 대신)
- **`page.route()` 등록은 반드시 `page.goto()` 전에 수행** (beforeEach 또는 테스트 초반)

**Spec 파일 import 패턴:**

```typescript
// playwright/e2e/plp/brand-filter.spec.ts
import { test, expect } from './plp.fixture';  // feature fixture에서 import

test.describe('브랜드 필터', () => {
  test('브랜드 목록이 렌더링된다', async ({ plpPage, mockBrandAPI }) => {
    await mockBrandAPI('success');  // page.goto 전에 mock 등록
    await plpPage.goto();
    await expect(plpPage.brandList).toBeVisible();
  });

  test('빈 브랜드일 때 빈 상태가 표시된다', async ({ plpPage, mockBrandAPI }) => {
    await mockBrandAPI('empty');
    await plpPage.goto();
    await expect(plpPage.emptyState).toBeVisible();
  });
});
```

### 1-6. data-testid 부착

설계 문서 §9 및 Tech-Spec `## E2E data-testid 요구사항` 섹션의 목록을 참고하여,
소스 코드에 `data-testid` 속성을 추가한다.

**이 단계는 기능 구현과 동시에 수행하는 것이 가장 효율적이다.**

**부착 절차:**
1. 설계 문서 §9의 테이블에서 추가 대상 목록 확인
2. 각 컴포넌트 파일을 열어 해당 JSX 요소에 `data-testid` 속성 추가
3. POM 클래스의 locator가 부착된 testid를 참조하는지 확인

**네이밍 규칙:**
- `kebab-case`: `product-card`, `submit-button`
- 리스트 항목: `{name}-{id}` (예: `product-card-123`)
- 영역 구분: `{section}-{element}` (예: `header-search-input`)

**주의:**
- 기존 `data-testid`는 변경하지 않는다 (다른 테스트에서 사용 중일 수 있음)
- 동적 testid는 `data-testid={`item-${id}`}` 형태로 부착
- 조건부 렌더링 요소도 렌더링 시점에 testid가 포함되도록 확인

---

## Step 2: 작성 결과 확인

### 2-1. 파일 목록 대조

설계 문서 §3의 파일 구조와 실제 생성된 파일을 비교한다.

```bash
# feature 폴더 구조 확인
ls -la playwright/e2e/{feature-name}/
ls -la playwright/e2e/{feature-name}/mocks/

# 공통 자산 확인
ls -la playwright/support/
```

### 2-2. 완료 체크

- [ ] feature 폴더가 `playwright/e2e/{feature-name}/`에 생성됨 (Feature-Colocated)
- [ ] 설계 문서의 모든 Spec 파일이 feature 폴더 내에 생성됨
- [ ] POM 클래스가 `{feature}.page.ts`로 feature 폴더 내에 생성됨
- [ ] Feature fixture가 `{feature}.fixture.ts`로 생성되고 `support/merged-fixtures`를 확장함
- [ ] Feature fixture에 POM + Mock이 함께 등록됨 (merged-fixtures에 추가하지 않음)
- [ ] Mock JSON이 `{feature}/mocks/`에 생성됨 (Mock 필요 시)
- [ ] Spec에서 feature fixture를 import함 (`import { test } from './{feature}.fixture'`)
- [ ] Spec에서 mock 호출이 `page.goto()` 이전에 위치함
- [ ] 테스트 이름이 한글이고 AC와 대응됨
- [ ] 각 테스트가 독립적으로 실행 가능함
- [ ] 설계 문서 §9의 data-testid가 소스 코드에 부착됨
- [ ] POM locator가 부착된 data-testid를 참조함

### 2-3. 사용자에게 결과 보고

생성된 파일 목록과 설계 문서 대비 커버리지를 보고한다.

> **이 단계에서 테스트를 실행하지 않는다.** 기능 구현이 완료된 후 `verify-instructions.md`에 따라 검증한다.

---

## 핵심 규칙

### ✅ DO

- 설계 문서의 시나리오를 충실히 코드로 변환
- 설계 문서의 locator 전략 그대로 적용
- 기존 POM/fixture 재사용 우선
- **Feature-Colocated 구조 준수**: POM, fixture, mock, spec을 feature 폴더 내에 응집
- **Fixture B 패턴 준수**: `support/merged-fixtures` → `{feature}.fixture` → spec import
- 공통 테스트 데이터는 `support/test-data.ts`, feature 전용은 fixture 내에 정의
- API Mock JSON은 `{feature}/mocks/` 내에, mock fixture는 feature fixture에 통합
- Mock fixture 호출은 반드시 `page.goto()` **이전에** 수행
- 한글로 테스트 이름 작성

### ❌ DON'T

- 설계 문서에 없는 테스트를 추가하지 않는다
- 이 단계에서 테스트를 실행하지 않는다 (검증은 verify 단계)
- 복잡한 fixture나 추상화를 만들지 않는다
- 불안정한 CSS class selector를 `data-testid` 대신 사용하지 않는다
- **POM 클래스 안에 `page.route()` 호출을 넣지 않는다** (Mock은 fixture 영역)
- Mock JSON에 실제 비즈니스 로직을 넣지 않는다 (응답 데이터만 정의)
