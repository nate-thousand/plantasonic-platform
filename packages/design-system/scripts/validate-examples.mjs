#!/usr/bin/env node
/**
 * Validate official reference examples orchestrate successfully.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSpecification } from '../src/studio/specification.ts';
import { reproduceFromSpecification } from '../src/studio/orchestrator.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const examplesDir = join(ROOT, 'examples');
const dirs = readdirSync(examplesDir).filter((d) => !d.startsWith('.') && d !== 'README.md');

let ok = true;
for (const dir of dirs) {
  const specPath = join(examplesDir, dir, 'project.json');
  try {
    const spec = parseSpecification(readFileSync(specPath, 'utf8'));
    const result = reproduceFromSpecification(spec);
    if (!result.validation.ok) {
      console.error(`✗ ${dir}: validation failed`);
      ok = false;
    } else {
      console.log(`✓ ${dir} (${result.files.length} files)`);
    }
  } catch (e) {
    console.error(`✗ ${dir}: ${e instanceof Error ? e.message : e}`);
    ok = false;
  }
}

if (!ok) process.exit(1);
console.log(`\n✓ All ${dirs.length} reference examples validated`);
