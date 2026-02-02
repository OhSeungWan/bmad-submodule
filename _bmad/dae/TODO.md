# TODO: DAE (Data Analysis Expert)

Development roadmap for dae module.

---

## Agents to Build

- [ ] **data-analyst** (재만 - 데이터 분석 전문가)
  - Use: `bmad:bmb:agents:agent-builder` or `/bmad:bmb:agents:agent-builder`
  - Spec: `agents/data-analyst.spec.md`

---

## Workflows to Build

### Core Workflows

- [ ] **data-analysis** — Amplitude 데이터 조회 및 분석
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/data-analysis/data-analysis.spec.md`

- [ ] **experiment-design** — A/B 테스트 설계, 가설 수립
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/experiment-design/experiment-design.spec.md`

- [ ] **insight-extraction** — 과거 데이터에서 패턴/인사이트 발견
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/insight-extraction/insight-extraction.spec.md`

### Feature Workflows

- [ ] **funnel-analysis** — 특정 퍼널 심층 분석
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/funnel-analysis/funnel-analysis.spec.md`

- [ ] **experiment-results** — A/B 테스트 결과 해석
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/experiment-results/experiment-results.spec.md`

- [ ] **impact-analysis** — 기능 변경 시 예상 영향 분석
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/impact-analysis/impact-analysis.spec.md`

- [ ] **risk-monitoring** — 이상 징후 감지 및 알림
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/risk-monitoring/risk-monitoring.spec.md`

### Utility Workflows

- [ ] **service-context** — 서비스 컨텍스트 설정
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/service-context/service-context.spec.md`

- [ ] **report-generation** — 분석 결과 문서화
  - Use: `bmad:bmb:workflows:workflow` or `/workflow`
  - Spec: `workflows/report-generation/report-generation.spec.md`

---

## Installation Testing

- [ ] Test installation with `bmad install`
- [ ] Verify module.yaml prompts work correctly
- [ ] Test installer.js creates analysis output folder
- [ ] Verify Amplitude MCP connection works

---

## Documentation

- [ ] Complete README.md with more usage examples
- [ ] Enhance docs/ folder with detailed guides
- [ ] Add troubleshooting section
- [ ] Document Amplitude MCP integration details

---

## Integration Testing

- [ ] Test all agent menu commands
- [ ] Verify workflow execution
- [ ] Test sidecar memory functionality
- [ ] Validate Amplitude MCP queries

---

## Next Steps

1. **Build agent** — Use `agent-builder` workflow to create 재만 (data-analyst)
2. **Build workflows** — Use `workflow` workflow to create each workflow
3. **Test installation** — Run `bmad install dae` and verify
4. **Iterate** — Test and improve based on feedback

---

## Priority Order

Recommended build order:

1. `service-context` (필수 — 다른 워크플로우의 기반)
2. `data-analysis` (핵심 기능)
3. `funnel-analysis` (자주 사용)
4. `insight-extraction` (인사이트 도출)
5. `experiment-design` (실험 설계)
6. `experiment-results` (실험 결과)
7. `impact-analysis` (영향도 분석)
8. `risk-monitoring` (모니터링)
9. `report-generation` (리포트)

---

_Last updated: 2026-01-27_
