import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

describe('layout primitives — package wiring', () => {
  it('exports ./primitives from package.json', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.ok(pkg.exports['./primitives']);
    assert.equal(pkg.exports['./primitives'].default, './src/primitives/index.ts');
    assert.ok(pkg.exports['./scss/primitives.scss']);
  });
});

describe('layout primitives — render output', () => {
  it('renders all 17 primitives as strings driven by spacing tokens', async () => {
    const p = await import('../src/primitives/index.ts');
    assert.equal(p.PRIMITIVE_NAMES.length, 17);

    const stack = p.stack({ gap: '3', content: '<i></i>' });
    assert.match(stack, /class="ds-l-stack"/);
    assert.match(stack, /--ds-l-gap: var\(--ds-space-3\)/);

    const inline = p.inline({ justify: 'between' });
    assert.match(inline, /--ds-l-justify: space-between/);

    const grid = p.grid({ columns: 3 });
    assert.match(grid, /repeat\(3, minmax\(0, 1fr\)\)/);

    const sidebar = p.sidebar({ sidebarContent: 'a', mainContent: 'b', label: 'Nav' });
    assert.match(sidebar, /ds-l-sidebar__side/);
    assert.match(sidebar, /ds-l-sidebar__main/);
    assert.match(sidebar, /aria-label="Nav"/);
  });

  it('region exposes a landmark role and label', async () => {
    const { region } = await import('../src/primitives/index.ts');
    const html = region({ role: 'complementary', label: 'Aside', content: 'x' });
    assert.match(html, /role="complementary"/);
    assert.match(html, /aria-label="Aside"/);
  });

  it('spacer is decorative (aria-hidden) and supports fixed/inline axes', async () => {
    const { spacer } = await import('../src/primitives/index.ts');
    assert.match(spacer(), /aria-hidden="true"/);
    assert.match(spacer({ size: '4' }), /ds-l-spacer--fixed/);
    assert.match(spacer({ size: '4', axis: 'inline' }), /ds-l-spacer--inline/);
  });

  it('emits no hardcoded hex colors', async () => {
    const p = await import('../src/primitives/index.ts');
    const samples = [
      p.stack({ content: 'x' }),
      p.surface({ level: 'raised', content: 'x' }),
      p.cover({ mainContent: 'x' }),
      p.split({ startContent: 'a', endContent: 'b' }),
    ].join('');
    assert.doesNotMatch(samples, HEX);
  });
});

describe('layout primitives — stylesheet', () => {
  it('scss/primitives.scss is token-driven and hex-free', () => {
    const scss = readFileSync(join(ROOT, 'scss/primitives.scss'), 'utf8');
    assert.match(scss, /var\(--ds-space-/);
    assert.doesNotMatch(scss, HEX);
  });
});
