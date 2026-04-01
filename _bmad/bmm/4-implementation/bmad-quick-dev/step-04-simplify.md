---
---

# Step 4: Simplify

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- 이 단계는 구현 코드의 품질 개선과 정리를 목적으로 한다.
- 기능 변경이나 새로운 기능 추가는 하지 않는다.

## INSTRUCTIONS

### Invoke Simplify

`/simplify` (Claude Code 공식 명령어)를 호출하여 step-03에서 변경된 코드를 대상으로 리뷰 및 정리를 수행한다.

대상 범위:
- `{baseline_commit}` 이후 변경된 모든 파일
- `{baseline_commit}`이 없거나 `NO_VCS`인 경우, step-03에서 작업한 파일 목록을 기준으로 수행

### Simplify 결과 반영

simplify가 제안하는 변경사항을 적용한다:
- 코드 재사용 개선
- 불필요한 복잡성 제거
- 일관성 및 가독성 향상
- 기존 프로젝트 패턴/컨벤션 준수

### Self-Check

simplify 적용 후 기존 기능이 깨지지 않았는지 확인:
- 테스트가 존재하면 실행
- 타입 체크가 가능하면 실행
- 빌드가 가능하면 실행

문제 발견 시 simplify 변경사항을 되돌리고 원본 구현을 유지한다.

## NEXT

Read fully and follow `./step-05-review.md`
