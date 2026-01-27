---
title: 'Prettier 설정 추가'
slug: 'prettier-setup'
created: '2026-01-27'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['prettier', 'npm']
files_to_modify: ['package.json', '.prettierrc', '.prettierignore']
code_patterns: ['yaml-2space-indent', 'md-standard-markdown']
test_patterns: ['manual-format-check']
---

# Tech-Spec: Prettier 설정 추가

**Created:** 2026-01-27

## Overview

### Problem Statement

BMAD 서브모듈 프로젝트의 YAML, MD 파일들에 일관된 포맷팅이 없어 가독성과 유지보수성이 떨어짐.

### Solution

Prettier를 설정하여 YAML, MD 파일의 자동 포맷팅 지원. npm scripts로 쉽게 실행 가능하도록 구성.

### Scope

**In Scope:**
- package.json 생성
- .prettierrc 설정 (YAML, MD 지원)
- .prettierignore 설정
- npm scripts 추가 (format, format:check)

**Out of Scope:**
- pre-commit hooks (husky, lint-staged)
- ESLint 통합
- 다른 파일 타입 포맷팅

## Context for Development

### Codebase Patterns

- 프로젝트 루트: `/Users/oseung-wan/Documents/my-proj/bmad-submodule/`
- 주요 포맷팅 대상: `_bmad/` 폴더 내 .md, .yaml 파일들
- 제외 대상: `_bmad-output/`, `node_modules/`, `.git/`
- **Clean Slate 확인**: 기존 prettier/eslint 설정 없음

### Files to Reference

| File | Purpose |
| ---- | ------- |
| _bmad/bmm/config.yaml | YAML 파일 예시 - 2-space 들여쓰기 확인 |
| README.md | MD 파일 예시 - 한국어+코드블록 혼합 |

### Technical Decisions

- **YAML 들여쓰기**: 2 spaces (기존 파일 패턴과 일치)
- **MD prose wrap**: preserve (원본 줄바꿈 유지 - 한국어 문서 특성상 권장)
- **Tab width**: 2
- **Package manager**: npm
- **Print width**: 80 (기본값)

## Implementation Plan

### Tasks

- [x] **Task 1: package.json 생성**
  - File: `package.json`
  - Action: 프로젝트 루트에 package.json 생성
  - Content:
    ```json
    {
      "name": "bmad-submodule",
      "version": "1.0.0",
      "private": true,
      "scripts": {
        "format": "prettier --write \"**/*.{md,yaml,yml}\"",
        "format:check": "prettier --check \"**/*.{md,yaml,yml}\""
      },
      "devDependencies": {}
    }
    ```

- [x] **Task 2: .prettierrc 생성**
  - File: `.prettierrc`
  - Action: 프로젝트 루트에 Prettier 설정 파일 생성
  - Content:
    ```json
    {
      "tabWidth": 2,
      "useTabs": false,
      "printWidth": 80,
      "proseWrap": "preserve",
      "singleQuote": true
    }
    ```

- [x] **Task 3: .prettierignore 생성**
  - File: `.prettierignore`
  - Action: 포맷팅 제외 대상 설정
  - Content:
    ```
    _bmad-output/
    node_modules/
    .git/
    *.min.*
    ```

- [x] **Task 4: prettier 패키지 설치**
  - Command: `npm install --save-dev prettier`
  - Action: devDependency로 prettier 설치

- [x] **Task 5: 포맷팅 검증 및 적용**
  - Command: `npm run format:check`
  - Action: 현재 포맷팅 상태 확인
  - Command: `npm run format`
  - Action: 전체 파일 포맷팅 적용

### Acceptance Criteria

- [x] **AC 1**: Given 프로젝트 루트에 package.json이 있을 때, When `npm run format:check` 실행하면, Then YAML/MD 파일들의 포맷팅 상태가 출력됨

- [x] **AC 2**: Given 프로젝트 루트에서, When `npm run format` 실행하면, Then 모든 YAML/MD 파일이 일관된 스타일로 포맷팅됨

- [x] **AC 3**: Given `_bmad-output/` 폴더 내 파일이 있을 때, When 포맷팅 실행하면, Then 해당 폴더는 무시되고 변경되지 않음

- [x] **AC 4**: Given .prettierrc 설정이 있을 때, When YAML 파일 포맷팅하면, Then 2-space 들여쓰기가 적용됨

## Additional Context

### Dependencies

| 패키지 | 버전 | 용도 |
|--------|------|------|
| prettier | ^3.x | 코드 포맷터 (dev) |

### Testing Strategy

1. **설치 검증**: `npm run format:check` 실행 → 에러 없이 실행되는지 확인
2. **포맷팅 검증**: `npm run format` 실행 → 파일들이 수정되는지 확인
3. **ignore 검증**: `_bmad-output/` 내 파일이 변경되지 않는지 확인

### Notes

- 기존 파일들의 포맷팅 변경이 발생할 수 있음
- 첫 실행 시 많은 파일이 수정될 수 있으므로 별도 커밋 권장
- 향후 husky + lint-staged로 pre-commit hook 추가 가능

## Review Notes

- Adversarial review completed
- Findings: 10 total, 3 fixed, 7 skipped (noise/undecided)
- Resolution approach: Auto-fix
- Fixed: F1 (package-lock.json ignore), F6 (.claude/ ignore), F9 (.claude/commands/ revert)
