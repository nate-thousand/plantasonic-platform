/**
 * Plantasonic Design System — Motion system (Layer 3).
 *
 * Framework-agnostic motion primitives driven entirely by motion tokens
 * (`--ds-motion-duration-*`, `--ds-motion-easing-*`). Animations use the
 * Web Animations API by default with zero runtime dependencies; an optional
 * engine adapter (e.g. GSAP) can be injected via `setMotionEngine`.
 *
 * Every preset respects the user's reduced-motion preference: when reduced
 * motion is active, animations resolve instantly to their final state.
 */

export type MotionDurationToken = 'micro' | 'fast' | 'base' | 'slow' | 'slower';

export type MotionEasingToken = 'standard' | 'emphasized' | 'entrance' | 'exit' | 'spring';

export type MotionPreset =
  | 'fade'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'expand'
  | 'collapse'
  | 'drawerIn'
  | 'drawerOut'
  | 'modalIn'
  | 'modalOut'
  | 'toastIn'
  | 'toastOut'
  | 'press'
  | 'focusPulse'
  | 'loadingPulse';

export type MotionPresetSpec = {
  keyframes: Keyframe[];
  duration: MotionDurationToken;
  easing: MotionEasingToken;
  fill?: FillMode;
  iterations?: number;
};

export type MotionOptions = {
  /** Override the preset duration token. */
  duration?: MotionDurationToken;
  /** Override the preset easing token. */
  easing?: MotionEasingToken;
  /** Delay in milliseconds before the animation starts. */
  delay?: number;
  /** Run callback when the animation finishes (or immediately when reduced). */
  onFinish?: () => void;
};

/** Optional engine adapter signature (e.g. a thin GSAP wrapper). */
export type MotionEngine = (
  el: Element,
  spec: MotionPresetSpec,
  resolved: { durationMs: number; easing: string },
  options: MotionOptions,
) => void;

/** Token dot-path → CSS custom property for durations. */
export const MOTION_DURATION_VAR: Record<MotionDurationToken, string> = {
  micro: '--ds-motion-duration-micro',
  fast: '--ds-motion-duration-fast',
  base: '--ds-motion-duration-base',
  slow: '--ds-motion-duration-slow',
  slower: '--ds-motion-duration-slower',
};

/** Token dot-path → CSS custom property for easings. */
export const MOTION_EASING_VAR: Record<MotionEasingToken, string> = {
  standard: '--ds-motion-easing-standard',
  emphasized: '--ds-motion-easing-emphasized',
  entrance: '--ds-motion-easing-entrance',
  exit: '--ds-motion-easing-exit',
  spring: '--ds-motion-easing-spring',
};

/**
 * Fallbacks mirroring tokens/foundation.tokens.json, used only when CSS custom
 * properties cannot be read (SSR, detached nodes, no `getComputedStyle`).
 */
const DURATION_FALLBACK_MS: Record<MotionDurationToken, number> = {
  micro: 80,
  fast: 150,
  base: 250,
  slow: 400,
  slower: 600,
};

const EASING_FALLBACK: Record<MotionEasingToken, string> = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  entrance: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const MOTION_PRESETS: Record<MotionPreset, MotionPresetSpec> = {
  fade: {
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    duration: 'base',
    easing: 'entrance',
    fill: 'both',
  },
  fadeOut: {
    keyframes: [{ opacity: 1 }, { opacity: 0 }],
    duration: 'fast',
    easing: 'exit',
    fill: 'both',
  },
  slideUp: {
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration: 'base',
    easing: 'emphasized',
    fill: 'both',
  },
  slideDown: {
    keyframes: [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration: 'base',
    easing: 'emphasized',
    fill: 'both',
  },
  slideLeft: {
    keyframes: [
      { opacity: 0, transform: 'translateX(8px)' },
      { opacity: 1, transform: 'translateX(0)' },
    ],
    duration: 'base',
    easing: 'emphasized',
    fill: 'both',
  },
  slideRight: {
    keyframes: [
      { opacity: 0, transform: 'translateX(-8px)' },
      { opacity: 1, transform: 'translateX(0)' },
    ],
    duration: 'base',
    easing: 'emphasized',
    fill: 'both',
  },
  scaleIn: {
    keyframes: [
      { opacity: 0, transform: 'scale(0.96)' },
      { opacity: 1, transform: 'scale(1)' },
    ],
    duration: 'fast',
    easing: 'spring',
    fill: 'both',
  },
  scaleOut: {
    keyframes: [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.96)' },
    ],
    duration: 'fast',
    easing: 'exit',
    fill: 'both',
  },
  expand: {
    keyframes: [
      { opacity: 0, transform: 'scaleY(0.85)', transformOrigin: 'top' },
      { opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' },
    ],
    duration: 'base',
    easing: 'standard',
    fill: 'both',
  },
  collapse: {
    keyframes: [
      { opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' },
      { opacity: 0, transform: 'scaleY(0.85)', transformOrigin: 'top' },
    ],
    duration: 'fast',
    easing: 'exit',
    fill: 'both',
  },
  drawerIn: {
    keyframes: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
    duration: 'slow',
    easing: 'emphasized',
    fill: 'both',
  },
  drawerOut: {
    keyframes: [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
    duration: 'base',
    easing: 'exit',
    fill: 'both',
  },
  modalIn: {
    keyframes: [
      { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ],
    duration: 'base',
    easing: 'emphasized',
    fill: 'both',
  },
  modalOut: {
    keyframes: [
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
    ],
    duration: 'fast',
    easing: 'exit',
    fill: 'both',
  },
  toastIn: {
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    duration: 'base',
    easing: 'spring',
    fill: 'both',
  },
  toastOut: {
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(12px)' },
    ],
    duration: 'fast',
    easing: 'exit',
    fill: 'both',
  },
  press: {
    keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }],
    duration: 'micro',
    easing: 'standard',
  },
  focusPulse: {
    keyframes: [
      { boxShadow: '0 0 0 0 var(--ds-color-border-focus)' },
      { boxShadow: '0 0 0 3px var(--ds-color-overlay-focus-outline)' },
    ],
    duration: 'fast',
    easing: 'standard',
  },
  loadingPulse: {
    keyframes: [{ opacity: 0.45 }, { opacity: 1 }, { opacity: 0.45 }],
    duration: 'slower',
    easing: 'standard',
    iterations: Infinity,
  },
};

let injectedEngine: MotionEngine | null = null;

/**
 * Inject an optional motion engine adapter (e.g. GSAP). When set, `animate`
 * delegates to it instead of the Web Animations API. Pass `null` to restore
 * the default engine.
 */
export function setMotionEngine(engine: MotionEngine | null): void {
  injectedEngine = engine;
}

/** True when the user (or the app) has requested reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined') {
    if (document.documentElement.hasAttribute('data-ds-reduced-motion')) return true;
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

function readCssVar(el: Element | null, name: string): string {
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return '';
  const target = el ?? (typeof document !== 'undefined' ? document.documentElement : null);
  if (!target) return '';
  return window.getComputedStyle(target as Element).getPropertyValue(name).trim();
}

/** Resolve a duration token to milliseconds, preferring the live CSS variable. */
export function resolveDurationMs(token: MotionDurationToken, el: Element | null = null): number {
  const raw = readCssVar(el, MOTION_DURATION_VAR[token]);
  const match = raw.match(/([\d.]+)\s*(ms|s)?/);
  if (match) {
    const value = Number.parseFloat(match[1]);
    if (!Number.isNaN(value)) return match[2] === 's' ? value * 1000 : value;
  }
  return DURATION_FALLBACK_MS[token];
}

/** Resolve an easing token to a CSS easing string, preferring the live CSS variable. */
export function resolveEasing(token: MotionEasingToken, el: Element | null = null): string {
  return readCssVar(el, MOTION_EASING_VAR[token]) || EASING_FALLBACK[token];
}

/**
 * Build a CSS `transition` shorthand from tokens — for inline styles or
 * declarative usage. Example: `transition('opacity, transform', 'base', 'standard')`.
 */
export function transition(
  properties: string,
  duration: MotionDurationToken = 'base',
  easing: MotionEasingToken = 'standard',
): string {
  return properties
    .split(',')
    .map((p) => `${p.trim()} var(${MOTION_DURATION_VAR[duration]}) var(${MOTION_EASING_VAR[easing]})`)
    .join(', ');
}

/**
 * Animate an element with a motion preset. Returns the Web Animations
 * `Animation` instance, or `null` when motion is reduced / unavailable.
 */
export function animate(
  el: Element | null | undefined,
  preset: MotionPreset,
  options: MotionOptions = {},
): Animation | null {
  if (!el) return null;
  const spec = MOTION_PRESETS[preset];
  const durationToken = options.duration ?? spec.duration;
  const easingToken = options.easing ?? spec.easing;
  const durationMs = resolveDurationMs(durationToken, el);
  const easing = resolveEasing(easingToken, el);

  if (prefersReducedMotion()) {
    const finalFrame = spec.keyframes[spec.keyframes.length - 1];
    if (finalFrame && el instanceof HTMLElement) {
      for (const [key, value] of Object.entries(finalFrame)) {
        if (key === 'transformOrigin' || key === 'transform' || key === 'opacity' || key === 'boxShadow') {
          (el.style as unknown as Record<string, string>)[key] = String(value);
        }
      }
    }
    options.onFinish?.();
    return null;
  }

  if (injectedEngine) {
    injectedEngine(el, spec, { durationMs, easing }, options);
    options.onFinish?.();
    return null;
  }

  if (typeof (el as HTMLElement).animate !== 'function') {
    options.onFinish?.();
    return null;
  }

  const animation = (el as HTMLElement).animate(spec.keyframes, {
    duration: durationMs,
    easing,
    delay: options.delay ?? 0,
    fill: spec.fill ?? 'none',
    iterations: spec.iterations ?? 1,
  });

  if (options.onFinish) {
    animation.addEventListener('finish', () => options.onFinish?.(), { once: true });
  }

  return animation;
}

/** All available preset names — useful for documentation and tests. */
export const MOTION_PRESET_NAMES = Object.keys(MOTION_PRESETS) as MotionPreset[];
