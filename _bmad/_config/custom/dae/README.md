# DAE: Data Analysis Expert

데이터 분석 전문 모듈 - Amplitude MCP 기반

전 직원의 데이터 기반 사고를 지원하는 분석 전문가

---

## Overview

DAE는 Amplitude MCP를 통해 실제 데이터를 분석하고, 서비스의 전체 퍼널과 실험 이력을 완벽히 이해하는 데이터 분석 전문가 에이전트입니다.

**핵심 가치:**
- **실제 데이터** — Amplitude MCP 연동으로 진짜 데이터 분석
- **서비스 맥락** — 퍼널, 실험 이력, 서비스 상황을 완벽히 이해
- **동반자** — 데이터 분석을 몰라도 OK, 차근차근 함께 분석 진행
- **선제적** — 위험 신호를 먼저 감지하고 알려줌

---

## Installation

```bash
bmad install dae
```

---

## Quick Start

1. **서비스 컨텍스트 설정** — 처음 사용 시 `[SC]` 명령으로 서비스 퍼널과 지표를 설정하세요
2. **데이터 분석 시작** — `[DA]` 명령으로 궁금한 것을 물어보세요
3. **실험 설계** — A/B 테스트가 필요하면 `[ED]` 명령을 사용하세요

**상세 문서는 [docs/](docs/)를 참조하세요.**

---

## Components

### Agents

| Agent | Name | Role |
|-------|------|------|
| data-analyst | 재만 | 데이터 분석 전문가 |

### Workflows

**Core Workflows:**
| Workflow | Purpose |
|----------|---------|
| data-analysis | Amplitude 데이터 조회 및 분석 |
| experiment-design | A/B 테스트 설계, 가설 수립 |
| insight-extraction | 과거 데이터에서 패턴/인사이트 발견 |

**Feature Workflows:**
| Workflow | Purpose |
|----------|---------|
| funnel-analysis | 특정 퍼널 심층 분석 |
| experiment-results | A/B 테스트 결과 해석 |
| impact-analysis | 기능 변경 시 예상 영향 분석 |
| risk-monitoring | 이상 징후 감지 및 알림 |

**Utility Workflows:**
| Workflow | Purpose |
|----------|---------|
| service-context | 서비스 컨텍스트 설정 |
| report-generation | 분석 결과 문서화 |

---

## Configuration

모듈 설치 시 다음 설정 옵션을 구성할 수 있습니다:

| Variable | Description | Default |
|----------|-------------|---------|
| `user_skill_level` | 데이터 분석 경험 수준 | beginner |
| `analysis_output_folder` | 분석 리포트 저장 위치 | `{output_folder}/analysis-reports` |
| `enable_proactive_alerts` | 선제적 위험 알림 활성화 | true |

---

## Module Structure

```
dae/
├── module.yaml
├── config.yaml
├── README.md
├── TODO.md
├── docs/
│   ├── getting-started.md
│   ├── agents.md
│   ├── workflows.md
│   └── examples.md
├── agents/
│   └── data-analyst.spec.md
├── workflows/
│   ├── data-analysis/
│   ├── experiment-design/
│   ├── insight-extraction/
│   ├── funnel-analysis/
│   ├── experiment-results/
│   ├── impact-analysis/
│   ├── risk-monitoring/
│   ├── service-context/
│   └── report-generation/
└── _module-installer/
    └── installer.js
```

---

## Documentation

상세 사용 가이드는 **[docs/](docs/)** 폴더를 참조하세요:

- [Getting Started](docs/getting-started.md)
- [Agents Reference](docs/agents.md)
- [Workflows Reference](docs/workflows.md)
- [Examples](docs/examples.md)

---

## Development Status

이 모듈은 현재 개발 중입니다. 다음 컴포넌트가 계획되어 있습니다:

- [ ] Agents: 1 agent (재만)
- [ ] Workflows: 9 workflows

상세 현황은 TODO.md를 참조하세요.

---

## Author

Created via BMAD Module workflow on 2026-01-27

---

## License

Part of the BMAD framework.
