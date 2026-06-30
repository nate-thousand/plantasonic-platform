import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const ROOT = new URL('..', import.meta.url).pathname;

describe('motion system — tokens', () => {
  it('adds motion duration + easing tokens additively (existing tokens preserved)', () => {
    const foundation = JSON.parse(readFileSync(join(ROOT, 'tokens/foundation.tokens.json'), 'utf8'));
    // Foundation duration scale (transition aliases duration.*; base kept at 250ms for motion SDK)
    assert.equal(foundation.transition.fast.$value, '{duration.fast}');
    assert.equal(foundation.transition.base.$value, '250ms');
    assert.equal(foundation.transition.slow.$value, '{duration.slow}');
    // New additive tokens
    assert.ok(foundation.transition.instant);
    assert.ok(foundation.transition.slower);
    assert.ok(foundation.ease.spring);
    assert.ok(foundation.motion.duration.base);
    assert.ok(foundation.motion.easing.standard);
  });

  it('generates --ds-motion-* CSS custom properties', () => {
    const css = readFileSync(join(ROOT, 'css/variables.css'), 'utf8');
    assert.match(css, /--ds-motion-duration-base: 250ms/);
    assert.match(css, /--ds-motion-easing-spring: cubic-bezier/);
  });
});

describe('motion system — runtime API', () => {
  it('exposes 19 presets with valid keyframes', async () => {
    const m = await import('../src/motion/index.ts');
    assert.equal(m.MOTION_PRESET_NAMES.length, 19);
    for (const name of m.MOTION_PRESET_NAMES) {
      const spec = m.MOTION_PRESETS[name];
      assert.ok(Array.isArray(spec.keyframes) && spec.keyframes.length >= 2, name);
      assert.ok(m.MOTION_DURATION_VAR[spec.duration], `duration token for ${name}`);
      assert.ok(m.MOTION_EASING_VAR[spec.easing], `easing token for ${name}`);
    }
  });

  it('token var maps reference --ds-motion-* properties', async () => {
    const m = await import('../src/motion/index.ts');
    for (const v of Object.values(m.MOTION_DURATION_VAR)) assert.match(v, /^--ds-motion-duration-/);
    for (const v of Object.values(m.MOTION_EASING_VAR)) assert.match(v, /^--ds-motion-easing-/);
  });

  it('transition() composes token-based CSS transitions', async () => {
    const { transition } = await import('../src/motion/index.ts');
    const t = transition('opacity, transform', 'base', 'standard');
    assert.match(t, /opacity var\(--ds-motion-duration-base\) var\(--ds-motion-easing-standard\)/);
    assert.match(t, /transform var\(--ds-motion-duration-base\) var\(--ds-motion-easing-standard\)/);
  });

  it('falls back to token values without a DOM', async () => {
    const { resolveDurationMs, resolveEasing } = await import('../src/motion/index.ts');
    assert.equal(resolveDurationMs('base'), 250);
    assert.equal(resolveDurationMs('micro'), 80);
    assert.match(resolveEasing('spring'), /cubic-bezier/);
  });

  it('prefersReducedMotion is false in a non-DOM environment', async () => {
    const { prefersReducedMotion } = await import('../src/motion/index.ts');
    assert.equal(prefersReducedMotion(), false);
  });

  it('animate() is a safe no-op without an element', async () => {
    const { animate } = await import('../src/motion/index.ts');
    assert.equal(animate(null, 'fade'), null);
  });

  it('supports injecting an alternate engine adapter', async () => {
    const { setMotionEngine } = await import('../src/motion/index.ts');
    assert.equal(typeof setMotionEngine, 'function');
    setMotionEngine(null);
  });
});

describe('motion system — stylesheet', () => {
  it('scss/motion.scss provides reduced-motion handling', () => {
    const scss = readFileSync(join(ROOT, 'scss/motion.scss'), 'utf8');
    assert.match(scss, /prefers-reduced-motion: reduce/);
    assert.match(scss, /data-ds-reduced-motion/);
    assert.match(scss, /var\(--ds-motion-duration-base\)/);
  });
});
