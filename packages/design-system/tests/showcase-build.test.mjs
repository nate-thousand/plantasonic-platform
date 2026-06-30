import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'showcase/dist/index.html');

describe('visual regression (build gate)', () => {
  it('showcase production build succeeds', () => {
    if (!existsSync(join(ROOT, 'showcase/node_modules'))) {
      console.log('skip: showcase deps not installed');
      return;
    }
    const result = spawnSync('npm', ['run', 'showcase:build'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(existsSync(DIST));
  });
});
