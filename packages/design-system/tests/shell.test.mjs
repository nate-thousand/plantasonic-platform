import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;

describe('application shell package', () => {
  it('exports shell entry from package.json', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.ok(pkg.exports['./shell']);
    assert.equal(pkg.exports['./shell'].default, './src/shell/index.ts');
  });

  it('shell source files exist in src/shell', () => {
    for (const file of [
      'index.ts',
      'bind-shell.ts',
      'routes.ts',
      'types.ts',
      'internal/navigation.ts',
    ]) {
      assert.ok(existsSync(join(ROOT, 'src/shell', file)), file);
    }
  });

  it('renderApplicationShell is the public entry (no renderAppShell export)', () => {
    const index = readFileSync(join(ROOT, 'src/shell/index.ts'), 'utf8');
    assert.match(index, /export function renderApplicationShell/);
    assert.doesNotMatch(index, /export function renderAppShell/);
  });

  it('internal navigation is not re-exported from public index', () => {
    const index = readFileSync(join(ROOT, 'src/shell/index.ts'), 'utf8');
    assert.doesNotMatch(index, /internal\/navigation/);
  });
});

describe('mergeRoutesIntoNavigation', () => {
  it('wires route paths to nav items and creates page commands', async () => {
    const { mergeRoutesIntoNavigation } = await import('../src/shell/routes.ts');
    const { navigation, routeCommands } = mergeRoutesIntoNavigation(
      {
        title: 'Test',
        groups: [{ id: 'main', label: 'Main', items: [{ id: 'stage', label: 'Stage' }] }],
      },
      [{ id: 'stage', path: '/stage', label: 'Stage' }],
    );
    assert.equal(navigation.groups[0].items[0].href, '/stage');
    assert.equal(routeCommands.length, 1);
    assert.equal(routeCommands[0].id, 'route:stage');
    assert.equal(routeCommands[0].group, 'Pages');
  });
});

describe('command registry', () => {
  it('executes registered command actions', async () => {
    const { CommandRegistry } = await import('../src/shell/command-registry.ts');
    const registry = new CommandRegistry();
    let ran = false;
    registry.register({ id: 'test', label: 'Test', group: 'Test', action: () => { ran = true; } });
    assert.equal(registry.execute('test'), true);
    assert.equal(ran, true);
    assert.equal(registry.execute('missing'), false);
  });
});

describe('starter templates use public shell API', () => {
  for (const id of ['react-vite', 'react-bootstrap', 'nextjs', 'electron']) {
    it(`template ${id} imports plantasonic-design-system/shell`, () => {
      const dir = join(ROOT, 'templates', id);
      let content = '';
      if (id === 'nextjs') {
        content = [
          join(dir, 'components/ShellHost.tsx'),
          join(dir, 'lib/shell-config.ts'),
        ].map((f) => readFileSync(f, 'utf8')).join('\n');
      } else {
        content = [
          join(dir, 'src/App.tsx'),
          join(dir, 'src/shell-config.ts'),
          join(dir, 'src/ShellHost.tsx'),
        ].map((f) => readFileSync(f, 'utf8')).join('\n');
      }
      assert.match(content, /plantasonic-design-system\/shell/);
      assert.match(content, /renderApplicationShell/);
      assert.match(content, /bindApplicationShell/);
      assert.doesNotMatch(content, /renderAppShell/);
      assert.doesNotMatch(content, /AppLayout/);
    });
  }
});
