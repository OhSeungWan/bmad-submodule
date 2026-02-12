# BMAD Framework Submodule

![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)
![npm](https://img.shields.io/npm/v/bmad-setup.svg)
![BMAD](https://img.shields.io/badge/BMAD-6.0.0--beta.8-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Claude Code](https://img.shields.io/badge/Claude%20Code-only-purple.svg)

BMAD 프레임워크를 Git Submodule로 관리하여 **팀별, 프로젝트별로 간편하게 커스터마이징**할 수 있는 세팅 도구입니다.

한 줄 설치(`npx bmad-setup`)로 에이전트, 워크플로우, 지식 베이스를 프로젝트에 즉시 적용하고, 필요한 모듈만 골라 사용할 수 있습니다.

> **Claude Code 전용** — 슬래시 커맨드 및 에이전트 시스템이 Claude Code의 커맨드 구조에 맞춰 설계되어 있습니다.

| 항목              | 버전         |
| ----------------- | ------------ |
| Submodule Version | v1.5.0       |
| BMAD Framework    | 6.0.0-beta.8 |

> [Changelog](./CHANGELOG.md)에서 변경 이력을 확인하세요.

---

## BMAD Method란?

**BMAD(Breakthrough Method of Agile AI-Driven Development)** 는 AI 기반 소프트웨어 개발을 위한 오픈소스 프레임워크입니다.

아이디어 기획부터 구현까지 전체 개발 과정을 **전문화된 AI 에이전트**와 **가이드 워크플로우**로 지원하며, 프로젝트 복잡도에 맞춘 적응형 접근 방식을 제공합니다.

- **전문 에이전트** — Analyst, PM, Architect, Dev, Test Architect 등 역할별 AI 에이전트
- **가이드 워크플로우** — 단계별 개발 프로세스로 일관된 품질 확보
- **적응형 계획** — 버그 수정부터 엔터프라이즈 플랫폼까지 프로젝트 규모에 맞게 동적 조정

> 공식 문서: [https://docs.bmad-method.org](https://docs.bmad-method.org/)

---

## 왜 이 서브모듈을 사용하나요?

BMAD 프레임워크 원본은 범용으로 설계되어 있습니다. 이 서브모듈은 그것을 **우리 팀의 실정에 맞게 가져다 쓰는 방법**을 제공합니다.

### 팀/프로젝트별 커스터마이징

- **모듈 선택** — 필요한 모듈(소프트웨어 개발, 테스트, 데이터 분석 등)만 골라 사용
- **에이전트 커스텀** — 팀 컨벤션, 기술 스택, 도메인 용어를 에이전트에 반영
- **워크플로우 조정** — 팀의 개발 프로세스에 맞게 워크플로우를 추가/수정
- **메모리 템플릿** — 프로젝트별 컨텍스트(서비스 정보, 퍼널, 지표 등)를 사전 설정

### Submodule 방식의 이점

| 구분      | 직접 복사                 | Submodule 사용            |
| --------- | ------------------------- | ------------------------- |
| PR 크기   | 300개 이상 파일 변경      | 2개 파일만 변경           |
| 업데이트  | 각 프로젝트마다 수동 복사 | `git pull` 한 번으로 해결 |
| 버전 관리 | 어떤 버전인지 추적 어려움 | 커밋 SHA로 정확한 버전 추적 |
| 설치      | 수동 복사                 | `npx bmad-setup` 한 줄    |

프레임워크 원본이 업데이트되더라도, 커스터마이징한 설정은 프로젝트에 그대로 유지됩니다.

---

## 제공 모듈

| 모듈   | 설명                     | 주요 에이전트/워크플로우                  |
| ------ | ------------------------ | ---------------------------------------- |
| `core` | 핵심 기능                | bmad-master, brainstorming, party-mode   |
| `bmm`  | 소프트웨어 개발          | analyst, architect, dev, pm, sm, ux      |
| `bmb`  | 모듈 빌더                | agent-builder, workflow-builder          |
| `gds`  | 게임 개발                | game-designer, game-dev, game-qa         |
| `tea`  | 테스트 아키텍처          | test-engineer-architect                  |
| `cis`  | 크리에이티브 & 혁신 전략 | design-thinking, innovation, storytelling |
| `dae`  | 데이터 분석 (커스텀)     | data-analyst, Amplitude 연동             |

---

## 빠른 시작

### 설치

```bash
npx bmad-setup
```

자동으로 수행되는 작업:

1. `bmad-submodule` Git Submodule 추가 및 초기화
2. `.gitmodules`에 `ignore = dirty` 설정
3. `install.sh` 실행 (심볼릭 링크 생성)
4. `.gitignore`에 BMAD 항목 추가
5. `package.json`에 postinstall / bmad:install / bmad:uninstall 스크립트 추가

> 이미 설치된 항목은 자동으로 스킵됩니다 (멱등성 보장).

### 업데이트

```bash
npx bmad-setup --update
```

Submodule을 최신 버전으로 pull하고 심볼릭 링크를 갱신합니다.

### 동작 확인

```bash
claude
```

Claude Code 실행 후 `/bmad-`를 입력하면 사용 가능한 커맨드 목록이 자동완성됩니다.

```bash
# 예시: 에이전트 실행
/bmad-agent-bmm-dev            # 개발자 에이전트
/bmad-agent-bmm-architect      # 아키텍트 에이전트
/bmad-agent-bmad-master        # 마스터 에이전트
/bmad-agent-dae-data-analyst   # 데이터 분석가
```

---

## 프로젝트 구조

```
bmad-submodule/
├── .claude/
│   └── commands/
│       ├── bmad-agent-*.md     # 에이전트 슬래시 커맨드
│       ├── bmad-bmm-*.md       # BMM 워크플로우 커맨드
│       ├── bmad-bmb-*.md       # BMB 빌더 커맨드
│       ├── bmad-gds-*.md       # GDS 게임 개발 커맨드
│       ├── bmad-tea-*.md       # TEA 테스트 커맨드
│       ├── bmad-cis-*.md       # CIS 크리에이티브 커맨드
│       ├── bmad-dae-*.md       # DAE 데이터 분석 커맨드
│       └── commit.md           # 커밋 커맨드
├── _bmad/                      # BMAD 프레임워크 리소스
│   ├── _config/                # 설정 파일 (manifest, IDE 설정)
│   ├── _memory/                # 메모리/사이드카 템플릿
│   ├── core/                   # 핵심 모듈
│   ├── bmm/                    # 소프트웨어 개발 모듈
│   ├── bmb/                    # 모듈 빌더
│   ├── gds/                    # 게임 개발 모듈
│   ├── tea/                    # 테스트 아키텍처 모듈
│   ├── cis/                    # 크리에이티브 & 혁신 전략 모듈
│   └── dae/                    # 데이터 분석 모듈
├── src/modules/                # 모듈 소스 코드
├── install.sh                  # 심볼릭 링크 생성 스크립트
└── uninstall.sh                # 심볼릭 링크 제거 스크립트
```

---

## 수동 설치

`npx bmad-setup` 대신 직접 설치하려면 아래 단계를 따르세요.

### 1단계: Submodule 추가

```bash
git submodule add https://github.com/OhSeungWan/bmad-submodule.git bmad-submodule
git submodule init
git submodule update
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
```

### 2단계: 심볼릭 링크 생성

```bash
./bmad-submodule/install.sh
```

생성되는 링크:

- `.claude/commands/bmad-*.md` → `bmad-submodule/.claude/commands/bmad-*.md`
- `.claude/commands/commit.md` → `bmad-submodule/.claude/commands/commit.md`
- `_bmad` → `bmad-submodule/_bmad`

### 3단계: package.json 설정 (권장)

팀원들의 자동 설치를 위해 추가:

```json
{
  "scripts": {
    "postinstall": "[ -z \"$CI\" ] && git submodule update --init --recursive && git -C bmad-submodule pull origin master && ./bmad-submodule/install.sh || true",
    "bmad:install": "./bmad-submodule/install.sh",
    "bmad:uninstall": "./bmad-submodule/uninstall.sh"
  }
}
```

| 스크립트         | 실행 시점        | 동작                                  |
| ---------------- | ---------------- | ------------------------------------- |
| `postinstall`    | `npm install` 후 | Submodule 초기화 + 최신화 + 링크 생성 |
| `bmad:install`   | 수동 실행        | 심볼릭 링크만 생성                    |
| `bmad:uninstall` | 수동 실행        | 심볼릭 링크 제거                      |

### 4단계: .gitignore 추가

```
# BMAD 심볼릭 링크 (실제 파일은 submodule에 있음)
.claude/commands/bmad
_bmad
```

---

## 팀원 온보딩

새 팀원이 프로젝트를 받을 때:

```bash
# 방법 1: 한 번에 (권장)
git clone --recurse-submodules <your-repo-url>

# 방법 2: clone 후 별도 초기화
git clone <your-repo-url>
cd <your-repo>
git submodule update --init --recursive
```

> `--recurse-submodules` 없이 clone하면 `bmad-submodule` 폴더가 비어있습니다.

`package.json`에 postinstall이 설정되어 있다면, `npm install`만으로 자동 초기화됩니다.

---

## 문제 해결

<details>
<summary><b>bmad-submodule 폴더가 비어있어요</b></summary>

Submodule이 초기화되지 않은 상태입니다.

```bash
git submodule update --init --recursive
```

</details>

<details>
<summary><b>git status에서 bmad-submodule (modified content)가 보여요</b></summary>

에디터 자동 포맷팅(줄 끝 공백 제거, 탭→스페이스 등) 때문입니다.

```bash
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
git submodule foreach --recursive git checkout .
```

</details>

<details>
<summary><b>심볼릭 링크가 작동하지 않아요</b></summary>

Windows에서는 관리자 권한이 필요할 수 있습니다.

```bash
./bmad-submodule/install.sh
ls -la .claude/commands/bmad
ls -la _bmad
```

</details>

<details>
<summary><b>완전 재설치</b></summary>

문제가 지속되면 깨끗하게 다시 시작:

```bash
# 1. 리셋
git reset HEAD -- .gitmodules bmad-submodule 2>/dev/null || true
git checkout HEAD -- .gitmodules 2>/dev/null || true

# 2. 제거
git submodule deinit -f bmad-submodule 2>/dev/null || true
git rm -f bmad-submodule 2>/dev/null || true
rm -rf bmad-submodule
rm -rf .git/modules/bmad-submodule

# 3. .gitmodules 정리
git config -f .gitmodules --remove-section submodule.bmad-submodule 2>/dev/null || true
git add .gitmodules

# 4. 다시 추가
git submodule add https://github.com/OhSeungWan/bmad-submodule.git bmad-submodule
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
```

> .gitignore에서 관련 폴더를 제거했는지도 확인하세요. 특정 Claude 버전에서 .gitignore에 추가된 파일을 인식하지 못할 수 있습니다.

</details>

---

## FAQ

**Q: Submodule 내부에서 직접 수정해도 되나요?**
가능하지만 권장하지 않습니다. 수정사항은 bmad-submodule 저장소에 별도로 커밋/푸시해야 합니다. 팀 프로젝트라면 원본 저장소에 PR을 보내세요.

**Q: 특정 버전의 BMAD를 고정하고 싶어요**
Submodule은 특정 커밋을 가리키므로 기본적으로 버전이 고정됩니다. `git pull`을 하지 않으면 해당 버전이 유지됩니다.

**Q: CI/CD에서는 어떻게 하나요?**
postinstall 스크립트에 `[ -z "$CI" ]` 조건이 있어 CI 환경에서는 스킵됩니다. CI에서 BMAD가 필요하다면 이 조건을 제거하세요.

---

## [Changelog](./CHANGELOG.md)

## 라이선스

MIT License
