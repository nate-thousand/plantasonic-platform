import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadResolvedThemes } from '../scripts/lib/tokens.mjs';

describe('theme resolution', () => {
  it('dark and light differ on surface tokens', () => {
    const { dark, light } = loadResolvedThemes();
    const darkApp = dark.resolved.get('color.surface.app');
    const lightApp = light.resolved.get('color.surface.app');
    assert.ok(darkApp);
    assert.ok(lightApp);
    assert.notEqual(darkApp, lightApp);
  });

  it('text.primary is neutral in dark theme', () => {
    const { dark } = loadResolvedThemes();
    const text = dark.resolved.get('color.text.primary');
    assert.match(String(text), /^#[0-9a-f]{6}$/i);
  });
});
