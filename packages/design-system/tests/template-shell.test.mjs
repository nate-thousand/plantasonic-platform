import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const TEMPLATES = ['react-vite', 'react-bootstrap', 'nextjs', 'electron'];

const FORBIDDEN = [
  'renderAppShell',
  'bindNavigationFramework',
  'showcase/src/lib',
  'AppLayout',
  'from \'./theme\'',
  'from "./theme"',
];

const REQUIRED = [
  'plantasonic-design-system/shell',
  'shell-config',
  'renderApplicationShell',
  'bindApplicationShell',
  'application-shell',
];

function readTemplateFiles(id) {
  const dir = join(ROOT, 'templates', id);
  const files = [
    join(dir, 'README.md'),
  ];
  if (id === 'nextjs') {
    files.push(
      join(dir, 'app/layout.tsx'),
      join(dir, 'components/ShellHost.tsx'),
      join(dir, 'lib/shell-config.ts'),
      join(dir, 'app/globals.scss'),
    );
  } else {
    files.push(
      join(dir, 'src/App.tsx'),
      join(dir, 'src/shell-config.ts'),
      join(dir, 'src/ShellHost.tsx'),
      join(dir, 'src/main.tsx'),
      join(dir, 'src/styles/main.scss'),
    );
  }
  return files.map((f) => readFileSync(f, 'utf8')).join('\n');
}

describe('starter templates use Application Shell', () => {
  for (const id of TEMPLATES) {
    it(`template ${id} uses public shell API`, () => {
      const content = readTemplateFiles(id);
      for (const req of REQUIRED) {
        assert.match(content, new RegExp(req.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
      for (const bad of FORBIDDEN) {
        assert.equal(content.includes(bad), false, `forbidden "${bad}" in ${id}`);
      }
    });
  }

  it('no template retains layout/AppLayout.tsx', () => {
    for (const id of ['react-vite', 'react-bootstrap', 'electron']) {
      const app = readFileSync(join(ROOT, 'templates', id, 'src/App.tsx'), 'utf8');
      assert.doesNotMatch(app, /AppLayout/);
      assert.match(app, /ShellHost/);
    }
  });
});
