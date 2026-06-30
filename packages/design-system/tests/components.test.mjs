import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

describe('component library — package wiring', () => {
  it('exports ./components from package.json', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.ok(pkg.exports['./components']);
    assert.equal(pkg.exports['./components'].default, './src/components/index.ts');
    assert.ok(pkg.exports['./scss/components.scss']);
  });
});

describe('component library — render output', () => {
  it('exposes 12 components in slice 1', async () => {
    const c = await import('../src/components/index.ts');
    assert.equal(c.COMPONENT_NAMES.length, 12);
  });

  it('button supports variants, sizes, and loading state', async () => {
    const { button } = await import('../src/components/index.ts');
    const primary = button({ label: 'Play', variant: 'primary' });
    assert.match(primary, /class="btn ds-c-btn ds-c-btn--primary"/);
    assert.match(primary, /type="button"/);
    assert.match(primary, /<span class="ds-c-btn__label">Play<\/span>/);

    const loading = button({ label: 'Save', loading: true });
    assert.match(loading, /aria-busy="true"/);
    assert.match(loading, / disabled/);
    assert.match(loading, /ds-c-btn__spinner/);
  });

  it('escapes user-provided text', async () => {
    const { button } = await import('../src/components/index.ts');
    const html = button({ label: '<script>x</script>' });
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;/);
  });

  it('iconButton requires an accessible name', async () => {
    const { iconButton } = await import('../src/components/index.ts');
    const html = iconButton({ icon: '▶', ariaLabel: 'Play' });
    assert.match(html, /aria-label="Play"/);
    assert.match(html, /ds-c-icon-btn/);
  });

  it('toolbar and toolbarGroup carry ARIA roles', async () => {
    const { toolbar, toolbarGroup } = await import('../src/components/index.ts');
    assert.match(toolbar({ label: 'Transport', content: '' }), /role="toolbar"/);
    assert.match(toolbar({ label: 'Transport', content: '' }), /aria-label="Transport"/);
    assert.match(toolbarGroup({ label: 'View' }), /role="group"/);
  });

  it('panel reuses ps-panel structure and is labelled', async () => {
    const { panel } = await import('../src/components/index.ts');
    const html = panel({ title: 'Mixer', collapsible: true });
    assert.match(html, /ps-panel/);
    assert.match(html, /aria-label="Mixer"/);
    assert.match(html, /aria-expanded="true"/);
  });

  it('badge and statusIndicator map to semantic tokens via classes', async () => {
    const { badge, statusIndicator } = await import('../src/components/index.ts');
    assert.match(badge({ label: 'New', variant: 'success' }), /ds-c-badge--success/);
    const status = statusIndicator({ status: 'error', label: 'Failed' });
    assert.match(status, /role="status"/);
    assert.match(status, /ds-c-status--error/);
  });

  it('surface is re-exported from the layout primitives (no duplication)', async () => {
    const c = await import('../src/components/index.ts');
    const p = await import('../src/primitives/index.ts');
    assert.equal(c.surface, p.surface);
  });

  it('emits no hardcoded hex colors', async () => {
    const c = await import('../src/components/index.ts');
    const samples = [
      c.button({ label: 'A' }),
      c.card({ title: 'B', content: 'x' }),
      c.statusIndicator({ status: 'online', label: 'C' }),
      c.badge({ label: 'D', variant: 'accent' }),
    ].join('');
    assert.doesNotMatch(samples, HEX);
  });
});

describe('component library — stylesheet', () => {
  it('scss/components.scss is token-driven and hex-free', () => {
    const scss = readFileSync(join(ROOT, 'scss/components.scss'), 'utf8');
    assert.match(scss, /var\(--ds-color-primary\)/);
    assert.match(scss, /var\(--ds-motion-duration-fast\)/);
    assert.doesNotMatch(scss, HEX);
  });
});
