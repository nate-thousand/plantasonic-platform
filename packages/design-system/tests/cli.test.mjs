import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;

describe('starter templates', () => {
  for (const id of ['react-vite', 'react-bootstrap', 'nextjs', 'electron']) {
    it(`template ${id} has package.json and README`, () => {
      const dir = join(ROOT, 'templates', id);
      assert.ok(existsSync(join(dir, 'package.json')));
      assert.ok(existsSync(join(dir, 'README.md')));
    });
  }

  it('CLI entry exists', () => {
    assert.ok(existsSync(join(ROOT, 'cli/index.mjs')));
  });
});
