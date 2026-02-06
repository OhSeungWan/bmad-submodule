---
title: 'install.sh 심링크 로직 수정 — BMAD 6.0 flat command 구조 대응'
slug: 'fix-install-symlink-flat-commands'
created: '2026-02-06'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: [bash]
files_to_modify: [install.sh]
code_patterns: ['set -e error handling', 'relative symlink paths (../../submodule/...)', 'rm-then-ln idempotent pattern']
test_patterns: ['manual: run install.sh and verify symlinks']
---

# Tech-Spec: install.sh 심링크 로직 수정 — BMAD 6.0 flat command 구조 대응

**Created:** 2026-02-06

## Overview

### Problem Statement

BMAD 6.0.0-beta.7 업데이트 이후 커맨드 파일 생성 구조가 변경됨. 기존에는 `.claude/commands/bmad/` 하위 디렉토리에 모든 커맨드가 모여있어 디렉토리 심링크 1개로 해결 가능했으나, 업데이트 후에는 `.claude/commands/` 바로 아래에 `bmad-*` 접두사로 109개 파일이 flat하게 생성됨. 기존 install.sh의 디렉토리 심링크 방식으로는 대부분의 커맨드가 루트 프로젝트에 노출되지 않음.

### Solution

`install.sh`의 commands 심링크 섹션을 수정하여 `bmad-*` 패턴에 매칭되는 파일들을 개별 심링크로 생성하고, `bmad/` 서브디렉토리도 별도 심링크로 유지. `commit.md` 등 bmad 접두사가 없는 파일은 제외하여 루트 프로젝트의 커스텀 커맨드와 충돌 방지.

### Scope

**In Scope:**
- `install.sh`의 `.claude/commands` 심링크 섹션 로직 변경
- `bmad-*` 패턴 파일 개별 심링크 생성
- `bmad/` 서브디렉토리 심링크 유지
- 기존 심링크 정리(재설치 시 clean-up) 로직

**Out of Scope:**
- `_bmad` 심링크 로직 (현재 정상 작동)
- 서브모듈 내부의 커맨드 파일 구조 변경
- `commit.md` 등 bmad 외 파일 배포

## Context for Development

### Codebase Patterns

- 셸 스크립트(bash), `set -e` 사용
- 상대경로 심링크: `root/.claude/commands/` → `../../$SUBMODULE_NAME/.claude/commands/` (깊이 2)
- Idempotent 패턴: 기존 심링크/파일 존재 시 제거 후 재생성
- `mkdir -p`로 타겟 디렉토리 보장

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `install.sh` (L1-60) | 수정 대상 — 전체 스크립트 |
| `install.sh` (L19-38) | **핵심 수정 영역** — commands 심링크 섹션 |
| `install.sh` (L40-56) | 변경 없음 — `_bmad` 심링크 섹션 |
| `.claude/commands/bmad-*.md` | 개별 심링크 대상 (109개 파일) |
| `.claude/commands/bmad/` | 서브디렉토리 심링크 대상 (DAE 2개) |

### Technical Decisions

- **개별 파일 심링크**: 루트 프로젝트에 커스텀 커맨드 공존 가능하도록 `commands/` 통째 심링크 불가
- **`bmad-*` + `bmad/` 이중 패턴**: flat 파일(`bmad-*.md`)과 서브디렉토리(`bmad/`) 모두 커버
- **하위호환 정리**: 기존 `commands/bmad` 디렉토리 심링크도 정리하여 이전 버전에서 업그레이드 시 깔끔하게 전환
- **상대경로 동일**: 심링크 깊이가 동일하므로 `../../$SUBMODULE_NAME/.claude/commands/{item}` 패턴 유지

## Implementation Plan

### Tasks

- [x] Task 1: 기존 commands 심링크 섹션(`# === 1. ...` 마커) 제거 및 새 로직으로 교체
  - File: `install.sh`
  - Action: `# === 1. .claude/commands/bmad symlink ===` 섹션 전체를 아래 로직으로 교체:
    1. `TARGET_COMMANDS_DIR="$ROOT_PROJECT/.claude/commands"` 설정 및 `mkdir -p`
    2. `shopt -s nullglob` 활성화 (glob 매칭 0개 시 빈 루프 처리)
    3. **하위호환 정리**: 기존 `$TARGET_COMMANDS_DIR/bmad`가 **심링크(`[ -L ]`)인 경우에만** 제거. 실제 디렉토리면 경고 출력 후 스킵 (사용자 데이터 보호)
    4. **기존 bmad-* 심링크 정리**: `$TARGET_COMMANDS_DIR/bmad-*` 패턴으로 루프하되, **`[ -L ]` 체크로 심링크만 제거**. 사용자가 만든 실제 파일(`bmad-my-custom.md` 등)은 보존
    5. **bmad-* 개별 심링크 생성**: `$SCRIPT_DIR/.claude/commands/bmad-*` glob 루프, 각 항목에 대해 `ln -s "../../$SUBMODULE_NAME/.claude/commands/$(basename "$item")" "$TARGET_COMMANDS_DIR/$(basename "$item")"`
    6. **bmad/ 서브디렉토리 심링크 생성**: `$SCRIPT_DIR/.claude/commands/bmad` 디렉토리가 존재하면 심링크 생성
    7. `shopt -u nullglob` 복원 (스크립트 종료 전이므로 cosmetic이지만 관례상 복원)
    8. 생성된 심링크 개수 카운트 및 출력
  - Notes:
    - `set -e` 환경이므로 `shopt -s nullglob`로 빈 glob 에러 방지
    - cleanup은 반드시 `[ -L ]`로 심링크 여부 확인 후 제거 — 사용자 실제 파일 보호가 최우선
    - 부분 실패 시 `set -e`에 의해 즉시 중단됨. 재실행으로 복구 가능 (idempotent 설계)

- [x] Task 2: 스크립트 헤더 주석 업데이트
  - File: `install.sh`
  - Action: 헤더 주석(`# This script creates symlinks...` 블록)을 새 동작에 맞게 업데이트
    - 기존: `# 1. .claude/commands/bmad -> submodule/.claude/commands/bmad`
    - 변경: `# 1. .claude/commands/bmad-* -> submodule/.claude/commands/bmad-* (개별 파일/디렉토리 심링크)`
    - 추가: `#    Only symlinks are managed; user-created files matching bmad-* are preserved`

### Acceptance Criteria

- [ ] AC 1: Given 루트 프로젝트에 `.claude/commands/`가 없을 때, When `install.sh` 실행, Then 서브모듈의 모든 `bmad-*` 파일 + `bmad/` 디렉토리에 대한 심링크가 `root/.claude/commands/`에 생성됨
- [ ] AC 2: Given 루트 프로젝트에 커스텀 커맨드(`my-command.md`)가 있을 때, When `install.sh` 실행, Then 커스텀 커맨드 파일은 삭제/변경되지 않고 bmad 심링크만 추가됨
- [ ] AC 3: Given 사용자가 `bmad-my-custom.md`라는 실제 파일을 만들었을 때, When `install.sh` 실행, Then 해당 파일은 심링크가 아니므로 제거되지 않고 보존됨 (심링크만 정리)
- [ ] AC 4: Given 이전 버전 install.sh로 생성된 `commands/bmad` 디렉토리 심링크가 있을 때, When 새 `install.sh` 실행, Then 기존 디렉토리 심링크가 제거되고 새로운 개별 파일 심링크로 교체됨
- [ ] AC 5: Given 사용자가 `commands/bmad/` 실제 디렉토리를 직접 만들었을 때, When `install.sh` 실행, Then 해당 디렉토리는 제거되지 않고 경고 메시지가 출력됨
- [ ] AC 6: Given 이미 새 install.sh로 설치된 상태에서, When `install.sh` 재실행, Then 기존 bmad-* 심링크가 정리되고 새로 생성됨 (idempotent)
- [ ] AC 7: Given `bmad/` 서브디렉토리가 서브모듈에 존재할 때, When `install.sh` 실행, Then `root/.claude/commands/bmad` 심링크가 생성되고 내부 파일(`bmad/dae/agents/*.md`, `bmad/dae/workflows/*.md`)에 접근 가능
- [ ] AC 8: Given `_bmad` 심링크 섹션, When `install.sh` 실행, Then 기존과 동일하게 정상 작동 (변경 없음)

## Additional Context

### Dependencies

- 없음 (bash 기본 기능만 사용)

### Testing Strategy

- **수동 테스트 1**: 클린 상태에서 `install.sh` 실행 → 심링크 생성 확인 (`ls -la root/.claude/commands/`)
- **수동 테스트 2**: 루트에 커스텀 커맨드 파일 생성 후 재실행 → 커스텀 파일 유지 확인
- **수동 테스트 3**: `bmad-my-custom.md` 실제 파일 생성 후 재실행 → 실제 파일 보존 확인
- **수동 테스트 4**: 이전 방식 디렉토리 심링크 수동 생성 후 새 install.sh 실행 → 마이그레이션 확인
- **수동 테스트 5**: 재실행 → idempotent 동작 확인
- **수동 테스트 6**: `root/.claude/commands/bmad/dae/agents/data-analyst.md` 접근 가능 여부 확인

### Notes

- BMAD 향후 업데이트에서 파일이 추가/삭제되더라도 `bmad-*` 패턴이면 자동 대응됨
- `shopt -s nullglob`은 glob 매칭 결과가 0개일 때 빈 문자열 대신 no-op 처리를 위해 필수
- `commit.md` 등 비-bmad 파일은 `bmad-*` 패턴에 매칭되지 않으므로 자동 제외됨
- **데이터 안전**: cleanup은 반드시 `[ -L ]` 심링크 체크 후에만 삭제. 사용자가 `bmad-*` 패턴으로 직접 만든 파일이나 `bmad/` 실제 디렉토리는 절대 삭제하지 않음
- **부분 실패 복구**: `set -e`에 의해 중간 실패 시 즉시 중단되나, 재실행으로 복구 가능 (idempotent 설계)
- **glob 패턴**: `bmad-*` (확장자 무관)로 통일. 파일과 디렉토리 모두 매칭하여 향후 구조 변경에도 대응
- **셸 호환성**: `shopt`은 bash 전용. shebang `#!/bin/bash` 보장 필수
