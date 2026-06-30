import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const BOOTSTRAP_DIR = join(ROOT, 'showcase/src/sections/bootstrap');

describe('bootstrap coverage', () => {
  it('has bootstrap showcase sections', () => {
    const sections = readdirSync(BOOTSTRAP_DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
    assert.ok(sections.length >= 12, `expected ≥12 sections, got ${sections.length}`);
  });

  it('bootstrap styling layer files exist', () => {
    assert.ok(existsSync(join(ROOT, 'scss/bootstrap-components.scss')));
    assert.ok(existsSync(join(ROOT, 'scss/bootstrap-utilities.scss')));
    assert.ok(existsSync(join(ROOT, 'scss/_bootstrap-compile.generated.scss')));
  });

  it('bootstrap-components maps primary button', () => {
    const components = readFileSync(join(ROOT, 'scss/bootstrap-components.scss'), 'utf8');
    assert.match(components, /\.btn-primary/);
    assert.match(components, /\$ds-color-primary-default/);
  });

  it('bootstrap-theme.scss exists', () => {
    assert.ok(existsSync(join(ROOT, 'scss/bootstrap-theme.scss')));
  });
});
