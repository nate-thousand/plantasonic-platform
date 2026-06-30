import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const examplesDir = join(ROOT, 'examples');

describe('Reference examples', () => {
  const dirs = readdirSync(examplesDir).filter((d) => !d.startsWith('.') && d !== 'README.md');

  it('has 7 official examples', () => {
    assert.equal(dirs.length, 7);
  });

  for (const dir of dirs) {
    it(`${dir} orchestrates with valid validation`, async () => {
      const { parseSpecification } = await import('../src/studio/specification.ts');
      const { reproduceFromSpecification } = await import('../src/studio/orchestrator.ts');
      const spec = parseSpecification(readFileSync(join(examplesDir, dir, 'project.json'), 'utf8'));
      const result = reproduceFromSpecification(spec);
      assert.equal(result.validation.ok, true, result.validation.checks.filter((c) => !c.ok).map((c) => c.label).join(', '));
      assert.ok(result.files.some((f) => f.path === 'project.json'));
      assert.ok(result.files.some((f) => f.path === 'platform.json'));
    });
  }
});
