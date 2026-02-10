#!/usr/bin/env node

'use strict';

const { execSync } = require('child_process');
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

// --- --help / --version ---
function handleFlags() {
  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION);
    process.exit(0);
  }
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
bmad-setup v${VERSION}

BMAD Framework 서브모듈을 한 줄로 설치합니다.

Usage:
  npx bmad-setup            전체 설치 실행
  npx bmad-setup --update   서브모듈 최신화 + 심링크 재생성
  npx bmad-setup --help     도움말 표시
  npx bmad-setup --version  버전 표시

Install steps:
  1. git submodule add (bmad-submodule)
  2. git submodule init & update
  3. .gitmodules ignore=dirty 설정
  4. install.sh 실행 (심볼릭 링크)
  5. .gitignore 패치
  6. package.json 스크립트 패치

Update steps (--update):
  1. git submodule update --init --recursive
  2. git -C bmad-submodule pull origin master
  3. install.sh 재실행 (심링크 갱신)
`);
    process.exit(0);
  }
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

// --- Update mode ---
function updateSubmodule() {
  logStep(1, 3, 'Submodule 동기화');
  if (!fs.existsSync(SUBMODULE_DIR)) {
    log('  \u274c', `${SUBMODULE_DIR}/ 디렉토리가 없습니다. 먼저 \`npx bmad-setup\`으로 설치하세요.`);
    process.exit(1);
  }
  runSafe('git submodule update --init --recursive', 'Submodule 동기화');
  log('  \u2714', 'Submodule 동기화 완료');
  return 'done';
}

function pullLatest() {
  logStep(2, 3, 'Submodule 최신화 (pull origin master)');
  runSafe(`git -C ${SUBMODULE_DIR} pull origin master`, 'Submodule pull');
  log('  \u2714', '최신 버전으로 업데이트 완료');
  return 'done';
}

function reinstallSymlinks() {
  logStep(3, 3, 'install.sh 재실행 (심링크 갱신)');
  const scriptPath = `./${SUBMODULE_DIR}/install.sh`;
  if (!fs.existsSync(scriptPath)) {
    log('  \u26a0', `${scriptPath} 파일을 찾을 수 없습니다. 스킵합니다.`);
    return 'skipped';
  }
  runSafe(`bash ${scriptPath}`, 'install.sh 실행');
  log('  \u2714', '심링크 갱신 완료');
  return 'done';
}

// --- Step 1: Submodule 추가 ---
function addSubmodule() {
  logStep(1, 6, 'Submodule 추가');
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
  logStep(2, 6, 'Submodule 초기화');
  runSafe('git submodule init && git submodule update', 'Submodule 초기화');
  log('  \u2714', '초기화 완료');
  return 'done';
}

// --- Step 3: dirty ignore 설정 ---
function configureDirtyIgnore() {
  logStep(3, 6, 'dirty ignore 설정');
  runSafe(
    `git config -f .gitmodules submodule.${SUBMODULE_DIR}.ignore dirty`,
    'dirty ignore 설정',
  );
  log('  \u2714', '.gitmodules ignore=dirty 설정 완료');
  return 'done';
}

// --- Step 4: install.sh 실행 ---
function runInstallScript() {
  logStep(4, 6, 'install.sh 실행 (심볼릭 링크 생성)');
  const scriptPath = `./${SUBMODULE_DIR}/install.sh`;
  if (!fs.existsSync(scriptPath)) {
    log('  \u26a0', `${scriptPath} 파일을 찾을 수 없습니다. 스킵합니다.`);
    return 'skipped';
  }
  runSafe(`bash ${scriptPath}`, 'install.sh 실행');
  log('  \u2714', '심볼릭 링크 생성 완료');
  return 'done';
}

// --- Step 5: .gitignore 패치 ---
function patchGitignore() {
  logStep(5, 6, '.gitignore 패치');

  const MARKER_START = '# BMAD symlinks (auto-generated)';
  const MARKER_END = '# End BMAD';
  const entries = ['_bmad', '.claude/commands/bmad-*'];
  const gitignorePath = '.gitignore';

  let content = '';
  if (fs.existsSync(gitignorePath)) {
    content = fs.readFileSync(gitignorePath, 'utf8');
  }

  // Check if BMAD section already exists
  if (content.includes(MARKER_START)) {
    log('  \u2714', '.gitignore에 BMAD 섹션이 이미 존재합니다. 스킵합니다.');
    return 'skipped';
  }

  // Check if individual entries already exist
  const missing = entries.filter((e) => !content.split('\n').some((line) => line.trim() === e));
  if (missing.length === 0) {
    log('  \u2714', '.gitignore에 BMAD 항목이 이미 존재합니다. 스킵합니다.');
    return 'skipped';
  }

  const section = ['', MARKER_START, ...entries, MARKER_END, ''].join('\n');

  fs.writeFileSync(gitignorePath, content.trimEnd() + '\n' + section, 'utf8');
  log('  \u2714', `.gitignore에 BMAD 항목 추가 완료`);
  return 'done';
}

// --- Step 6: package.json 패치 ---
function patchPackageJson() {
  logStep(6, 6, 'package.json 패치');

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
      '[ -z "$CI" ] && git submodule update --init --recursive && git -C bmad-submodule pull origin master && ./bmad-submodule/install.sh || true',
    'bmad:install': './bmad-submodule/install.sh',
    'bmad:uninstall': './bmad-submodule/uninstall.sh',
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
function main() {
  handleFlags();

  validateGitRepo();

  if (isUpdate) {
    console.log('');
    console.log('=== BMAD Submodule Update ===');
    console.log('');

    const steps = [
      { key: 'sync', label: 'Submodule 동기화', fn: updateSubmodule },
      { key: 'pull', label: 'Submodule 최신화', fn: pullLatest },
      { key: 'reinstall', label: '심링크 갱신', fn: reinstallSymlinks },
    ];

    return runSteps(steps, 'BMAD 업데이트가 완료되었습니다!');
  }

  console.log('');
  console.log('=== BMAD Submodule Setup ===');
  console.log('');

  const steps = [
    { key: 'submodule', label: 'Submodule 추가', fn: addSubmodule },
    { key: 'init', label: 'Submodule 초기화', fn: initSubmodule },
    { key: 'dirtyIgnore', label: 'dirty ignore 설정', fn: configureDirtyIgnore },
    { key: 'installSh', label: 'install.sh 실행', fn: runInstallScript },
    { key: 'gitignore', label: '.gitignore 패치', fn: patchGitignore },
    { key: 'packageJson', label: 'package.json 패치', fn: patchPackageJson },
  ];

  runSteps(steps, 'BMAD 설치가 완료되었습니다!');
}

function runSteps(steps, doneMessage) {
  const results = {};
  for (const step of steps) {
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

main();
