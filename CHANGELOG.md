# Changelog

이 프로젝트의 모든 주요 변경사항을 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따릅니다.

## [2.7.0] - 2026-05-07

### ✨ 새 기능

- BMad UX/Dev 에이전트에 Figma MCP 핸드오프 규약 추가
  - Sally(`bmad-agent-ux-designer`): 신규 team override. Figma URL 수신 시 plugin:figma:figma MCP로 디자인을 직접 읽고, 산출물(UX 스펙·시나리오·핸드오프 노트)에 화면·컴포넌트마다 specific nodeId가 포함된 Figma URL을 박아 dev 측 재호출이 가능하도록 핸드오프 계약 명시
  - Amelia(`bmad-agent-dev`): 기존 figma fact 정리(중복 제거 + nodeId 보존 강화 + playwright 시각 테스트 부분 트림). 업스트림 스토리·UX 스펙 또는 사용자가 직접 제공한 Figma URL을 권위 있는 시각 소스로 다루고 `figma:figma-implement-design` 스킬을 우선 호출하는 규칙, UI성 메뉴(QD/DS/CS) dispatch 직전 Figma 인풋 보유 여부 선제 확인 규칙 신규 fact로 추가

### 🔧 기타 변경

- Serena `project.yml` 업스트림 최신 기본값으로 갱신 — 지원 언어 목록(ansible/crystal/haxe/hlsl/json/lean4/luau/msl/ocaml/python_ty/solidity/systemverilog) 추가, 신규 키 `added_modes` / `additional_workspace_folders` 노출


## [2.6.1] - 2026-04-27

### ✨ 새 기능

- BMAD 프레임워크 v6.5.0 업데이트 - customize.toml 기반 신규 커스터마이징 시스템, bmad-customize 스킬 추가, manifest/workflow 구조 정리

### 🐛 버그 수정

- wds 다중 스킬(wds-* 12개) 호환성 - install.sh / uninstall.sh / .gitignore 패턴 갱신 (v6.3.0의 wds 분리 이후 미반영분)
- pre-v2.1.0 `.claude/commands/bmad-*` 레거시 심링크 자동 정리 (target 가드로 사용자 커스텀 보호)
- 레거시 `.claude/skills/wds/` 디렉토리 제거


## [2.6.0] - 2026-04-12

### ✨ 새 기능

- BMAD 프레임워크 v6.3.0 업데이트 - 에이전트 빌더 재구조화, 품질 스캔 시스템 개편, TEA/WDS/GDS 모듈 개선


## [2.5.0] - 2026-03-30

### ✨ 새 기능

- overhaul quality scan system, restructure builder and TEA modules


## [2.4.2] - 2026-03-28

### ✨ 새 기능

- add Unity MCP guidelines and asset pipeline skill to game dev agents


## [2.4.1] - 2026-03-27

### 🐛 버그 수정

- handle existing regular directories in install.sh cleanup


## [2.4.0] - 2026-03-27

### ✨ 새 기능

- upgrade bmad-method to v6.3.0 — remove deprecated skills and manifest system


## [2.3.0] - 2026-03-17

### ✨ 새 기능

- add symlink support for gds-*, wds, applying-fsd-architecture skills


## [2.2.0] - 2026-03-16

### ✨ 새 기능

- upgrade bmad-method from v6.1.0 to v6.2.0

### 🔧 기타 변경

- v2.2.0


## [2.1.1] - 2026-03-13

### 🐛 버그 수정

- keep .claude/commands/bmad-* in .gitignore for backward compat

### 🔧 기타 변경

- v2.1.1


## [2.1.0] - 2026-03-13

### 🔧 기타 변경

- migrate .claude/commands to .claude/skills symlink structure


## [2.0.0] - 2026-03-10

### 🔧 기타 변경

- rename package from bmad-setup to rentre-bmad-setup


## [1.9.0] - 2026-03-06

### ✨ 새 기능

- add WDS (Web Design System) module

### 🔧 기타 변경

- v1.9.0


## [1.8.2] - 2026-03-06

### 📝 문서

- update README versions (v1.8.2, BMAD 6.0.4) and @latest usage


## [1.8.1] - 2026-03-06

### ✨ 새 기능

- add npm registry version check and @latest usage guidance


## [1.8.0] - 2026-03-06

### ✨ 새 기능

- stabilize --update flow and add git worktree support

### 🔧 기타 변경

- v1.8.0


## [1.7.2] - 2026-03-03

### 🔧 기타 변경

- v1.7.2
- update BMAD to v6.0.3 with quote fixes and QA workflow path correction


## [1.7.1] - 2026-02-23

### 🔧 기타 변경

- v1.7.1


## [1.7.0] - 2026-02-23

### 🔧 기타 변경

- v1.7.0


## [1.6.0] - 2026-02-19

### ✨ 새 기능

- add nano-banana MCP image generation instructions to game dev agents

### 📝 문서

- restructure README with BMAD Method intro and customization focus

### 🔧 기타 변경

- v1.6.0


## [1.5.1] - 2026-02-10

### 🐛 버그 수정

- correct duplicated test artifact output paths in tea config

### 📝 문서

- update README to v1.5.0 and add --update usage guide


## [1.5.0] - 2026-02-10

### ✨ 새 기능

- add --update flag for submodule update & symlink refresh

### 📝 문서

- update README version badges to v1.4.0 and add npm badge


## [1.4.0] - 2026-02-10

### ✨ 새 기능

- add npx bmad-setup CLI for one-command installation

### 🔧 기타 변경

- v1.4.0
- add Unity MCP usage guidelines to game-solo-dev agent


## [1.3.1] - 2026-02-09

### 📝 문서

- update README versions and command examples for v1.3.1

### 🔧 기타 변경

- reinstall BMAD modules to v6.0.0-Beta.8


## [1.3.0] - 2026-02-08

### ✨ 새 기능

- update TEA module to v1.0.0 with enhanced test workflows

### 🔧 기타 변경

- reinstall BMAD modules with config fixes
- unify BMB agent types into single sidecar-based architecture


## [1.2.0] - 2026-02-06

### ✨ 새 기능

- add Feature-Sliced Design (FSD) architecture skill

### 🔧 기타 변경

- bump version to 1.2.0
- add FSD, MCP tool, and Figma instructions to BMAD agents
- Fix Changelog link in README.md
- Remove changelog section from README


## [1.1.2] - 2026-02-06

### 🐛 버그 수정

- update install.sh symlink logic for BMAD 6.0 flat command structure

### 🔧 기타 변경

- bump version to 1.1.2


## [1.1.1] - 2026-02-06

### ✨ 새 기능

- add GitHub Actions auto-release workflow
- add DAE (Data Analysis Expert) module with agents and workflows
- add BMB (BMAD Module Builder) module with agents and workflows
- add smart commit command and enhance agent MCP configurations
- _bmad 심볼릭 링크 생성/제거 기능 추가
- bmad submodule 설치 / 제거 스크립트 추가

### 🐛 버그 수정

- correct package.json version to 1.1.0
- modify bmm-quick-flow-solo-dev agent
- modify tea_use_mcp_enhancements bmm config to true
- add bmgd module
- 심볼릭 링크를 절대경로에서 상대경로로 변경
- agent 커스터마이징

### 📝 문서

- add BMAD framework version info
- add version badges and changelog section
- improve README for git submodule beginners
- add README with setup instructions

### 🔧 기타 변경

- upgrade BMAD framework to 6.0.0-beta.7
- apply Prettier formatting to all YAML and Markdown files
- add Prettier configuration for YAML and Markdown formatting
- Merge branch 'master' of https://github.com/OhSeungWan/bmad-submodule
- Update README.md
- Update README.md


## [1.1.0] - 2026-02-06

### ✨ 새 기능

- BMAD Framework 6.0.0-beta.7 업그레이드
- CIS (Creative & Innovation Strategy) 신규 모듈 추가
- DAE (Data Analysis Expert) 모듈 추가

### 🔧 기타 변경

- BMGD → GDS (Game Dev Studio) 모듈 리네임 및 재편
- TEA (Test Engineer Architect) BMM에서 독립 모듈로 분리
- PRD 워크플로우 제거
- Excalidraw 다이어그램 워크플로우 제거
- BMM/BMB 모듈 전반 업데이트
- 에이전트 및 워크플로우 설정 파일 업데이트

## [1.0.0] - 2025-01-27

### ✨ 새 기능

- **Core** - 핵심 에이전트 및 워크플로우 (bmad-master, brainstorming, party-mode)
- **BMM** - 소프트웨어 개발 모듈 (analyst, architect, dev, pm, sm, ux)
- **BMB** - 모듈 빌더 (agent-builder, workflow-builder, module-builder)
- **BMGD** - 게임 개발 모듈 (game-designer, game-dev, game-qa)
- Git Submodule 기반 설치 지원
- 심볼릭 링크 자동 생성 스크립트
- npm postinstall 자동화
- Claude Code 슬래시 커맨드 통합

[1.1.0]: https://github.com/OhSeungWan/bmad-submodule/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/OhSeungWan/bmad-submodule/releases/tag/v1.0.0
