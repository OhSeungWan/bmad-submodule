# BMAD Framework Submodule

BMAD-METHOD - 범용 AI 에이전트 프레임워크

소프트웨어 개발 전체 라이프사이클을 위한 프롬프트 & 컨텍스트 엔지니어링 프레임워크입니다. 전문화된 에이전트(Analyst, PM, Architect, Dev, Test Architect)와 워크플로우, 지식 베이스를 제공합니다.

---

## Git Submodule이란?

Git을 처음 접하시거나 Submodule이 생소하신 분들을 위한 설명입니다.

### 기본 개념

**Submodule**은 하나의 Git 저장소 안에 다른 Git 저장소를 포함시키는 기능입니다.

일반적인 폴더와 달리:

- 실제 파일 전체가 아닌 **참조(포인터)**만 저장됩니다
- `.gitmodules` 파일에 원격 저장소 URL이 기록됩니다
- 특정 커밋(SHA)을 가리키므로 버전 고정이 가능합니다

### 비유로 이해하기

**일반 폴더 복사** = 책 전체를 복사해서 가져옴
**Submodule** = 도서관 책의 위치(서가 번호)만 메모해둠

따라서:

- 메인 프로젝트는 가볍게 유지됩니다
- BMAD 업데이트는 원본 저장소에서 한 번만 하면 됩니다
- 여러 프로젝트에서 동일한 BMAD를 공유할 수 있습니다

---

## 왜 Submodule을 사용하나요?

### 장점

| 구분        | 직접 복사                   | Submodule 사용              |
| ----------- | --------------------------- | --------------------------- |
| PR 크기     | 300개 이상 파일 변경        | 2개 파일만 변경             |
| 업데이트    | 각 프로젝트마다 수동 복사   | `git pull` 한 번으로 해결   |
| 버전 관리   | 어떤 버전인지 추적 어려움   | 커밋 SHA로 정확한 버전 추적 |
| 디스크 용량 | 프로젝트마다 전체 파일 중복 | 참조만 저장                 |
| 설치 자동화 | 불가능                      | `npm install`로 자동 초기화 |

### 단점 및 주의사항

- 초기 학습 곡선이 있습니다
- `git clone` 시 `--recurse-submodules` 옵션을 잊으면 빈 폴더가 됩니다
- Submodule 내부 변경사항은 별도로 커밋/푸시해야 합니다

---

## 언제 이 프레임워크를 사용하나요?

### 적합한 경우

- **AI 기반 개발 워크플로우**를 구축하려는 팀
- **Claude Code** 또는 **Cursor** 등 AI 도구를 활용하는 프로젝트
- 여러 프로젝트에서 **일관된 AI 프롬프트/에이전트**를 사용하고 싶을 때
- **소프트웨어 개발 전체 과정**(기획 → 설계 → 개발 → 테스트)에 AI를 적용하려는 경우

### 제공하는 모듈

| 모듈   | 설명                 | 주요 에이전트/워크플로우               |
| ------ | -------------------- | -------------------------------------- |
| `core` | 핵심 기능            | bmad-master, brainstorming, party-mode |
| `bmm`  | 소프트웨어 개발      | analyst, architect, dev, pm, sm, ux    |
| `bmb`  | 모듈 빌더            | agent-builder, workflow-builder        |
| `bmgd` | 게임 개발            | game-designer, game-dev, game-qa       |
| `dae`  | 데이터 분석 (커스텀) | data-analyst, Amplitude 연동           |

---

## 프로젝트 구조

```
bmad-submodule/
├── .claude/
│   └── commands/
│       ├── bmad/           # 모듈별 슬래시 커맨드
│       │   ├── core/       # 핵심 워크플로우/에이전트
│       │   ├── bmm/        # BMAD Method Module
│       │   ├── bmb/        # BMAD Module Builder
│       │   ├── bmgd/       # BMAD Game Dev
│       │   └── dae/        # Data Analysis Expert
│       └── commit.md       # 커밋 커맨드
├── _bmad/                  # BMAD 프레임워크 리소스
│   ├── _config/            # 설정 파일 (manifest, IDE 설정)
│   ├── _memory/            # 메모리/사이드카 템플릿
│   ├── core/               # 핵심 모듈
│   ├── bmm/                # 소프트웨어 개발 모듈
│   ├── bmb/                # 모듈 빌더
│   ├── bmgd/               # 게임 개발 모듈
│   └── dae/                # 데이터 분석 모듈
├── src/modules/            # 모듈 소스 코드
├── install.sh              # 심볼릭 링크 생성 스크립트
└── uninstall.sh            # 심볼릭 링크 제거 스크립트
```

---

## 설치 가이드

### 1단계: Submodule 추가

프로젝트 루트 디렉토리에서 실행:

```bash
# Submodule 추가
git submodule add https://github.com/OhSeungWan/bmad-submodule.git bmad-submodule

# Submodule 초기화 및 파일 다운로드
git submodule init
git submodule update

# dirty 상태 무시 설정 (아래 '설정 파일 설명' 참조)
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
```

### 2단계: 심볼릭 링크 생성

```bash
./bmad-submodule/install.sh
```

이 스크립트는 다음 심볼릭 링크를 생성합니다:

- `프로젝트/.claude/commands/bmad` → `bmad-submodule/.claude/commands/bmad`
- `프로젝트/_bmad` → `bmad-submodule/_bmad`

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

**각 스크립트 설명:**

| 스크립트         | 실행 시점        | 동작                                  |
| ---------------- | ---------------- | ------------------------------------- |
| `postinstall`    | `npm install` 후 | Submodule 초기화 + 최신화 + 링크 생성 |
| `bmad:install`   | 수동 실행        | 심볼릭 링크만 생성                    |
| `bmad:uninstall` | 수동 실행        | 심볼릭 링크 제거                      |

**postinstall 명령어 분석:**

```bash
[ -z "$CI" ]                              # CI 환경이 아닐 때만 실행
&& git submodule update --init --recursive # Submodule 초기화 및 업데이트
&& git -C bmad-submodule pull origin master # 최신 버전으로 업데이트
&& ./bmad-submodule/install.sh            # 심볼릭 링크 생성
|| true                                   # 실패해도 npm install은 계속 진행
```

### 4단계: .gitignore 추가

루트 프로젝트의 `.gitignore`에 추가:

```
# BMAD 심볼릭 링크 (실제 파일은 submodule에 있음)
.claude/commands/bmad
_bmad
```

---

## 설정 파일 상세 설명

### .gitmodules

Submodule 정보가 저장되는 파일입니다. `git submodule add` 실행 시 자동 생성됩니다.

```ini
[submodule "bmad-submodule"]
    path = bmad-submodule
    url = https://github.com/OhSeungWan/bmad-submodule.git
    ignore = dirty
```

| 항목     | 설명                                          |
| -------- | --------------------------------------------- |
| `path`   | Submodule이 위치할 로컬 경로                  |
| `url`    | Submodule의 원격 저장소 URL                   |
| `ignore` | `dirty` = 내부 변경사항을 git status에서 무시 |

### ignore = dirty 설정

**왜 필요한가요?**

VSCode 등 에디터가 파일을 열면 자동으로:

- 줄 끝 공백 제거
- 파일 끝 빈 줄 추가
- 탭→스페이스 변환

이런 자동 변경으로 인해 `git status`에서 `bmad-submodule (modified content)`가 표시됩니다.

**해결 방법:**

```bash
# dirty 상태 무시 설정
git config -f .gitmodules submodule.bmad-submodule.ignore dirty

# 이미 발생한 변경사항 되돌리기
git submodule foreach --recursive git checkout .
```

---

## Submodule과 함께 Clone

### 새 팀원이 프로젝트를 받을 때

```bash
# 방법 1: 한 번에 (권장)
git clone --recurse-submodules <your-repo-url>

# 방법 2: clone 후 별도 초기화
git clone <your-repo-url>
cd <your-repo>
git submodule update --init --recursive
```

**주의:** `--recurse-submodules` 없이 clone하면 `bmad-submodule` 폴더가 비어있습니다!

---

## Submodule 업데이트

BMAD에 새 기능이 추가되었을 때:

```bash
# 1. Submodule 디렉토리로 이동
cd bmad-submodule

# 2. 최신 버전 가져오기
git pull origin master

# 3. 심볼릭 링크 재생성 (새 파일이 추가된 경우)
./install.sh

# 4. 루트로 돌아가서 변경사항 커밋
cd ..
git add bmad-submodule
git commit -m "chore: update bmad-submodule"
git push
```

---

## 스크립트 상세 설명

### install.sh

```bash
./bmad-submodule/install.sh
```

**동작:**

1. 기존 심볼릭 링크/폴더가 있으면 삭제
2. 루트 프로젝트에 `.claude/commands` 디렉토리 생성
3. 심볼릭 링크 생성:
   - `.claude/commands/bmad` → submodule의 `.claude/commands/bmad`
   - `_bmad` → submodule의 `_bmad`

**언제 실행하나요?**

- 최초 설치 시
- Submodule 업데이트 후 (새 파일이 추가된 경우)
- 심볼릭 링크가 깨진 경우

### uninstall.sh

```bash
./bmad-submodule/uninstall.sh
```

**동작:**

1. 심볼릭 링크인 경우: 바로 삭제
2. 일반 디렉토리인 경우: 확인 후 삭제

**언제 실행하나요?**

- BMAD 사용을 중단할 때
- 심볼릭 링크 대신 직접 파일을 관리하고 싶을 때

---

## 동작 확인

설치가 완료되면 BMAD 에이전트가 정상적으로 작동하는지 확인합니다.

### 1. Claude Code 실행

프로젝트 루트 디렉토리에서 Claude Code를 실행합니다:

```bash
claude
```

### 2. 슬래시 커맨드 확인

Claude Code 내에서 `/bmad`를 입력하면 사용 가능한 커맨드 목록이 자동완성됩니다.

### 3. 에이전트 실행 테스트

예시로 Data Analyst 에이전트를 실행해봅니다:

```
/bmad:dae:agents:data-analyst
```

**정상 실행 시 출력 예시:**

```
안녕하세요, 렌트리 개발팀님! 📊

저는 재만이에요 - 여러분의 데이터 분석 파트너입니다.

----
현재 서비스 컨텍스트

아직 서비스 정보가 설정되지 않았어요. [SC] 서비스 컨텍스트 설정을 통해
렌트리 서비스의 퍼널과 핵심 지표를 학습하면 더 정확한 분석을 도와드릴 수 있어요!

----
메뉴

| #   | 명령어 | 설명                                   |
| --- | ------ | -------------------------------------- |
| 1   | [MH]   | 메뉴 도움말 다시 표시                  |
| 2   | [CH]   | 에이전트와 자유롭게 대화하기           |
| 3   | [QA]   | 빠른 데이터 분석 - 질문에 답하기       |
| 4   | [FA]   | 퍼널 분석 - 전환율, 병목, 이탈 분석    |
| 5   | [ED]   | 실험 설계 - A/B 테스트 계획 수립       |
| 6   | [ER]   | 실험 결과 분석 - 테스트 결과 해석      |
| 7   | [IA]   | 영향도 분석 - 기능 변경 영향 예측      |
| 8   | [RM]   | 위험 모니터링 - 이상 징후 감지         |
| 9   | [SC]   | 서비스 컨텍스트 설정 - 퍼널, 지표 학습 |
| 10  | [GR]   | 리포트 생성 - 분석 결과 문서화         |
| 11  | [DA]   | 에이전트 종료                          |

----
번호나 명령어를 입력해주세요. 무엇을 도와드릴까요?
```

위와 같이 에이전트 메뉴가 표시되면 설치가 정상적으로 완료된 것입니다.

### 4. 다른 에이전트/워크플로우 테스트

모듈별로 다양한 에이전트와 워크플로우를 테스트해볼 수 있습니다:

```bash
# BMM (소프트웨어 개발)
/bmad:bmm:agents:dev           # 개발자 에이전트
/bmad:bmm:agents:architect     # 아키텍트 에이전트
/bmad:bmm:workflows:prd        # PRD 작성 워크플로우

# Core (핵심)
/bmad:core:agents:bmad-master  # 마스터 에이전트
/bmad:core:workflows:brainstorming  # 브레인스토밍

# BMGD (게임 개발)
/bmad:bmgd:agents:game-designer    # 게임 디자이너
/bmad:bmgd:workflows:gdd           # GDD 작성
```

### 5. 설치 실패 시 체크리스트

에이전트가 실행되지 않으면 다음을 확인하세요:

| 확인 항목                   | 명령어                         |
| --------------------------- | ------------------------------ |
| Submodule이 초기화되었는가? | `ls bmad-submodule/`           |
| 심볼릭 링크가 생성되었는가? | `ls -la .claude/commands/bmad` |
| _bmad 링크가 생성되었는가?  | `ls -la _bmad`                 |
| install.sh를 실행했는가?    | `./bmad-submodule/install.sh`  |

---

## 문제 해결

### "bmad-submodule 폴더가 비어있어요"

Submodule이 초기화되지 않은 상태입니다.

```bash
git submodule update --init --recursive
```

### "git status에서 bmad-submodule (modified content)가 보여요"

에디터 자동 포맷팅 때문입니다.

```bash
# 설정으로 방지
git config -f .gitmodules submodule.bmad-submodule.ignore dirty

# 현재 변경사항 되돌리기
git submodule foreach --recursive git checkout .
```

### "심볼릭 링크가 작동하지 않아요"

Windows에서는 관리자 권한이 필요할 수 있습니다.

```bash
# 심볼릭 링크 재생성
./bmad-submodule/install.sh

# 링크 확인
ls -la .claude/commands/bmad
ls -la _bmad
```

### Submodule 완전 재설치

문제가 지속되면 깨끗하게 다시 시작:

```bash
# 1. 변경사항 리셋
git reset HEAD -- .gitmodules bmad-submodule 2>/dev/null || true
git checkout HEAD -- .gitmodules 2>/dev/null || true

# 2. Submodule 완전 제거
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

# 5. 확인
ls -la bmad-submodule/
git submodule status
```

gitignore 에서 관련 폴더 제거 (특정 클로드 버전에서 gitignore 에 추가된 파일을 클로드가 인식 못할 수도 있음)

---

## 자주 묻는 질문

### Q: Submodule 내부에서 직접 수정해도 되나요?

A: 가능하지만 권장하지 않습니다. 수정사항은 bmad-submodule 저장소에 별도로 커밋/푸시해야 합니다. 팀 프로젝트라면 원본 저장소에 PR을 보내세요.

### Q: 특정 버전의 BMAD를 고정하고 싶어요

A: Submodule은 특정 커밋을 가리키므로 기본적으로 버전이 고정됩니다. `git pull`을 하지 않으면 해당 버전이 유지됩니다.

### Q: CI/CD에서는 어떻게 하나요?

A: postinstall 스크립트에 `[ -z "$CI" ]` 조건이 있어 CI 환경에서는 스킵됩니다. CI에서 BMAD가 필요하다면 이 조건을 제거하세요.

---

## 라이선스

MIT License
