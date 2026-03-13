---
title: 'npx 명령어 및 패키지명을 rentre-bmad-setup으로 변경'
slug: 'rename-to-rentre-bmad-setup'
created: '2026-03-10'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['node.js', 'npm']
files_to_modify: ['package.json', 'bin/cli.js', 'README.md']
code_patterns: ['순수 문자열 치환, 로직 변경 없음']
test_patterns: ['수동 테스트 - node bin/cli.js --help', 'grep 검증 - bmad-setup 잔존 참조 0건']
---

# Tech-Spec: npx 명령어 및 패키지명을 rentre-bmad-setup으로 변경

**Created:** 2026-03-10

## Overview

### Problem Statement

현재 npm 패키지명과 CLI 명령어가 `bmad-setup`으로 되어 있어, rentre 프로젝트 브랜딩과 일치하지 않음.

### Solution

`package.json`의 패키지명/bin 엔트리, `bin/cli.js`의 도움말/에러 메시지, `README.md`의 모든 `bmad-setup` 참조를 `rentre-bmad-setup`으로 일괄 변경.

### Scope

**In Scope:**
- `package.json` — `name` 필드: `bmad-setup` → `rentre-bmad-setup`, `bin` 키: `bmad-setup` → `rentre-bmad-setup`
- `bin/cli.js` — 도움말/에러 메시지 내 `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
- `README.md` — 모든 `npx bmad-setup@latest` 참조 및 npm 배지 URL 변경

**Out of Scope:**
- CHANGELOG.md (과거 기록 유지)
- `_bmad-output/` 내 기존 tech-spec 문서
- `_bmad/`, `_wds-learn/` 등 프레임워크 내부 문서의 npx 참조 (playwright, shadcn 등 무관)

## Context for Development

### Codebase Patterns

- 순수 문자열 치환 작업. 로직 변경 없음.
- `bin/cli.js`의 `checkLatestVersion()` (L91): npm registry URL이 패키지명에 직접 의존 → 함께 변경 필수.
- `bin/cli.js` L52: help 헤더에 패키지명 표시.
- `bin/cli.js` L57-60: Usage 섹션 4줄 모두 `npx bmad-setup@latest`.
- `bin/cli.js` L102: 버전 경고 메시지.
- `bin/cli.js` L173: 에러 메시지 (미설치 시).

### Files to Reference

| File | Line(s) | Purpose |
| ---- | ------- | ------- |
| `package.json` | L2, L6 | npm 패키지명 (`name`), CLI 바이너리명 (`bin` 키) |
| `bin/cli.js` | L52, L57-60, L91, L102, L173 | 도움말, npm registry 조회 URL, 에러 메시지 |
| `README.md` | L4, L11, L56, L81, L99, L155 | npm 배지, 설치 가이드, 비교표, 수동설치 안내 |

### Technical Decisions

- npm registry 조회 URL (`https://registry.npmjs.org/bmad-setup/latest` → `rentre-bmad-setup/latest`) 변경.
- README npm 배지 (`npm/v/bmad-setup.svg` → `npm/v/rentre-bmad-setup.svg`) 변경.
- `bin/cli.js` L275의 post-checkout hook 주석 `bmad-setup`은 코드 내부 마커이므로 변경하지 않음.

## Implementation Plan

### Tasks

- [x] Task 1: `package.json` 수정
  - File: `package.json`
  - Action:
    - L2: `"name": "bmad-setup"` → `"name": "rentre-bmad-setup"`
    - L6: `"bmad-setup": "bin/cli.js"` → `"rentre-bmad-setup": "bin/cli.js"`

- [x] Task 2: `bin/cli.js` 수정
  - File: `bin/cli.js`
  - Action:
    - L52: `bmad-setup v${VERSION}` → `rentre-bmad-setup v${VERSION}`
    - L57: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
    - L58: `npx bmad-setup@latest --update` → `npx rentre-bmad-setup@latest --update`
    - L59: `npx bmad-setup@latest --help` → `npx rentre-bmad-setup@latest --help`
    - L60: `npx bmad-setup@latest --version` → `npx rentre-bmad-setup@latest --version`
    - L91: `'https://registry.npmjs.org/bmad-setup/latest'` → `'https://registry.npmjs.org/rentre-bmad-setup/latest'`
    - L102: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
    - L173: `` `npx bmad-setup@latest` `` → `` `npx rentre-bmad-setup@latest` ``
  - Notes: L275 `bmad-setup` 주석(post-checkout hook 마커)은 변경하지 않음

- [x] Task 3: `README.md` 수정
  - File: `README.md`
  - Action:
    - L4: `npm/v/bmad-setup.svg` → `npm/v/rentre-bmad-setup.svg`
    - L11: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
    - L56: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
    - L81: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`
    - L99: `npx bmad-setup@latest --update` → `npx rentre-bmad-setup@latest --update`
    - L155: `npx bmad-setup@latest` → `npx rentre-bmad-setup@latest`

### Acceptance Criteria

- [x] AC 1: Given `package.json`, when `name` 필드 확인, then `rentre-bmad-setup`이어야 함
- [x] AC 2: Given `package.json`, when `bin` 키 확인, then `rentre-bmad-setup`이어야 함
- [x] AC 3: Given `bin/cli.js`, when `--help` 출력 확인, then 모든 명령어가 `npx rentre-bmad-setup@latest`로 표시
- [x] AC 4: Given `bin/cli.js`, when npm registry 조회 URL 확인, then `rentre-bmad-setup`으로 요청
- [x] AC 5: Given `README.md`, when 문서 내 검색, then `bmad-setup` 단독 참조가 없어야 함 (CHANGELOG 링크 등 제외)
- [x] AC 6: Given `README.md`, when npm 배지 URL 확인, then `rentre-bmad-setup` 패키지를 참조

## Additional Context

### Dependencies

없음. 순수 문자열 치환 작업.

### Testing Strategy

- `node bin/cli.js --help` 실행하여 출력 텍스트에 `rentre-bmad-setup` 표시 확인
- `grep -r "npx bmad-setup" package.json bin/cli.js README.md` 결과가 0건인지 확인

### Notes

- npm에 `rentre-bmad-setup` 패키지를 새로 publish해야 함 (기존 `bmad-setup`과 별도)
- 기존 사용자에게 마이그레이션 안내가 필요할 수 있음
