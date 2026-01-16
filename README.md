# BMAD Framework Submodule

BMAD-METHOD - 범용 AI 에이전트 프레임워크

소프트웨어 개발 전체 라이프사이클을 위한 프롬프트 & 컨텍스트 엔지니어링 프레임워크입니다. 전문화된 에이전트(Analyst, PM, Architect, Dev, Test Architect)와 워크플로우, 지식 베이스를 제공합니다.

## Git Submodule을 사용하는 이유

Submodule은 다른 git 저장소에 대한 포인터입니다. 실제 파일이 아닌 참조(.gitmodules + SHA)만 저장합니다.

**장점:**
- 깔끔한 PR (300개 이상의 BMAD 파일 대신 2개 파일만 변경)
- 중앙 집중식 업데이트 (하나의 BMAD repo → 모든 프로젝트)
- `npm install`로 자동 초기화

## 설치

### 1. 프로젝트에 Submodule 추가

```bash
git submodule add https://github.com/OhSeungWan/bmad-submodule.git bmad-submodule
git submodule init
git submodule update
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
```

### 2. package.json 설정 (권장)

```json
{
  "scripts": {
    "postinstall": "[ -z \"$CI\" ] && git submodule update --init --recursive && cd bmad-submodule && git pull origin master && cd .. && ./bmad-submodule/install.sh || true",
    "bmad:install": "./bmad-submodule/install.sh",
    "bmad:uninstall": "./bmad-submodule/uninstall.sh"
  }
}
```

이제 `npm install` 시 BMAD가 자동 초기화되고 symlink가 생성됩니다.

### 3. .gitignore 추가

루트 프로젝트의 `.gitignore`에 추가:

```
.DS_Store
**/.DS_Store
.claude/commands/bmad
```

## Submodule과 함께 Clone

```bash
# 한 번에
git clone --recurse-submodules <your-repo>

# 또는 clone 후
git submodule update --init --recursive
```

## Submodule 업데이트

```bash
cd your-repo/bmad-submodule
git pull origin master
cd ..
npm install  # postinstall 스크립트 실행
git add bmad-submodule
git commit -m "chore: update bmad-submodule"
git push
```

## 스크립트 설명

### install.sh
- 루트 프로젝트의 `.claude/commands/bmad`에 심볼릭 링크 생성
- 기존 폴더/링크가 있으면 삭제 후 재생성

### uninstall.sh
- 심볼릭 링크 제거
- 일반 디렉토리인 경우 확인 후 삭제


## 문제 해결

### Dirty Submodule 상태

`git status`에서 `bmad-submodule (modified content)`가 표시되면 에디터 자동 포맷팅(예: VSCode의 `files.trimTrailingWhitespace`) 때문입니다.

설정으로 방지:
```bash
git config -f .gitmodules submodule.bmad-submodule.ignore dirty
```

수동 리셋:
```bash
git submodule foreach --recursive git checkout .
```

### Submodule 재설치 (클린 설치)

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
git submodule add <repository-url> bmad-submodule
git config -f .gitmodules submodule.bmad-submodule.ignore dirty

# 5. 확인
ls -la bmad-submodule/
git submodule status
```
