# Changelog

이 프로젝트의 모든 주요 변경사항을 기록합니다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)를 따릅니다.

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
