---
title: 'BMAD Submodule NPX 설치 CLI'
slug: 'bmad-npx-setup-cli'
created: '2026-02-10'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['node.js (child_process, fs, path)', 'npm/npx', 'git submodule', 'bash (install.sh 호출)']
files_to_modify: ['package.json (modify)', 'bin/cli.js (new)']
code_patterns: ['install.sh - shopt nullglob + relative symlink pattern', 'DAE installer.js - async install(options) with logger', 'postinstall script pattern from README']
test_patterns: ['수동 테스트 - 새 프로젝트에서 npx 실행']
---

# Tech-Spec: BMAD Submodule NPX 설치 CLI

**Created:** 2026-02-10

## Overview

### Problem Statement

현재 BMAD 서브모듈 설치가 4단계 수동 과정(submodule add → install.sh → package.json 수정 → .gitignore 수정)으로 구성되어 있어, 새 프로젝트에 적용할 때 번거롭고 실수 가능성이 높다.

### Solution

`npx bmad-setup` 한 줄로 전체 설치 과정을 자동화하는 CLI 도구를 개발한다. 이 CLI는 현재 bmad-submodule 레포 안에 포함되며, npm에 `bmad-setup` 이름으로 배포한다.

### Scope

**In Scope:**

- `git submodule add` + `git submodule init` + `git submodule update` 자동화
- `install.sh` 실행 (심볼릭 링크 생성)
- `package.json`에 postinstall / bmad:install / bmad:uninstall 스크립트 자동 패치
- `.gitignore`에 `_bmad`, `.claude/commands/bmad-*` 자동 추가
- `git config -f .gitmodules submodule.bmad-submodule.ignore dirty` 설정
- npm 패키지 배포 구조 (`bin` 필드 + CLI 엔트리포인트)

**Out of Scope:**

- `config.yaml` 인터랙티브 설정 (서브모듈을 통해 공유됨)
- 기존 `install.sh` / `uninstall.sh` 제거 (하위 호환 유지)
- 서브모듈 방식 자체 변경 (submodule 유지)
- `.claude/skills/` 심링크 (현재 install.sh에서도 미지원)

## Context for Development

### Codebase Patterns

- **install.sh 심볼릭 링크 로직**: `SCRIPT_DIR`/`ROOT_PROJECT` 기반 상대경로, `shopt -s nullglob`로 glob 안전 처리, `bmad-*` 패턴 개별 심링크 + `bmad/` 디렉토리 심링크 + `_bmad` 심링크
- **install.sh가 처리하는 심링크 3종**: (1) `.claude/commands/bmad-*` 개별 파일 (2) `.claude/commands/bmad/` 서브디렉토리 (3) `_bmad` → `bmad-submodule/_bmad`
- **postinstall 스크립트 형태 (README 정의)**: `[ -z "$CI" ] && git submodule update --init --recursive && git -C bmad-submodule pull origin master && ./bmad-submodule/install.sh || true`
- **package.json 현황**: `private: true`, name `bmad-submodule`, devDependencies에 prettier만

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `install.sh` | 심볼릭 링크 생성 로직 — CLI가 submodule add 후 이 스크립트를 호출 |
| `uninstall.sh` | 심볼릭 링크 제거 로직 |
| `package.json` | npm 패키지 설정 — name 변경, private 제거, bin/files 필드 추가 |
| `README.md` | postinstall 스크립트 형태 (L156-163) 및 .gitignore 패턴 (L189-192) |

### Technical Decisions

- **npm 패키지명**: `bmad-setup` (`npx bmad-setup`으로 실행)
- **install.sh 재활용**: CLI가 심볼릭 로직을 JS로 재구현하지 않고, `install.sh`를 직접 호출
- **외부 의존성 zero**: Node.js 내장 `child_process`, `fs`, `path`만 사용
- **멱등성**: 이미 서브모듈/gitignore/scripts가 존재하면 스킵
- **npm 패키지 최소화**: `files: ["bin/"]`로 CLI만 배포, 프레임워크 파일은 submodule으로 제공
- **Git repo URL**: `https://github.com/OhSeungWan/bmad-submodule.git`

## Implementation Plan

### Tasks

- [x] Task 1: `bin/cli.js` 생성 — CLI 엔트리포인트
  - File: `bin/cli.js` (NEW)
  - Action: 아래 로직을 순차 실행하는 Node.js CLI 스크립트 생성
  - 상세:
    1. **사전 검증**: git repo인지 확인 (`git rev-parse --git-dir`), 아니면 에러 메시지 출력 후 종료
    2. **Step 1 — Submodule 추가**: `bmad-submodule/` 디렉토리 존재 여부 확인
       - 없으면: `git submodule add https://github.com/OhSeungWan/bmad-submodule.git bmad-submodule` 실행
       - 있으면: "이미 존재합니다" 메시지 출력하고 스킵
    3. **Step 2 — Submodule 초기화**: `git submodule init && git submodule update` 실행
    4. **Step 3 — dirty ignore 설정**: `git config -f .gitmodules submodule.bmad-submodule.ignore dirty` 실행
    5. **Step 4 — install.sh 실행**: `./bmad-submodule/install.sh` 호출하여 심볼릭 링크 생성
    6. **Step 5 — .gitignore 패치**: `.gitignore` 파일 읽기 (없으면 생성)
       - BMAD 섹션 마커로 감싸기: `# BMAD symlinks (auto-generated)` ~ `# End BMAD`
       - 추가할 항목: `_bmad`, `.claude/commands/bmad-*`
       - 이미 해당 항목이 있으면 스킵
    7. **Step 6 — package.json 패치**: 대상 프로젝트의 `package.json` 읽기
       - `scripts` 필드에 다음 추가 (기존 값이 없을 때만):
         - `postinstall`: `[ -z "$CI" ] && git submodule update --init --recursive && git -C bmad-submodule pull origin master && ./bmad-submodule/install.sh || true`
         - `bmad:install`: `./bmad-submodule/install.sh`
         - `bmad:uninstall`: `./bmad-submodule/uninstall.sh`
       - package.json이 없으면 이 단계 스킵 (경고 메시지)
    8. **완료 메시지**: 각 단계 성공/스킵 상태를 요약 출력
  - Notes: `#!/usr/bin/env node` shebang 필수, `execSync` 사용하여 동기 실행, 각 단계에서 `stdio: 'inherit'`로 출력 전달

- [x] Task 2: `package.json` 수정 — npm 배포 설정
  - File: `package.json`
  - Action: npm에 `bmad-setup`으로 배포 가능하도록 수정
  - 상세:
    - `name`: `bmad-submodule` → `bmad-setup`
    - `private: true` 제거
    - `bin` 추가: `{ "bmad-setup": "bin/cli.js" }`
    - `files` 추가: `["bin/"]` (npm 패키지에 CLI만 포함)
    - `description` 추가: `"BMAD Framework submodule installer - one command setup"`
    - `repository` 추가: `{ "type": "git", "url": "https://github.com/OhSeungWan/bmad-submodule.git" }`
    - `keywords` 추가: `["bmad", "claude-code", "ai-agent", "submodule"]`
    - `license`: `"MIT"`
    - 기존 `scripts`, `devDependencies` 유지

- [x] Task 3: `README.md` 업데이트 — npx 설치 방법 추가
  - File: `README.md`
  - Action: 설치 가이드 섹션 상단에 npx 원라인 설치 방법 추가
  - 상세:
    - "설치 가이드" 섹션에 "빠른 설치 (권장)" 서브섹션 추가
    - `npx bmad-setup` 한 줄 명령어 안내
    - 이 명령이 자동으로 수행하는 작업 목록 설명
    - 기존 수동 설치 가이드는 "수동 설치" 서브섹션으로 이동 (내용 유지)

### Acceptance Criteria

- [ ] AC 1: Given git이 초기화된 새 프로젝트, when `npx bmad-setup` 실행, then `bmad-submodule/` 디렉토리에 서브모듈이 추가되고 파일이 존재함
- [ ] AC 2: Given `npx bmad-setup` 완료, when 심볼릭 링크 확인, then `.claude/commands/bmad-*` 파일들과 `_bmad` 심링크가 존재함
- [ ] AC 3: Given `npx bmad-setup` 완료, when `.gitignore` 확인, then `_bmad`와 `.claude/commands/bmad-*` 항목이 포함됨
- [ ] AC 4: Given `npx bmad-setup` 완료, when `package.json` 확인, then `postinstall`, `bmad:install`, `bmad:uninstall` 스크립트가 존재함
- [ ] AC 5: Given `bmad-submodule/` 디렉토리가 이미 존재, when `npx bmad-setup` 실행, then submodule add를 스킵하고 나머지 단계만 실행 (멱등성)
- [ ] AC 6: Given `.gitignore`에 이미 `_bmad` 항목 존재, when `npx bmad-setup` 실행, then 중복 추가하지 않음
- [ ] AC 7: Given git repo가 아닌 디렉토리, when `npx bmad-setup` 실행, then 에러 메시지 출력 후 종료 (exit code 1)
- [ ] AC 8: Given `package.json`에 이미 `postinstall` 스크립트 존재, when `npx bmad-setup` 실행, then 기존 값을 덮어쓰지 않고 경고 메시지 출력

## Additional Context

### Dependencies

- **외부 의존성 없음**: Node.js 내장 모듈만 사용 (`child_process`, `fs`, `path`)
- **런타임 요구사항**: Node.js >= 14, git CLI 설치 필요
- **npm 배포**: `npm publish` 권한 필요 (초기 1회)

### Testing Strategy

- **수동 테스트 (필수)**:
  1. 새 빈 git 프로젝트에서 `npx bmad-setup` 실행 → 전체 설치 확인
  2. 같은 프로젝트에서 재실행 → 멱등성 확인 (중복 없음)
  3. git repo가 아닌 디렉토리에서 실행 → 에러 처리 확인
  4. package.json이 없는 프로젝트에서 실행 → 스킵 + 경고 확인
- **검증 체크리스트**:
  - `ls -la .claude/commands/bmad-*` → 심링크 존재
  - `ls -la _bmad` → 심링크 존재
  - `cat .gitignore` → BMAD 항목 존재
  - `cat package.json` → scripts 존재
  - `git submodule status` → 서브모듈 정상

### Notes

- **npm 패키지 크기 최소화**: `files: ["bin/"]` 설정으로 CLI만 npm에 올라감. 프레임워크 전체 파일(~100+ 커맨드, _bmad 리소스)은 패키지에 포함되지 않음. 실제 파일은 `git submodule add`로 가져옴
- **하위 호환성**: 기존 `install.sh`/`uninstall.sh`는 유지. 이미 수동으로 설치한 프로젝트는 영향 없음
- **향후 고려사항 (Out of Scope)**:
  - `npx bmad-setup --uninstall` 언인스톨 지원
  - `--branch`, `--tag` 옵션으로 특정 버전 설치
  - `.claude/skills/` 심링크 자동화 (install.sh 업데이트 필요)

## Review Notes

- Adversarial review completed
- Findings: 15 total, 9 fixed, 6 skipped (noise/uncertain)
- Resolution approach: auto-fix
- Fixed: F1(에러처리), F2(try/catch), F3(git root 체크), F4(engines), F6(indent 보존), F7(JSON 파싱 에러), F10(files에 README/LICENSE), F12(--help/--version), F13(버전 1.0.0)
