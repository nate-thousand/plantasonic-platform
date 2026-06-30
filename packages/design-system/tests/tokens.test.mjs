import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateTokens, loadResolvedThemes, CSS_VAR_NAME } from '../scripts/lib/tokens.mjs';

describe('token validation', () => {
  it('passes validateTokens()', () => {
    const result = validateTokens();
    assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  });

  it('resolves dark and light themes', () => {
    const { dark, light } = loadResolvedThemes();
    assert.ok(dark.resolved.size > 0);
    assert.ok(light.resolved.size > 0);
    assert.equal(dark.unresolved.length, 0);
    assert.equal(light.unresolved.length, 0);
  });

  it('maps every CSS variable to a resolved dark token', () => {
    const { dark } = loadResolvedThemes();
    for (const path of Object.keys(CSS_VAR_NAME)) {
      assert.ok(dark.resolved.has(path), `missing dark token: ${path}`);
    }
  });
});
