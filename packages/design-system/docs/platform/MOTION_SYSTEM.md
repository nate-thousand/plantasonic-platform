# Motion System (Layer 3)

A single, consistent, accessible motion language driven entirely by motion tokens. Animations use the Web Animations API by default (zero runtime dependencies) and can optionally delegate to an injected engine such as GSAP.

## Tokens

Added additively to `tokens/foundation.tokens.json` (existing `transition.*` / `ease.*` values are unchanged):

| Token | CSS variable | Value |
| --- | --- | --- |
| `transition.instant` | `--ds-transition-instant` | `80ms` |
| `transition.slower` | `--ds-transition-slower` | `600ms` |
| `ease.standard` | `--ds-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease.emphasized` | `--ds-ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| `ease.spring` | `--ds-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `motion.duration.{micro,fast,base,slow,slower}` | `--ds-motion-duration-*` | semantic durations |
| `motion.easing.{standard,emphasized,entrance,exit,spring}` | `--ds-motion-easing-*` | semantic easings |

The `motion.*` group aliases the foundation primitives, giving components stable semantic roles.

## Public API

```typescript
import {
  animate, transition, prefersReducedMotion,
  setMotionEngine,
  MOTION_PRESETS, MOTION_PRESET_NAMES,
  MOTION_DURATION_VAR, MOTION_EASING_VAR,
  resolveDurationMs, resolveEasing,
} from 'plantasonic-design-system/motion';
```

Declarative utilities:

```scss
@import 'plantasonic-design-system/scss/motion';
```

### Imperative animation

```typescript
animate(element, 'modalIn');
animate(panel, 'expand', { duration: 'slow', onFinish: () => focusFirst(panel) });
```

`animate(el, preset, options)` returns the Web Animations `Animation`, or `null` when motion is reduced / unavailable. When reduced motion is active it jumps the element to the preset's final frame and invokes `onFinish` immediately.

### Presets (19)

`fade`, `fadeOut`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`, `scaleIn`, `scaleOut`, `expand`, `collapse`, `drawerIn`, `drawerOut`, `modalIn`, `modalOut`, `toastIn`, `toastOut`, `press`, `focusPulse`, `loadingPulse`.

### CSS transition helper

```typescript
element.style.transition = transition('opacity, transform', 'base', 'standard');
```

### Declarative classes

`.ds-animate--fade-in`, `--slide-up`, `--scale-in`, `--expand`, `--collapse`, `--pulse`, plus duration (`.ds-animate--micro|fast|base|slow|slower`) and easing (`.ds-ease--standard|emphasized|entrance|exit|spring`) modifiers, and a `.ds-transition` helper.

## Reduced motion

Three layers of protection:

1. `prefersReducedMotion()` checks both `prefers-reduced-motion: reduce` and the `data-ds-reduced-motion` attribute.
2. `animate()` resolves instantly to the final state when motion is reduced.
3. `scss/motion.scss` neutralizes animations/transitions under `@media (prefers-reduced-motion: reduce)` and `html[data-ds-reduced-motion]`.

## Optional GSAP adapter

```typescript
import { setMotionEngine } from 'plantasonic-design-system/motion';
import gsap from 'gsap';

setMotionEngine((el, spec, { durationMs, easing }) => {
  gsap.fromTo(el, spec.keyframes[0], { ...spec.keyframes.at(-1), duration: durationMs / 1000, ease: 'power2.out' });
});
```

No GSAP dependency is added to the package; the adapter is entirely opt-in. Pass `null` to restore the default Web Animations engine.

## Constraints

- Durations/easings are resolved from `--ds-motion-*` CSS variables at runtime, with token-mirrored fallbacks for SSR / detached nodes.
- No hardcoded `ms`/easing in application code — use presets, tokens, or `transition()`.
