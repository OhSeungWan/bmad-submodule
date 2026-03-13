---
title: 'BMAD commands → skills 마이그레이션'
slug: 'bmad-commands-to-skills-migration'
created: '2026-03-13'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: [bash, node.js, markdown]
files_to_modify: [install.sh, uninstall.sh, bin/cli.js, README.md]
code_patterns: [shopt-nullglob, ln-s-relative-path, remove_target-helper, entries-array-gitignore]
test_patterns: [manual-symlink-verification]
---

# Tech-Spec: BMAD commands → skills 마이그레이션

**Created:** 2026-03-13

## Overview

### Problem Statement

BMAD 버전 업데이트로 `.claude/commands/bmad-*.md` (플랫 파일) 구조가 `.claude/skills/bmad-*/` (디렉토리) 구조로 변경됨. 현재 install.sh, uninstall.sh, bin/cli.js, README.md 4개 파일이 모두 구버전 commands 구조만 참조하고 있어서 새 skills 구조에 대응하지 못함.

### Solution

4개 파일에서 `commands` 참조를 `skills`로 전환. 개별 스킬 디렉토리 심링크 방식 사용, 구버전 commands 하위호환 완전 제거.

### Scope

**In Scope:**
- `install.sh` — commands 플랫 파일 심링크 → skills 디렉토리별 개별 심링크로 변경
- `uninstall.sh` — commands 제거 로직 → skills 제거 로직으로 변경
- `bin/cli.js` — `.gitignore` 항목 `.claude/commands/bmad-*` → `.claude/skills/bmad-*` 변경
- `README.md` — 프로젝트 구조, 설치 가이드, 문제 해결 등에서 commands → skills 반영
- 주석/에코 메시지 업데이트

**Out of Scope:**
- `_bmad` 심링크 로직 (변경 없음)
- post-checkout hook 구조 (install.sh 호출하므로 자동 반영)
- package.json scripts (install.sh/uninstall.sh 호출만 하므로 변경 불필요)
- 스킬 콘텐츠 자체 수정

## Context for Development

### Codebase Patterns

- **install.sh**: `shopt -s nullglob`로 glob 안전 처리, 상대 경로 심링크 (`../../$SUBMODULE_NAME/.claude/commands/$name`), 소스 파일 존재 검증 후 심링크 생성
- **uninstall.sh**: `remove_target()` 헬퍼 함수로 심링크/실제파일 구분하여 안전 제거, for 루프로 `bmad-*` 패턴 일괄 제거
- **bin/cli.js**: `patchGitignore()` 함수에서 `entries` 배열로 .gitignore 항목 관리, MARKER 기반 섹션 삽입
- **README.md**: 프로젝트 구조도, 설치 단계별 설명, 코드 블록 예시 포함

### Files to Reference

| File | Purpose | 변경 포인트 |
| ---- | ------- | ----------- |
| `install.sh` | 심볼릭 링크 생성 (100줄) | L1-9 주석, L27-78 commands→skills 심링크 전체 |
| `uninstall.sh` | 심볼릭 링크 제거 (87줄) | L1-8 주석, L44-57 commands→skills 제거 로직 |
| `bin/cli.js` | npx CLI (483줄) | L304 `.gitignore` entries 배열 |
| `README.md` | 프로젝트 문서 (315줄) | 구조도, 설치, 동작 확인, 수동 설치, 문제 해결 |
| `.claude/skills/bmad-*/` | 새 스킬 구조 (139개) | 참조용 — 각 디렉토리 안에 SKILL.md 등 |

### Technical Decisions

- **개별 디렉토리 심링크**: 커스텀 스킬 공존을 위해 `.claude/skills/bmad-*` 디렉토리별 개별 심링크 사용 (전체 skills 디렉토리 심링크 X)
- **하위호환 완전 제거**: 구 commands 구조 지원 코드 삭제, 레거시 cleanup 코드도 제거
- **bmad-* 필터 유지**: `.claude/skills/` 안에 비-bmad 스킬도 존재 (`applying-fsd-architecture`, `wds`) — bmad-* 패턴 필터링 필수
- **디렉토리 심링크**: 기존 파일 심링크를 디렉토리 심링크로 변경, `-L` 체크는 파일/디렉토리 모두 동작하므로 유지 가능

## Implementation Plan

### Tasks

- [x] Task 1: `install.sh` — commands→skills 심링크 로직 전환
  - File: `install.sh`
  - Action:
    1. L1-9 주석 업데이트: "Commands Installer" → "Skills Installer", `.claude/commands/bmad-*` → `.claude/skills/bmad-*/`
    2. L27 변수명 및 경로 변경: `TARGET_COMMANDS_DIR` → `TARGET_SKILLS_DIR`, `"$ROOT_PROJECT/.claude/commands"` → `"$ROOT_PROJECT/.claude/skills"`
    3. L33 소스 glob 변경: `"$SCRIPT_DIR"/.claude/commands/bmad-*` → `"$SCRIPT_DIR"/.claude/skills/bmad-*`
    4. L35 에러 메시지: `commands/` → `skills/`
    5. L39-45 레거시 `bmad` 디렉토리 심링크 cleanup 코드 **전체 삭제** (하위호환 제거)
    6. L48-57 기존 심링크 정리: `"$TARGET_COMMANDS_DIR"/bmad-*` → `"$TARGET_SKILLS_DIR"/bmad-*`, `-L` 체크 유지 (디렉토리 심링크에도 동작)
    7. L60-65 심링크 생성: 경로를 `../../$SUBMODULE_NAME/.claude/skills/$name`으로 변경
    8. L67-74 `bmad/` 서브디렉토리 심링크 블록 **전체 삭제** (commands 전용이었음)
    9. L78 에코 메시지: `$TARGET_COMMANDS_DIR` → `$TARGET_SKILLS_DIR`
  - Notes: 핵심 변경 — 파일 심링크가 디렉토리 심링크로 바뀌지만 `ln -s` 명령 자체는 동일하게 동작. `-L` 체크도 심링크 디렉토리에 대해 동작하므로 cleanup 로직 유지 가능.

- [x] Task 2: `uninstall.sh` — commands→skills 제거 로직 전환
  - File: `uninstall.sh`
  - Action:
    1. L1-8 주석 업데이트: "Commands Uninstaller" → "Skills Uninstaller", `.claude/commands/bmad` → `.claude/skills/bmad-*`
    2. L44-46 `commands/bmad` 디렉토리 제거 블록 **전체 삭제** (레거시)
    3. L48-57 개별 심링크 제거: `.claude/commands` → `.claude/skills`, 에코 메시지 업데이트
  - Notes: `remove_target()` 헬퍼는 변경 불필요, for 루프의 경로만 변경.

- [x] Task 3: `bin/cli.js` — .gitignore 패치 항목 변경
  - File: `bin/cli.js`
  - Action:
    1. L304 `entries` 배열: `'.claude/commands/bmad-*'` → `'.claude/skills/bmad-*'`
  - Notes: 1줄 변경. MARKER 기반 섹션이므로 기존 설치에서는 수동 .gitignore 업데이트 또는 `--update` 재실행 필요.

- [x] Task 4: `README.md` — 문서 전반 commands→skills 반영
  - File: `README.md`
  - Action:
    1. L13 인트로 설명: "슬래시 커맨드" → "스킬" 용어 변경
    2. L110 동작 확인: `/bmad-` 자동완성 설명 업데이트 (skills 기반으로)
    3. L113-118 예시 커맨드: `/bmad-agent-*` 형식 유지 또는 스킬 호출 방식으로 변경
    4. L124-149 프로젝트 구조도: `.claude/commands/` → `.claude/skills/` 트리 구조 전면 교체, 각 스킬이 디렉토리임을 반영
    5. L174-176 수동 설치 심링크 설명: `.claude/commands/bmad-*.md` → `.claude/skills/bmad-*/`
    6. L200-204 .gitignore 예시: `.claude/commands/bmad` → `.claude/skills/bmad-*`
    7. L260-264 문제 해결 심링크: `ls -la .claude/commands/bmad` → `ls -la .claude/skills/`
  - Notes: 전체적인 용어를 "커맨드" → "스킬"로 교체. 구조도에서 각 스킬이 디렉토리임을 명시.

### Acceptance Criteria

- [x] AC 1: Given bmad-submodule에 `.claude/skills/bmad-*` 디렉토리들이 존재할 때, When `install.sh`을 실행하면, Then 루트 프로젝트의 `.claude/skills/` 아래에 각 `bmad-*` 디렉토리에 대한 개별 심링크가 생성된다
- [x] AC 2: Given 루트 프로젝트에 bmad-* 심링크가 존재할 때, When `uninstall.sh`을 실행하면, Then `.claude/skills/bmad-*` 심링크가 모두 제거된다
- [x] AC 3: Given `.claude/skills/`에 비-bmad 스킬 디렉토리가 존재할 때, When `install.sh` 또는 `uninstall.sh`을 실행하면, Then 비-bmad 스킬 디렉토리는 영향받지 않는다
- [x] AC 4: Given `.gitignore`에 BMAD 섹션이 없을 때, When `npx rentre-bmad-setup@latest`를 실행하면, Then `.claude/skills/bmad-*` 항목이 .gitignore에 추가된다
- [x] AC 5: Given 기존에 `.claude/commands/bmad-*` 심링크가 남아있을 때, When `install.sh`을 실행하면, Then 구 commands 심링크는 건드리지 않고 새 skills 심링크만 생성된다 (commands cleanup은 스코프 외)
- [x] AC 6: Given README.md를 읽을 때, When 프로젝트 구조도를 확인하면, Then `.claude/skills/` 기반 구조가 표시되고 commands 참조가 없다

## Additional Context

### Dependencies

없음

### Testing Strategy

- **install.sh 테스트**: 실행 후 `ls -la .claude/skills/ | grep bmad-` 로 심링크 생성 확인, `readlink .claude/skills/bmad-dev`로 경로 정확성 확인
- **uninstall.sh 테스트**: 실행 후 `ls .claude/skills/bmad-*` 결과 없음 확인, 비-bmad 스킬은 존재 확인
- **cli.js 테스트**: 새 프로젝트에서 `npx rentre-bmad-setup@latest` 실행 후 .gitignore 내용에 `.claude/skills/bmad-*` 포함 확인
- **README 검증**: 문서 내 `commands` 단어 검색하여 잔여 참조 없는지 확인

### Notes

- 기존에 commands로 설치된 프로젝트는 `--update` 실행 시 새 skills 심링크만 생성됨. 구 commands 심링크는 수동 정리 필요할 수 있음 (별도 마이그레이션 가이드 고려 가능하나 현재 스코프 외)
- 심링크 대상 총 약 137개 (bmad-* 디렉토리)
