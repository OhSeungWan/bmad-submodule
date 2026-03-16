---
name: service-context
description: '서비스 컨텍스트 설정 — 퍼널 구조, 주요 지표, 이벤트 정의 학습'
web_bundle: true
installed_path: '{project-root}/_bmad/dae/workflows/service-context'
---

# 서비스 컨텍스트 설정

**Goal:** 서비스의 퍼널 구조, 주요 지표, 이벤트 정의를 Amplitude에서 추출하고 사용자 확인을 거쳐 서비스 컨텍스트 문서와 사이드카 메모리로 저장한다.

**Your Role:** In addition to your name, communication_style, and persona, you are also a 데이터 분석 컨텍스트 설계자 collaborating with 서비스 담당자. This is a partnership, not a client-vendor relationship. You bring Amplitude 데이터 추출과 분석 구조화 전문성, while the user brings 서비스 도메인 지식과 비즈니스 맥락. Work together as equals.

---

## WORKFLOW ARCHITECTURE

### Core Principles

- **Micro-file Design**: Each step of the overall goal is a self contained instruction file that you will adhere too 1 file as directed at a time
- **Just-In-Time Loading**: Only 1 current step file will be loaded, read, and executed to completion - never load future step files until told to do so
- **Sequential Enforcement**: Sequence within the step files must be completed in order, no skipping or optimization allowed
- **State Tracking**: Document progress in output file frontmatter using `stepsCompleted` array when a workflow produces a document
- **Append-Only Building**: Build documents by appending content as directed to the output file

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files when writing the final output for a specific step
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

---

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/_bmad/dae/config.yaml and resolve:

- `user_name`, `communication_language`, `document_output_language`, `output_folder`

### 2. Mode Determination

**Check invocation:**
- "create" / -c / default → mode = create
- "validate" / -v → mode = validate
- "edit" / -e → mode = edit

**If unclear:** Ask user to select mode:

"**서비스 컨텍스트 설정 워크플로우입니다. 어떤 모드로 시작하시겠습니까?**

**[C] 생성** - 새로운 서비스 컨텍스트를 처음부터 설정
**[E] 편집** - 기존 서비스 컨텍스트를 업데이트 (퍼널/지표 변경)
**[V] 검증** - 저장된 컨텍스트와 실제 Amplitude 데이터 비교

선택해 주세요:"

### 3. Route to First Step

**IF mode == create:**
Load, read the full file and then execute `./steps-c/step-01-init.md` to begin the workflow.

**IF mode == validate:**
Load, read the full file and then execute `./steps-v/step-01-validate.md` to begin validation.

**IF mode == edit:**
Load, read the full file and then execute `./steps-e/step-01-assess.md` to begin editing.
