#!/usr/bin/env node

'use strict';

const { execSync, execFileSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const VERSION = require('../package.json').version;
const REPO_URL = 'https://github.com/OhSeungWan/bmad-submodule.git';
const SUBMODULE_DIR = 'bmad-submodule';

const args = process.argv.slice(2);
const isUpdate = args.includes('--update') || args.includes('-u');

const log = (icon, msg) => console.log(`${icon} ${msg}`);
const logStep = (n, total, msg) => log(`[${n}/${total}]`, msg);

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runCapture(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function runSafe(cmd, stepName) {
  try {
    run(cmd);
  } catch (e) {
    throw new Error(`${stepName} 실패: ${e.message}`);
  }
}

function runFile(file, args, stepName) {
  try {
    execFileSync(file, args, { stdio: 'inherit' });
  } catch (e) {
    throw new Error(`${stepName} 실패: ${e.message}`);
  }
}

// --- --help / --version ---
function handleFlags() {
  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION);
    process.exit(0);
  }
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
rentre-bmad-setup v${VERSION}

BMAD Framework 서브모듈을 한 줄로 설치합니다.

Usage:
  npx rentre-bmad-setup@latest            전체 설치 실행 (worktree 자동 감지)
  npx rentre-bmad-setup@latest --update   서브모듈 최신화 + 심링크 재생성 + 부모 참조 갱신
  npx rentre-bmad-setup@latest --help     도움말 표시
  npx rentre-bmad-setup@latest --version  버전 표시

Install steps:
  1. git submodule add (bmad-submodule)
  2. git submodule init & update
  3. .gitmodules ignore=dirty 설정
  4. install.sh 실행 (심볼릭 링크)
  5. post-checkout hook 설치 (worktree 자동 지원)
  6. .gitignore 패치
  7. package.json 스크립트 패치

Worktree 감지 시 (자동):
  1. git submodule init & update
  2. install.sh 실행 (심볼릭 링크)

Update steps (--update):
  1. git -C bmad-submodule fetch + checkout origin/master
  2. 부모 repo submodule 참조 갱신 (git add)
  3. install.sh 재실행 (심링크 갱신)

Requirements:
  - git 2.13+
`);
    process.exit(0);
  }
}

// --- Version check against npm registry ---
function checkLatestVersion() {
  return new Promise((resolve) => {
    const req = https.get(
      'https://registry.npmjs.org/rentre-bmad-setup/latest',
      { timeout: 3000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const latest = JSON.parse(data).version;
            if (latest && latest !== VERSION) {
              console.log('');
              log('\u26a0', `새 버전이 있습니다: v${latest} (현재: v${VERSION})`);
              log('', '  최신 버전으로 실행하세요: npx rentre-bmad-setup@latest');
              console.log('');
            }
          } catch (e) {
            // ignore parse errors
          }
          resolve();
        });
      },
    );
    req.on('error', () => resolve());
    req.on('timeout', () => {
      req.destroy();
      resolve();
    });
  });
}

// --- Step 0: Pre-validation ---
function validateGitRepo() {
  try {
    runCapture('git rev-parse --git-dir');
  } catch (e) {
    log('\u274c', 'Error: 현재 디렉토리는 git 저장소가 아닙니다.');
    log('', '먼저 `git init` 을 실행하거나 git 프로젝트 루트에서 다시 시도하세요.');
    process.exit(1);
  }

  // Ensure we are at the git repo root
  const toplevel = runCapture('git rev-parse --show-toplevel');
  if (path.resolve(toplevel) !== path.resolve(process.cwd())) {
    log('\u274c', 'Error: git 저장소의 루트 디렉토리에서 실행해주세요.');
    log('', `  현재 위치: ${process.cwd()}`);
    log('', `  git root:  ${toplevel}`);
    process.exit(1);
  }
}

// --- Task 1: git version check ---
function validateGitVersion() {
  try {
    const versionOutput = runCapture('git --version');
    const match = versionOutput.match(/(\d+)\.(\d+)/);
    if (!match) {
      log('\u26a0', `Warning: git 버전을 파싱할 수 없습니다. (출력: ${versionOutput})`);
      return;
    }
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    if (major < 2 || (major === 2 && minor < 13)) {
      log('\u274c', `Error: git 2.13 이상이 필요합니다. (현재: ${versionOutput})`);
      process.exit(1);
    }
  } catch (e) {
    log('\u274c', 'Error: git 버전을 확인할 수 없습니다.');
    process.exit(1);
  }
}

// --- Task 2: worktree detection ---
function isWorktree() {
  try {
    return fs.existsSync('.git') && fs.statSync('.git').isFile();
  } catch (e) {
    return false;
  }
}

// --- Update mode ---
function pullLatest() {
  if (!fs.existsSync(SUBMODULE_DIR)) {
    log('  \u274c', `${SUBMODULE_DIR}/ 디렉토리가 없습니다. 먼저 \`npx rentre-bmad-setup@latest\`으로 설치하세요.`);
    process.exit(1);
  }
  runSafe(`git -C ${SUBMODULE_DIR} fetch origin master`, 'Submodule fetch');
  runSafe(`git -C ${SUBMODULE_DIR} checkout origin/master`, 'Submodule checkout');
  log('  \u2714', '최신 버전으로 업데이트 완료');
  return 'done';
}

// --- Task 4: update parent ref ---
function updateParentRef() {
  if (isWorktree()) {
    log('  \u2139', 'Worktree 환경에서는 부모 참조 갱신을 건너뜁니다. 메인 worktree에서 --update를 실행하세요.');
    return 'skipped';
  }
  runSafe(`git add ${SUBMODULE_DIR}`, '부모 repo 참조 갱신');
  log('  \u2714', '부모 repo의 submodule 참조가 staged 되었습니다. 필요 시 commit 하세요.');
  return 'done';
}

function reinstallSymlinks() {
  const scriptPath = `./${SUBMODULE_DIR}/install.sh`;
  if (!fs.existsSync(scriptPath)) {
    log('  \u26a0', `${scriptPath} 파일을 찾을 수 없습니다. 스킵합니다.`);
    return 'skipped';
  }
  runFile('bash', [scriptPath, process.cwd()], 'install.sh 실행');
  log('  \u2714', '심링크 갱신 완료');
  return 'done';
}

// --- Step 1: Submodule 추가 ---
function addSubmodule() {
  if (fs.existsSync(SUBMODULE_DIR)) {
    log('  \u2714', `${SUBMODULE_DIR}/ 이미 존재합니다. 스킵합니다.`);
    return 'skipped';
  }
  runSafe(`git submodule add ${REPO_URL} ${SUBMODULE_DIR}`, 'Submodule 추가');
  log('  \u2714', 'Submodule 추가 완료');
  return 'done';
}

// --- Step 2: Submodule 초기화 ---
function initSubmodule() {
  runSafe('git submodule init && git submodule update', 'Submodule 초기화');
  log('  \u2714', '초기화 완료');
  return 'done';
}

// --- Step 3: dirty ignore 설정 ---
function configureDirtyIgnore() {
  runSafe(
    `git config -f .gitmodules submodule.${SUBMODULE_DIR}.ignore dirty`,
    'dirty ignore 설정',
  );
  log('  \u2714', '.gitmodules ignore=dirty 설정 완료');
  return 'done';
}

// --- Step 4: install.sh 실행 ---
function runInstallScript() {
  const scriptPath = `./${SUBMODULE_DIR}/install.sh`;
  if (!fs.existsSync(scriptPath)) {
    log('  \u26a0', `${scriptPath} 파일을 찾을 수 없습니다. 스킵합니다.`);
    return 'skipped';
  }
  runFile('bash', [scriptPath, process.cwd()], 'install.sh 실행');
  log('  \u2714', '심볼릭 링크 생성 완료');
  return 'done';
}

// --- Task 8: post-checkout hook 설치 ---
function installPostCheckoutHook() {
  const MARKER_START = '# BMAD-POST-CHECKOUT-START';
  const MARKER_END = '# BMAD-POST-CHECKOUT-END';

  let hooksDir;
  try {
    const gitCommonDir = runCapture('git rev-parse --git-common-dir');
    hooksDir = path.join(gitCommonDir, 'hooks');
  } catch (e) {
    log('  \u26a0', 'git hooks 디렉토리를 찾을 수 없습니다. 스킵합니다.');
    return 'skipped';
  }

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookPath = path.join(hooksDir, 'post-checkout');
  let content = '';

  if (fs.existsSync(hookPath)) {
    content = fs.readFileSync(hookPath, 'utf8');
    if (content.includes(MARKER_START)) {
      log('  \u2714', 'post-checkout hook에 BMAD 섹션이 이미 존재합니다. 스킵합니다.');
      return 'skipped';
    }
  }

  const bmadSection = `
${MARKER_START}
# Auto-generated by bmad-setup. Do not edit this section.
if [ "$3" = "1" ] && [ -d "${SUBMODULE_DIR}" ]; then
  # Branch checkout (including worktree creation)
  git submodule update --init --recursive 2>/dev/null
  if [ -f "${SUBMODULE_DIR}/install.sh" ]; then
    bash ${SUBMODULE_DIR}/install.sh "$(pwd)" 2>/dev/null
  fi
fi
${MARKER_END}
`;

  if (content) {
    // Append to existing hook
    fs.writeFileSync(hookPath, content.trimEnd() + '\n' + bmadSection, 'utf8');
  } else {
    // Create new hook
    fs.writeFileSync(hookPath, '#!/bin/bash\n' + bmadSection, 'utf8');
  }

  // Make executable
  fs.chmodSync(hookPath, 0o755);
  log('  \u2714', 'post-checkout hook 설치 완료');
  return 'done';
}

// --- Step 5: .gitignore 패치 ---
function patchGitignore() {
  const MARKER_START = '# BMAD symlinks (auto-generated)';
  const MARKER_END = '# End BMAD';
  const entries = ['_bmad', '.claude/skills/bmad-*', '.claude/skills/gds-*', '.claude/skills/wds', '.claude/skills/wds-*', '.claude/skills/applying-fsd-architecture', '.claude/commands/bmad-*'];
  const gitignorePath = '.gitignore';

  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
  }

  const section = ['', MARKER_START, ...entries, MARKER_END, ''].join('\n');

  // Replace existing BMAD section if present (handles migration from old entries)
  if (content.includes(MARKER_START) && content.includes(MARKER_END)) {
    const regex = new RegExp(`\\n?${MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    const updated = content.replace(regex, section);
    if (updated === content) {
      log('  \u2714', '.gitignore BMAD 섹션이 이미 최신 상태입니다.');
      return 'skipped';
    }
    fs.writeFileSync(gitignorePath, updated, 'utf8');
    log('  \u2714', '.gitignore BMAD 섹션 업데이트 완료');
    return 'done';
  }

  // Check if individual entries already exist
  const missing = entries.filter((e) => !content.split('\n').some((line) => line.trim() === e));
  if (missing.length === 0) {
    log('  \u2714', '.gitignore에 BMAD 항목이 이미 존재합니다. 스킵합니다.');
    return 'skipped';
  }

  fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + section, 'utf8');
  log('  \u2714', `.gitignore에 BMAD 항목 추가 완료`);
  return 'done';
}

// --- Step 6: package.json 패치 ---
function patchPackageJson() {
  const pkgPath = 'package.json';
  if (!fs.existsSync(pkgPath)) {
    log('  \u26a0', 'package.json이 없습니다. 이 단계를 스킵합니다.');
    return 'skipped';
  }

  const raw = fs.readFileSync(pkgPath, 'utf8');

  // Detect indent style from original file
  const indentMatch = raw.match(/^(\s+)"/m);
  const indent = indentMatch ? indentMatch[1] : '  ';

  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (e) {
    log('  \u26a0', `package.json 파싱 실패: ${e.message}. 이 단계를 스킵합니다.`);
    return 'skipped';
  }

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  const scriptsToAdd = {
    postinstall:
      '[ -z "$CI" ] && git -C bmad-submodule fetch origin master && git -C bmad-submodule checkout origin/master && git add bmad-submodule && ./bmad-submodule/install.sh "$(pwd)" || true',
    'bmad:install': './bmad-submodule/install.sh "$(pwd)"',
    'bmad:uninstall': './bmad-submodule/uninstall.sh "$(pwd)"',
  };

  let added = 0;
  let warned = 0;
  for (const [key, value] of Object.entries(scriptsToAdd)) {
    if (pkg.scripts[key]) {
      log('  \u26a0', `scripts.${key} 이미 존재합니다. 덮어쓰지 않습니다.`);
      warned++;
    } else {
      pkg.scripts[key] = value;
      added++;
    }
  }

  if (added > 0) {
    const spaces = indent.length;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, spaces) + '\n', 'utf8');
    log('  \u2714', `package.json에 ${added}개 스크립트 추가 완료`);
  }
  if (warned > 0 && added === 0) {
    log('  \u2714', '모든 스크립트가 이미 존재합니다. 스킵합니다.');
    return 'skipped';
  }

  return added > 0 ? 'done' : 'skipped';
}

// --- Main ---
async function main() {
  handleFlags();

  await checkLatestVersion();

  validateGitRepo();
  validateGitVersion();

  if (isUpdate) {
    console.log('');
    console.log('=== BMAD Submodule Update ===');
    console.log('');

    const steps = [
      { key: 'pull', label: 'Submodule 최신화', fn: pullLatest },
      { key: 'parentRef', label: '부모 참조 갱신', fn: updateParentRef },
      { key: 'reinstall', label: '심링크 갱신', fn: reinstallSymlinks },
      { key: 'gitignore', label: '.gitignore 갱신', fn: patchGitignore },
    ];

    return runSteps(steps, 'BMAD 업데이트가 완료되었습니다!');
  }

  // Task 7: worktree auto-detect
  if (isWorktree()) {
    console.log('');
    console.log('=== BMAD Worktree Setup ===');
    console.log('\u2139 Git worktree 환경이 감지되었습니다.');
    console.log('');

    const steps = [
      { key: 'init', label: 'Submodule 초기화', fn: initSubmodule },
      { key: 'installSh', label: '심볼릭 링크 생성', fn: runInstallScript },
    ];

    return runSteps(steps, 'Worktree BMAD 설정이 완료되었습니다!');
  }

  console.log('');
  console.log('=== BMAD Submodule Setup ===');
  console.log('');

  const steps = [
    { key: 'submodule', label: 'Submodule 추가', fn: addSubmodule },
    { key: 'init', label: 'Submodule 초기화', fn: initSubmodule },
    { key: 'dirtyIgnore', label: 'dirty ignore 설정', fn: configureDirtyIgnore },
    { key: 'installSh', label: '심볼릭 링크 생성', fn: runInstallScript },
    { key: 'hook', label: 'post-checkout hook 설치', fn: installPostCheckoutHook },
    { key: 'gitignore', label: '.gitignore 패치', fn: patchGitignore },
    { key: 'packageJson', label: 'package.json 패치', fn: patchPackageJson },
  ];

  runSteps(steps, 'BMAD 설치가 완료되었습니다!');
}

// Task 3: dynamic logStep in runSteps
function runSteps(steps, doneMessage) {
  const results = {};
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    logStep(i + 1, steps.length, step.label);
    try {
      results[step.key] = step.fn();
    } catch (e) {
      log('  \u274c', e.message);
      results[step.key] = 'failed';
    }
  }

  console.log('');
  console.log('=== Summary ===');
  console.log('');

  for (const step of steps) {
    const status = results[step.key];
    const icon = status === 'done' ? '\u2714' : status === 'skipped' ? '\u2796' : '\u274c';
    console.log(`  ${icon} ${step.label}: ${status}`);
  }

  const hasFailed = Object.values(results).some((s) => s === 'failed');
  console.log('');
  if (hasFailed) {
    log('\u26a0', '일부 단계가 실패했습니다. 위 로그를 확인하세요.');
    process.exit(1);
  } else {
    log('\ud83d\ude80', doneMessage);
  }
  console.log('');
}

main().catch((e) => {
  log('\u274c', e.message);
  process.exit(1);
});
