#!/usr/bin/env node
/**
 * Build every starter template against the local design system package.
 * Usage: node scripts/validate-template-builds.mjs
 */

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname;
const TEMPLATES = ['react-vite', 'react-bootstrap', 'nextjs', 'electron'];
const DS_PKG = 'plantasonic-design-system';

function patchPackageJson(targetDir) {
  const pkgPath = join(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.dependencies[DS_PKG] = `file:${ROOT}`;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}`);
}

const tmpBase = mkdtempSync(join(tmpdir(), 'ps-templates-'));
const failures = [];

console.log(`Validating templates in ${tmpBase}\n`);

for (const id of TEMPLATES) {
  const target = join(tmpBase, id);
  console.log(`\n=== ${id} ===`);
  try {
    cpSync(join(ROOT, 'templates', id), target, { recursive: true });
    patchPackageJson(target);
    run('npm', ['install'], target);
    run('npm', ['run', 'build'], target);
    console.log(`✓ ${id} build passed`);
  } catch (err) {
    console.error(`✗ ${id}: ${err.message}`);
    failures.push(id);
  }
}

rmSync(tmpBase, { recursive: true, force: true });

if (failures.length) {
  console.error(`\nFailed templates: ${failures.join(', ')}`);
  process.exit(1);
}

console.log('\n✓ All template builds passed');
