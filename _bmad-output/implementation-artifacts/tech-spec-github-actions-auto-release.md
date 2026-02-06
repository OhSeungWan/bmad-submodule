---
title: 'GitHub Actions 자동 릴리즈 워크플로우'
slug: 'github-actions-auto-release'
created: '2026-02-06'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['GitHub Actions', 'Node.js (package.json)', 'Prettier (md/yaml)']
files_to_modify: ['.github/workflows/release.yml', 'package.json', 'CHANGELOG.md']
code_patterns: ['Conventional Commit with emoji prefix (✨ feat:, 📝 docs:, 🔧 chore:, 🐛 fix:)']
test_patterns: []
---

# Tech-Spec: GitHub Actions 자동 릴리즈 워크플로우

**Created:** 2026-02-06

## Overview

### Problem Statement

현재 프로젝트에 릴리즈 프로세스가 전무하다. Git 태그, GitHub Release, CHANGELOG 관리 없이 커밋만 쌓이는 상태로, 버전 추적과 변경 이력 관리가 불가능하다. 또한 package.json(1.0.0)과 README(v1.1.0) 간 버전 불일치가 존재한다.

### Solution

Git 태그(`v*`) push 시 트리거되는 GitHub Actions 워크플로우를 생성하여 Conventional Commit 기반 카테고리별 릴리즈 노트를 자동 생성하고, `package.json`의 version 필드를 자동으로 범프하며, 별도 `CHANGELOG.md` 파일을 자동 업데이트한다.

### Scope

**In Scope:**

- `.github/workflows/release.yml` 워크플로우 생성
- `v*` 태그 push 시 자동 트리거
- Conventional Commit 파싱 → `feat`, `fix`, `docs` 등 카테고리별 릴리즈 노트 생성
- `package.json` version 필드 자동 범프
- GitHub Release 자동 생성
- `CHANGELOG.md` 별도 파일 자동 생성/업데이트
- `package.json` 버전 불일치 수정 (1.0.0 → 1.1.0)

**Out of Scope:**

- npm publish, 빌드 아티팩트 첨부
- semantic-release 같은 자동 버전 결정 (태그에서 버전 직접 지정)
- 다른 repo 알림/연동
- README 내 Changelog 섹션 자동 업데이트 (별도 CHANGELOG.md로 대체)

## Context for Development

### Codebase Patterns

- **커밋 메시지 형식**: 이모지 + Conventional Commit (`✨ feat:`, `📝 docs:`, `🔧 chore:`, `🐛 fix:`, `⬆️ chore:`, `🎨 style:`)
- **이모지-타입 매핑**: 이모지가 선행하지만 일부 커밋(`fix:`, `feat:`)에는 이모지 없음 → 파서가 둘 다 처리해야 함
- **프로젝트 도구**: Prettier (2-space indent, single quotes, md/yaml 포맷팅)
- **GitHub 원격**: `OhSeungWan/bmad-submodule` (master 브랜치)
- **CI/CD**: 기존 없음 (Clean Slate)
- **README Changelog**: 수동으로 관리 중 (v1.1.0, v1.0.0 엔트리 — line 494~)
- **버전 불일치**: `package.json` = `1.0.0`, README 배지/테이블 = `v1.1.0`

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `package.json` | 버전 필드 관리 대상 (현재 1.0.0 → 1.1.0 수정 필요) |
| `README.md` | 기존 Changelog 섹션 참고 (line 494~), 버전 배지 (line 3) |
| `.prettierrc` | 포맷팅 설정 (2-space, single quotes) |
| `.prettierignore` | `_bmad-output/`, `node_modules/` 등 제외 |

### Technical Decisions

- **태그 기반 트리거**: 사용자가 `git tag v1.2.0 && git push --tags`로 명시적으로 버전 결정
- **이모지 커밋 파싱**: 이모지 prefix를 제거한 후 Conventional Commit type 추출
- **CHANGELOG.md 별도 관리**: README Changelog 섹션과 별도로 `CHANGELOG.md` 파일 자동 생성
- **워크플로우에서 커밋**: CHANGELOG.md와 package.json 업데이트 후 워크플로우가 master에 직접 커밋
- **카테고리 분류**: feat → 새 기능, fix → 버그 수정, docs → 문서, chore/style/refactor → 기타 변경

## Implementation Plan

### Tasks

- [x] Task 1: `package.json` 버전 불일치 수정
  - File: `package.json`
  - Action: `"version": "1.0.0"` → `"version": "1.1.0"` 변경
  - Notes: README의 v1.1.0과 일치시킴

- [x] Task 2: 초기 `CHANGELOG.md` 파일 생성
  - File: `CHANGELOG.md` (신규)
  - Action: README의 기존 Changelog 내용을 기반으로 초기 CHANGELOG.md 생성
  - Notes: 형식은 [Keep a Changelog](https://keepachangelog.com) 스타일 채용. 기존 v1.1.0, v1.0.0 내용 포함. 이후 릴리즈부터 워크플로우가 자동으로 prepend.

- [x] Task 3: GitHub Actions 릴리즈 워크플로우 생성
  - File: `.github/workflows/release.yml` (신규)
  - Action: 아래 로직을 구현하는 워크플로우 작성
  - Notes: 워크플로우 상세 설계:

  **트리거:**
  ```yaml
  on:
    push:
      tags: ['v*']
  ```

  **권한:**
  ```yaml
  permissions:
    contents: write
  ```

  **Steps:**
  1. **Checkout**: `actions/checkout@v4` (fetch-depth: 0, 전체 히스토리 필요)
  2. **버전 추출**: 태그에서 버전 번호 파싱 (`v1.2.0` → `1.2.0`)
  3. **이전 태그 감지**: `git describe --tags --abbrev=0 HEAD^` 로 이전 태그 획득. 없으면 최초 커밋을 기준으로 사용
  4. **커밋 수집 및 파싱**: 이전 태그~현재 태그 사이 커밋 로그 수집, 이모지 제거 후 Conventional Commit type 추출
  5. **릴리즈 노트 생성**: 카테고리별 마크다운 생성
     - ✨ 새 기능 (feat)
     - 🐛 버그 수정 (fix)
     - 📝 문서 (docs)
     - 🔧 기타 변경 (chore, style, refactor, perf, ci, build, init)
     - 분류 불가 커밋은 "기타 변경"에 포함
  6. **CHANGELOG.md 업데이트**: 기존 내용 상단에 새 릴리즈 엔트리 prepend
  7. **package.json 버전 업데이트**: `npm version` 또는 sed로 version 필드를 태그 버전으로 변경
  8. **변경사항 커밋 & 푸시**: CHANGELOG.md + package.json 변경을 master에 커밋
     - 커밋 메시지: `🔖 release: v{version}`
     - `[skip ci]` 태그 포함하여 무한 루프 방지
  9. **GitHub Release 생성**: `gh release create` 또는 `actions/create-release` 로 릴리즈 생성, 생성된 릴리즈 노트를 body로 사용

### Acceptance Criteria

- [x] AC 1: Given 워크플로우 파일이 존재할 때, when `v*` 패턴의 태그를 push하면, then GitHub Actions 워크플로우가 트리거된다
- [x] AC 2: Given 이전 태그와 현재 태그 사이에 conventional commit이 존재할 때, when 워크플로우가 실행되면, then 커밋이 `feat`, `fix`, `docs`, `기타` 카테고리로 분류된 릴리즈 노트가 생성된다
- [x] AC 3: Given 이모지가 포함된 커밋 메시지(`✨ feat: add X`)가 있을 때, when 파싱하면, then 이모지가 제거되고 `feat` 타입으로 정상 분류된다
- [x] AC 4: Given 이모지가 없는 커밋 메시지(`fix: fix Y`)가 있을 때, when 파싱하면, then `fix` 타입으로 정상 분류된다
- [x] AC 5: Given 워크플로우가 성공적으로 실행되면, then `CHANGELOG.md` 파일에 새 릴리즈 엔트리가 상단에 추가된다
- [x] AC 6: Given 워크플로우가 성공적으로 실행되면, then `package.json`의 version 필드가 태그 버전과 일치하도록 업데이트된다
- [x] AC 7: Given 워크플로우가 성공적으로 실행되면, then GitHub Release가 생성되고 카테고리별 릴리즈 노트가 body에 포함된다
- [x] AC 8: Given CHANGELOG.md와 package.json이 업데이트되면, then `🔖 release: v{version} [skip ci]` 메시지로 master에 커밋된다
- [x] AC 9: Given 이전 태그가 없는 최초 릴리즈일 때, when 워크플로우가 실행되면, then 전체 커밋 히스토리를 기반으로 릴리즈 노트가 생성된다

## Additional Context

### Dependencies

- **GitHub Actions**: `actions/checkout@v4` (코드 체크아웃)
- **GitHub CLI**: `gh release create` (릴리즈 생성, GitHub Actions 러너에 기본 포함)
- **Git**: 태그 비교, 커밋 로그 수집
- **외부 라이브러리 없음**: 쉘 스크립트(bash)로 커밋 파싱 처리

### Testing Strategy

- **수동 테스트**: 워크플로우 생성 후 테스트 태그(`v1.1.1`)를 push하여 전체 파이프라인 검증
- **드라이 런**: 워크플로우 내 각 step의 출력을 확인할 수 있도록 로그 출력 포함
- **엣지 케이스 확인**: 이전 태그 없는 경우(최초), 이모지 유/무 혼재 커밋, conventional commit 형식이 아닌 커밋

### Notes

- 워크플로우가 master에 직접 커밋하므로, 브랜치 보호 규칙이 있다면 GitHub Actions bot에 대한 예외가 필요할 수 있음
- `[skip ci]` 태그로 릴리즈 커밋이 워크플로우를 재트리거하는 것을 방지
- 향후 README의 Changelog 섹션을 CHANGELOG.md로의 링크로 대체하는 것을 고려할 수 있음 (현재 스코프 외)

## Review Notes

- Adversarial review 완료
- Findings: 15 total, 12 fixed, 3 skipped (noise)
- Resolution approach: auto-fix
- 주요 수정사항:
  - F1: `${{ }}` shell injection → `env:` 매핑으로 전환 + semver 유효성 검사 추가
  - F4: `head -n 4` 하드코딩 → `grep -n '^## \['` 패턴 기반 삽입으로 변경
  - F5: `HEAD^` root commit 실패 → `rev-parse` 사전 검증 추가
  - F6: CHANGELOG DAE 중복 기재 수정 (v1.0.0에서 제거)
  - F7: `feat!:` breaking change 패턴 파싱 지원 추가
  - F8: CHANGELOG 중복 엔트리 방지 체크 추가
  - F9: `echo -e` → `printf '%b\n'` 전환
  - F11: 고정 delimiter → `uuidgen` 동적 delimiter 전환
  - F15: CHANGELOG 하단에 비교 링크 추가
