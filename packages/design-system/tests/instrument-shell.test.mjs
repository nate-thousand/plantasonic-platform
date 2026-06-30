import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

describe('instrument shell — package wiring', () => {
  it('exports ./instrument, ./app, and ./scss/instrument.scss', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    assert.equal(pkg.exports['./instrument'].default, './src/instrument/index.ts');
    assert.equal(pkg.exports['./app'].default, './src/app/index.ts');
    assert.ok(pkg.exports['./scss/instrument.scss']);
  });
});

describe('instrument shell — variant is additive', () => {
  it('renderApplicationShell still drives the standard navigation path', () => {
    const index = readFileSync(join(ROOT, 'src/shell/index.ts'), 'utf8');
    assert.match(index, /export function renderApplicationShell/);
    assert.match(index, /renderNavigationFrame/);
  });

  it('branches to the instrument shell only when variant is instrument', () => {
    const index = readFileSync(join(ROOT, 'src/shell/index.ts'), 'utf8');
    assert.match(index, /merged\.variant === 'instrument'/);
    assert.match(index, /renderInstrumentShell/);
  });
});

describe('instrument shell — render output', () => {
  it('renders the canvas-first frame with application semantics', async () => {
    const { renderInstrumentShell } = await import('../src/instrument/shell.ts');
    const html = renderInstrumentShell({ title: 'My Instrument' });
    assert.match(html, /class="ps-instrument ps-instrument--edit"/);
    assert.match(html, /data-ps-instrument/);
    assert.match(html, /role="application"/);
    assert.match(html, /data-ps-canvas-mount/);
  });

  it('composes provided regions and tags them with data-ps-region', async () => {
    const { renderInstrumentShell } = await import('../src/instrument/shell.ts');
    const html = renderInstrumentShell({
      instrument: {
        stage: '<div id="viz"></div>',
        transport: '<div class="ps-transport"></div>',
        status: 'FPS 60',
        rail: 'tools',
        aside: 'props',
        hud: 'overlay',
      },
    });
    assert.match(html, /data-ps-region="stage"/);
    assert.match(html, /data-ps-region="transport"/);
    assert.match(html, /data-ps-region="status"/);
    assert.match(html, /data-ps-region="sidebar"/);
    assert.match(html, /data-ps-region="inspector"/);
    assert.match(html, /data-ps-region="hud"/);
    assert.match(html, /id="viz"/);
  });

  it('applies the requested display mode and presenter branding', async () => {
    const { renderInstrumentShell } = await import('../src/instrument/shell.ts');
    const html = renderInstrumentShell({ mode: 'presentation', instrument: { brand: '<b>Brand</b>' } });
    assert.match(html, /ps-instrument--presentation/);
    assert.match(html, /ps-presenter-brand/);
  });

  it('can hide the transport region', async () => {
    const { renderInstrumentShell } = await import('../src/instrument/shell.ts');
    const html = renderInstrumentShell({ instrument: { transport: false } });
    assert.doesNotMatch(html, /data-ps-region="transport"/);
  });
});

describe('instrument shell — tokens, a11y, reduced motion (scss)', () => {
  const scss = readFileSync(join(ROOT, 'scss/instrument.scss'), 'utf8');

  it('uses design tokens, never raw hex', () => {
    assert.doesNotMatch(scss, HEX);
    assert.match(scss, /var\(--ds-/);
  });

  it('supports safe areas and touch targets', () => {
    assert.match(scss, /env\(safe-area-inset/);
    assert.match(scss, /--ps-touch-target-large/);
  });

  it('honors reduced motion both ways', () => {
    assert.match(scss, /prefers-reduced-motion: reduce/);
    assert.match(scss, /data-ds-reduced-motion/);
  });
});
