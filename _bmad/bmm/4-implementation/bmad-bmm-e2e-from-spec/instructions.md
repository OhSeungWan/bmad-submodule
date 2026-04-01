# E2E Test Design from Tech-Spec

**Goal**: Tech-Spec 설계 문서를 기반으로 E2E 테스트 설계 문서를 작성한다. 실제 테스트 코드(.spec.ts, .page.ts)는 생성하지 않는다.

**핵심 원칙**: 이 워크플로우는 **설계 단계**만 담당한다. 실제 테스트 코드 구현은 워크트리에서 `implement-instructions.md`를 참조하여 별도로 수행한다.

---

## Step 0: Tech-Spec 로드 및 환경 확인

### 0-1. Tech-Spec 문서 로드

사용자 인자(arguments)로 전달된 tech-spec 파일을 찾는다.

- `{implementation_artifacts}/` 에서 매칭되는 tech-spec 파일 검색
- 파일이 없으면 사용자에게 경로를 질문
- Tech-Spec의 다음 섹션을 파싱:
  - **Scope** (In Scope / Out of Scope)
  - **files_to_modify** (frontmatter)
  - **Implementation Plan > Tasks**
  - **Acceptance Criteria**
  - **Testing Strategy**

### 0-2. 실행 환경 감지 (메인 vs 워크트리)

현재 작업 디렉토리가 메인 프로젝트인지 워크트리인지 판별한다.

**판별 방법:**
```bash
# .git이 파일이면 워크트리, 디렉토리면 메인
test -f .git && echo "worktree" || echo "main"
```

**환경별 동작:**

| 환경 | 설계 문서 위치 | tests/e2e/ 조회 위치 | 비고 |
|------|-------------|-------------------|------|
| 메인 디렉토리 | `{implementation_artifacts}/tests/` | 메인 `tests/e2e/` | design 단계 기본 |
| 워크트리 | 메인의 `{implementation_artifacts}/tests/` | 워크트리 `tests/e2e/` | implement/verify 단계 기본 |

- 워크트리에서 설계 문서를 찾을 수 없으면 메인 프로젝트 경로로 폴백
- `playwright.config.ts`가 워크트리에 없으면 메인에서 복사 여부를 사용자에게 확인

### 0-3. E2E 테스트 환경 확인

프로젝트의 E2E 테스트 프레임워크를 감지한다.

- `package.json` 에서 `@playwright/test` 확인
- `playwright.config.ts` 존재 여부
- npm 스크립트 확인: `test:e2e`, `test:e2e:ui`, `test:e2e:report`
- 기존 `tests/e2e/` 디렉토리 구조 확인

**프레임워크가 없으면**: 사용자에게 설치 여부를 확인하고 Playwright 기본 설정을 제안한다.

### 0-4. 프로젝트 E2E 컨텍스트 및 경로 확인

프로젝트별 E2E 설정과 소스/테스트 디렉토리 경로를 확인한다.

**A. E2E 컨텍스트 로드:**
- 경로: `{project-root}/_bmad/_config/e2e-context.md` (고정 경로, 고정 이름)
- **파일이 있으면**: testid 컨벤션, 디렉토리 구조, 프로젝트 제약 등을 참조. `source_dir`, `test_dir` 등 기본값을 오버라이드.
- **파일이 없으면**: `workflow.yaml`의 `defaults` 블록 값을 사용. 경고 없이 정상 진행.

**B. 소스/테스트 디렉토리 확인:**
1. e2e-context.md에서 `source_dirs`, `test_dir` 로드 (있으면)
2. 없으면 defaults 사용 (`["src", "app"]`, `tests/e2e`)
3. 각 디렉토리 존재 여부 확인 (없는 경로는 무시, 모두 없으면 사용자에게 질문)
4. `test_dir`이 존재하지 않으면 → 사용자에게 실제 경로를 질문

### 0-5. 프로젝트 소스 구조 파악

프로젝트의 소스 코드 구조를 탐색하여 테스트 대상을 파악한다.

- `source_dirs`의 각 디렉토리 하위 구조 확인
- 라우팅 패턴 파악 (App Router, Pages Router, 커스텀 등)
- 컴포넌트/페이지 위치 규칙 파악
- 기존 `data-testid` 사용 현황 확인

> 특정 아키텍처 패턴(FSD, atomic design 등)을 전제하지 않는다. 프로젝트의 실제 구조를 읽어서 파악한다.

### 0-6. 기존 테스트 자산 파악

이미 작성된 E2E 테스트가 있는지 **구체적 경로를 스캔**한다.

**스캔 대상:**
```bash
# 기존 E2E 디렉토리 구조
ls tests/e2e/*/

# 기존 POM 클래스
find tests/e2e/ -name "*.page.ts"

# 기존 fixture
find tests/e2e/ -name "*.fixture.ts"

# 기존 mock 데이터
find tests/e2e/ -path "*/mocks/*.json"
```

**확인 사항:**
- 기존 디렉토리 구조 패턴 (Feature-Colocated vs flat vs 기타)
- 기존 Page Object 클래스 목록 및 위치
- 기존 fixture 체인 구조
- 기존 test-data 상수
- 재사용 가능한 헬퍼 함수

> **중요**: 기존 테스트가 있으면 그 구조를 따른다. 없으면 이 워크플로우의 기본 구조(Feature-Colocated)를 제안한다.

---

## Step 1: 테스트 시나리오 설계

### 1-1. 영향받는 페이지/라우트 추출

Tech-Spec의 `files_to_modify`와 `Scope`에서 테스트 대상을 식별한다.

**추출 기준:**
- 라우트/페이지 파일 → 사용자가 접근하는 URL
- 페이지 컴포넌트 → 내부 링크가 수정된 페이지
- UI 컴포넌트 → UI 동작 변경

> 프로젝트 E2E 컨텍스트에 아키텍처 레이어가 정의되어 있으면 해당 순서로 탐색한다.

**각 대상에 대해 정리:**

| 페이지 | URL | 테스트 관점 |
|--------|-----|------------|
| (페이지명) | (접근 URL) | (검증할 사항) |

### 1-2. Acceptance Criteria → 테스트 케이스 매핑

Tech-Spec의 Acceptance Criteria를 E2E 테스트 케이스로 변환한다.

- `Given/When/Then` 형식의 AC → 그대로 테스트 시나리오
- 암시적 AC (URL 패턴, 리다이렉트, SEO 태그 등) → 추가 테스트 시나리오
- Happy path + Edge case 구분

### 1-3. data-testid 사전 분석

POM 설계에 앞서, 테스트 대상 컴포넌트의 기존 `data-testid` 현황을 조사한다.

**프로젝트 아키텍처에 따른 컴포넌트 탐색:**

프로젝트 E2E 컨텍스트에 탐색 대상이 정의되어 있으면 해당 순서로 탐색한다.
정의되어 있지 않으면 Tech-Spec의 `files_to_modify` 목록과 `source_dirs`를 기준으로 탐색한다.

```bash
# 프로젝트 소스 내 data-testid 현황 스캔 (source_dirs 및 files_to_modify 대상)
grep -r "data-testid" <source_dirs 및 files_to_modify에 명시된 파일/디렉토리>
```

**data-testid 네이밍 컨벤션 (기본 권장값):**

> 프로젝트 E2E 컨텍스트에 별도 컨벤션이 있으면 그것을 따른다. 없으면 아래 기본값을 사용한다.

| 규칙 | 패턴 | 예시 |
|------|------|------|
| 기본 | `{section}-{element}` | `hero-section`, `hero-cta` |
| 리스트 항목 | `{name}-{id}` 또는 `{name}-{index}` | `product-card-123` |
| 중첩 영역 | `{parent}-{child}` | `benefits-card`, `benefits-cta` |
| 인터랙티브 | `{section}-{action}-{target}` | `header-search-input` |

- **kebab-case** 필수: `product-card` ✅ / `productCard` ❌
- 기존 `data-testid`는 **변경 금지** (다른 테스트에서 사용 중일 수 있음)
- 동적 testid: `data-testid={`item-${id}`}` 형태

**분석 방법:**
1. Step 1-1에서 식별한 페이지/컴포넌트 파일 목록을 순회
2. 각 파일에서 `data-testid` 속성이 이미 있는 요소를 수집
3. 테스트 시나리오에서 상호작용하거나 검증해야 하는 요소 중 `data-testid`가 **없는** 것을 식별

**결과 정리:**

| 컴포넌트 파일 | 요소 설명 | 기존 testid | 테스트 용도 | 조치 |
|--------------|----------|------------|-----------|------|
| src/path/A.tsx | 제출 버튼 | `submit-btn` | 클릭 대상 | ✅ 있음 |
| src/path/B.tsx | 가격 텍스트 | _(없음)_ | 값 검증 | ⚠️ 추가 필요 |

> 이 분석 결과는 설계 문서 §9와 Tech-Spec `## E2E data-testid 요구사항` 섹션에 반영된다.

### 1-4. 테스트 계획 제시

**사용자에게 테스트 계획을 제시하고 승인을 받는다:**

```
## E2E 테스트 계획

### Page Objects (POM)
- PageA.page.ts: (역할)
- PageB.page.ts: (역할)

### Spec 파일
- feature-a.spec.ts: N개 테스트
- feature-b.spec.ts: N개 테스트

### 테스트 데이터
- 필요한 실제 데이터 (ID, 이름 등)

### data-testid 추가 필요
- N개 요소에 data-testid 부착 필요 (구현 단계에서 함께 적용)

총 예상 테스트 수: N개
```

<ask>이 테스트 계획으로 진행할까요? 수정사항이 있으면 알려주세요.</ask>

---

## Step 2: 테스트 설계 문서 작성

> **이 단계에서 실제 코드 파일(.spec.ts, .page.ts 등)을 생성하지 않는다.**
> 모든 설계 내용은 단일 설계 문서에 작성한다.

### 2-1. 설계 문서 생성

`{implementation_artifacts}/tests/e2e-test-design-{feature-name}.md` 파일을 생성한다.

아래 템플릿의 모든 섹션을 포함한다:

```markdown
# E2E 테스트 설계: {feature-name}

**Tech-Spec**: {tech-spec 파일 경로}
**작성일**: {date}
**프레임워크**: Playwright (chromium)

---

## 1. 테스트 대상

| 페이지 | URL 패턴 | 테스트 관점 |
|--------|----------|------------|
| (페이지명) | (URL) | (검증 사항) |

## 2. AC → 테스트 매핑

| AC | 테스트 시나리오 | Spec 파일 | 우선순위 |
|----|----------------|----------|---------|
| AC 1 | (시나리오 설명) | feature-a.spec.ts | P0 |

## 3. 파일 구조

> **기본 구조**: Feature-Colocated 방식 — feature 폴더 안에 POM, fixture, mock, spec을 응집시킨다.
> 프로젝트 E2E 컨텍스트에 별도 구조가 정의되어 있으면 그것을 따른다.
> 기존 E2E 테스트가 있으면 그 구조를 따른다.

구현 시 생성할 파일 목록 (Feature-Colocated 기본 구조):

```
tests/e2e/
├── _shared/                          # 공통 자산 (전 feature 공유)
│   ├── base.fixture.ts               # 공통 fixture (viewport, 인증 등)
│   ├── test-data.ts                  # 공통 상수 (BASE_URL 등)
│   └── helpers/                      # 공통 헬퍼 (필요 시)
│
└── {feature-name}/                   # feature 단위 (페이지/라우트 기준)
    ├── {feature}.fixture.ts          # feature 전용 fixture (base 확장 + POM + Mock)
    ├── {feature}.page.ts             # feature 전용 POM
    ├── mocks/                        # feature 전용 mock JSON (필요 시)
    │   ├── {endpoint}-success.json
    │   └── {endpoint}-error.json
    ├── {scenario-a}.spec.ts          # spec 파일
    └── {scenario-b}.spec.ts          # spec 파일
```

**feature 단위 기준**: 페이지/라우트 기준으로 분리한다.

**여러 페이지를 걸치는 사용자 여정**은 `_flows/` 폴더로 분리:

```
tests/e2e/
└── _flows/                           # 크로스 페이지 플로우
    └── {flow-name}/
        ├── flow.fixture.ts           # 여러 POM 조합
        └── full-journey.spec.ts
```

> **POM 재사용**: 특정 POM이 여러 feature에서 공유될 경우 `_shared/pages/`로 승격한다.

## 4. Page Object 설계

### {PageA}Page

- **파일**: `tests/e2e/pages/{page-a}.page.ts`
- **담당 URL**: `/path/to/page`
- **Locator 전략**:

| 요소 | Locator | 방식 | 비고 |
|------|---------|------|------|
| 제출 버튼 | `data-testid="submit-btn"` | testid | |
| 로그인 버튼 | `getByRole('button', { name: '로그인' })` | role | testid 없음 |

- **메서드 설계**:

| 메서드 | 역할 | 반환값 |
|--------|------|--------|
| `goto()` | 페이지 이동 | void |
| `expectTitle(text)` | 타이틀 검증 | void |
| `clickSubmit()` | 제출 버튼 클릭 | void |

### {PageB}Page
(동일 구조)

## 5. Spec 시나리오 상세

### {feature-a}.spec.ts

```typescript
// 의사 코드 — 실제 코드가 아님
test.describe('{기능 그룹명}', () => {

  test('{AC 1에 대응하는 테스트명 (한글)}', async ({ page }) => {
    // Given: (전제 조건)
    // When: (사용자 행동)
    // Then: (기대 결과)
    // 검증 포인트:
    //   - (구체적 expect 항목 1)
    //   - (구체적 expect 항목 2)
  })

  test('{AC 2에 대응하는 테스트명 (한글)}', async ({ page }) => {
    // Given / When / Then 동일 구조
  })

})
```

### {feature-b}.spec.ts
(동일 구조)

## 6. 테스트 데이터

| 용도 | 키 | 값 | 출처/비고 |
|------|---|---|----------|
| (용도) | TEST_SLUG | (실제 값) | (CDN/API/DB) |

## 7. API Mock 설계

### Mock 대상 API

| 엔드포인트 | 메서드 | Mock 유형 | 사유 |
|-----------|--------|----------|------|
| `/api/...` | GET | `success` | 정상 데이터 렌더링 검증 |
| `/api/...` | POST | `success` / `error` | 폼 제출 성공/실패 검증 |

> Mock 유형: `success` (정상 응답), `error` (에러 응답), `empty` (빈 데이터), `delayed` (지연 응답), `abort` (네트워크 실패)

### Mock 데이터 파일

```
tests/e2e/mocks/
├── {domain}/
│   ├── {endpoint}-success.json     # 정상 응답
│   ├── {endpoint}-error.json       # 에러 응답 (선택)
│   └── {endpoint}-empty.json       # 빈 데이터 응답 (선택)
```

### Mock Fixture 설계

| Fixture 이름 | 대상 API | 기본 동작 | 비고 |
|-------------|---------|----------|------|
| `mock{Domain}API` | `/api/{path}` | success 응답 반환 | 테스트별 오버라이드 가능 |

### Mock 판정 기준

**Mock이 필요한 경우:**

| 상황 | 예시 | 이유 |
|------|------|------|
| 에러/엣지케이스 UI 검증 | 500 에러, 빈 목록, 인증 만료 | 실제 서버에서 의도적으로 재현 불가 |
| 데이터 상태별 UI 분기 | 0건/N건/페이지네이션 끝 | 특정 조건의 데이터를 DB에서 보장 불가 |
| 외부 서비스 의존 | 결제, 본인인증, 소셜 로그인 | 호출 비용/제약, 테스트 환경 미지원 |
| 로딩/지연 UI 검증 | 스피너, 스켈레톤 | 일관된 느린 응답을 서버에서 만들 수 없음 |
| 테스트 데이터 불안정 | QA DB 초기화, 특정 ID 삭제 가능 | 특정 slug/ID 존재를 항상 보장 불가 |

**Mock이 불필요한 경우:**

| 상황 | 예시 | 이유 |
|------|------|------|
| 정적 페이지 | About, 이용약관 | API 호출 없음 |
| CDN 리소스만 사용 | 이미지, 정적 파일 | 네트워크 가로채기 불필요 |
| 네비게이션/라우팅 검증 | URL 이동, 브레드크럼 | 서버 응답과 무관 |
| 안정적 읽기 API의 Happy path | 항상 데이터가 있는 공개 목록 | 실서버 테스트가 더 신뢰성 높음 |

> **권장 전략**: Happy path는 실서버, Edge case/에러는 Mock
>
> **판정 결과**: (Mock 필요 / Mock 불필요 / 부분 Mock — 사유 기재)

## 8. Fixture 확장

기존 `base.fixture.ts`에 추가할 POM 및 Mock Fixture 등록:

```typescript
// 의사 코드 — POM 등록
{
  pageAPage: PageAPage,
  pageBPage: PageBPage,
}

// 의사 코드 — Mock Fixture 등록 (API Mock이 필요한 경우)
{
  mock{Domain}API: async ({ page }, use) => {
    // page.route() 기반 mock 설정 함수를 제공
    // 테스트에서 await mock{Domain}API() 호출로 활성화
  },
}
```

## 9. data-testid 추가 필요 목록

Step 1-3 분석 결과, 구현 코드에 `data-testid`가 없어 추가가 필요한 요소:

| 컴포넌트 파일 | 요소 | 제안 testid | 테스트 용도 | 현재 대체 locator |
|--------------|------|------------|-----------|------------------|
| src/path/Component.tsx | 제출 버튼 | `submit-button` | 클릭 대상 | `getByRole(...)` |
| src/path/Card.tsx | 가격 표시 | `product-price` | 값 검증 | `getByText(...)` (불안정) |

> **중요**: 이 목록은 Tech-Spec의 `## E2E data-testid 요구사항` 섹션에도 반영되어,
> 기능 구현 단계에서 개발자가 `data-testid`를 함께 부착할 수 있도록 한다.

## 10. 실행 커맨드

```bash
# 전체 실행
npx playwright test tests/e2e/ --project=chromium --reporter=list

# Spec별 개별 실행
npx playwright test tests/e2e/{feature-a}.spec.ts --project=chromium
npx playwright test tests/e2e/{feature-b}.spec.ts --project=chromium
```

## 11. 구현 시 주의사항

- (프로젝트 특화 주의사항)
- (기존 POM/fixture 재사용 포인트)
- (인증 필요 여부, 테스트 데이터 준비 등)
```

### 2-2. 설계 문서 검증

- [ ] 모든 AC가 테스트 시나리오에 매핑됨
- [ ] POM 설계에 locator 전략이 명시됨
- [ ] 파일 구조가 기존 테스트 구조와 일관됨
- [ ] 테스트 데이터에 실제 값이 포함됨
- [ ] data-testid 추가 필요 목록이 작성됨
- [ ] API Mock 필요 여부가 판정됨 (Mock 필요 시 §7 작성 완료)

---

## Step 3: Tech-Spec 업데이트

### 3-1. Tech-Spec 문서에 E2E 설계 참조 및 data-testid 요구사항 추가

원본 Tech-Spec 문서 끝에 두 개 섹션을 추가한다:

#### A. `## E2E Test Design` 섹션

```markdown
## E2E Test Design

**설계 문서**: `{implementation_artifacts}/tests/e2e-test-design-{feature}.md`
**작성일**: {date}
**상태**: 설계 완료 — 구현 대기

### 테스트 개요

| Spec 파일 | 테스트 수 | 대응 AC |
|-----------|----------|--------|
| {feature-a}.spec.ts | N개 | AC 1, 2, 3 |
| {feature-b}.spec.ts | N개 | AC 4, 5 |

### Page Objects

| POM | 담당 URL |
|-----|---------|
| {PageA}Page | /path/a |
| {PageB}Page | /path/b |

### 구현 방법

워크트리에서 구현 시 설계 문서를 참조:

```bash
# 설계 문서 확인
cat {implementation_artifacts}/tests/e2e-test-design-{feature}.md

# 구현 후 테스트 실행
npx playwright test tests/e2e/ --project=chromium
```
```

#### B. `## E2E data-testid 요구사항` 섹션

> **이 섹션의 목적**: 기능 구현 시 개발자가 `data-testid`를 함께 부착하도록 명시한다.
> E2E 테스트 안정성의 핵심이므로, 구현 PR에 data-testid 부착을 포함시킨다.

```markdown
## E2E data-testid 요구사항

> 아래 `data-testid` 속성을 기능 구현 시 함께 부착해야 합니다.
> E2E 테스트의 안정적인 요소 선택을 위해 필수입니다.

### 추가 대상

| 컴포넌트 파일 | 요소 | data-testid | 부착 위치 (JSX) |
|--------------|------|------------|----------------|
| `src/path/Component.tsx` | 제출 버튼 | `submit-button` | `<button data-testid="submit-button">` |
| `src/path/Card.tsx` | 가격 표시 | `product-price` | `<span data-testid="product-price">` |

### 네이밍 규칙

- `kebab-case` 사용: `product-card`, `submit-button`
- 리스트 항목: `{name}-{index}` 또는 `{name}-{id}` (예: `product-card-123`)
- 영역 구분: `{section}-{element}` (예: `header-search-input`)

### 기존 data-testid (변경 금지)

| 컴포넌트 파일 | 기존 testid | 비고 |
|--------------|------------|------|
| (이미 존재하는 testid 목록) | | 다른 테스트에서 사용 중일 수 있음 |

상세는 설계 문서 §9 참조.
```

### 3-2. 완료 확인

- [ ] 설계 문서가 `{implementation_artifacts}/tests/` 에 저장됨
- [ ] Tech-Spec에 `## E2E Test Design` 섹션이 추가됨
- [ ] Tech-Spec에 `## E2E data-testid 요구사항` 섹션이 추가됨 (추가 필요 항목이 있는 경우)
- [ ] 사용자에게 설계 완료 안내와 다음 단계(워크트리 구현) 가이드 제시

---

## 핵심 규칙

### ✅ DO

- Tech-Spec AC를 기준으로 테스트 시나리오 설계
- `data-testid` 기반 locator 전략 우선 설계
- POM 클래스 구조, 메서드, locator를 상세히 문서화
- 기존 POM/fixture 재사용 포인트 명시
- 실제 테스트 데이터 포함
- 한글로 테스트 이름 작성
- 의사 코드로 테스트 로직 표현 (실제 코드 X)
- API Mock 필요 여부를 판정하고, 필요 시 §7에 Mock 설계 포함
- Mock Fixture는 POM과 분리하여 설계 (관심사 분리)

### ❌ DON'T

- **실제 .spec.ts, .page.ts, test-data.ts 파일을 생성하지 않는다**
- tests/e2e/ 디렉토리에 어떤 파일도 쓰지 않는다
- Tech-Spec에 없는 기능을 테스트 시나리오에 포함하지 않는다
- 복잡한 추상화나 헬퍼를 설계하지 않는다
- 불안정한 CSS class 기반 locator를 설계에 포함하지 않는다
- POM 클래스 내부에 API mocking 로직을 넣지 않는다
