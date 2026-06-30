import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadResolvedThemes } from '../scripts/lib/tokens.mjs';

function hexToRgb(hex) {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function luminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(a, b) {
  const l1 = luminance(hexToRgb(a));
  const l2 = luminance(hexToRgb(b));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('accessibility — contrast', () => {
  it('dark theme body text meets WCAG AA on app surface', () => {
    const { dark } = loadResolvedThemes();
    const text = dark.resolved.get('color.text.primary');
    const bg = dark.resolved.get('color.surface.app');
    assert.ok(text?.startsWith('#'));
    assert.ok(bg?.startsWith('#'));
    assert.ok(contrast(text, bg) >= 4.5, `contrast ${contrast(text, bg)}`);
  });

  it('light theme body text meets WCAG AA on app surface', () => {
    const { light } = loadResolvedThemes();
    const text = light.resolved.get('color.text.primary');
    const bg = light.resolved.get('color.surface.app');
    assert.ok(contrast(text, bg) >= 4.5);
  });
});
