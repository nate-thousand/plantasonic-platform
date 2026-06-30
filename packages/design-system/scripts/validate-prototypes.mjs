#!/usr/bin/env node
/**
 * Generate and validate every official prototype type.
 * Usage: node scripts/validate-prototypes.mjs
 */
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createPrototype, validatePrototypeStructure, PROTOTYPE_TYPE_IDS } from '../src/prototype/index.ts';

const tmp = mkdtempSync(join(tmpdir(), 'ps-prototypes-'));
const failures = [];

console.log(`Validating ${PROTOTYPE_TYPE_IDS.length} prototype types in ${tmp}\n`);

for (const type of PROTOTYPE_TYPE_IDS) {
  try {
    const { files } = createPrototype({ type, name: `Test ${type}` });
    const dir = join(tmp, type);
    for (const file of files) {
      const target = join(dir, file.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.content.replace('__DS_DEPENDENCY__', 'github:nate-thousand/plantasonic-design-system'), 'utf8');
    }
    const report = validatePrototypeStructure(dir);
    if (!report.ok) {
      throw new Error(report.checks.filter((c) => !c.ok).map((c) => c.label).join(', '));
    }
    console.log(`✓ ${type}`);
  } catch (err) {
    console.error(`✗ ${type}: ${err.message}`);
    failures.push(type);
  }
}

rmSync(tmp, { recursive: true, force: true });

if (failures.length) {
  console.error(`\nFailed: ${failures.join(', ')}`);
  process.exit(1);
}

console.log('\n✓ All prototype types validated');
