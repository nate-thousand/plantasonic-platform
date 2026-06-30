import type { VisualTarget } from '@plantasonic/platform-types';

/**
 * Maps platform VisualTarget vocabulary to ascii-visual-engine control names.
 * Lives in the platform layer only — Visual Engine is not modified.
 */
export const VISUAL_TARGET_CONTROL_MAP: Record<VisualTarget, string> = {
  density: 'density',
  motion: 'speed',
  brightness: 'strength',
  scale: 'sourceContrast',
  glitch: 'glitchAmount',
};

/** Default base values for visual controls when bridge connects */
export const VISUAL_TARGET_DEFAULTS: Record<VisualTarget, number> = {
  density: 0.65,
  motion: 0.5,
  brightness: 0.55,
  scale: 0.5,
  glitch: 0.1,
};

export function resolveVisualControlName(target: VisualTarget): string {
  return VISUAL_TARGET_CONTROL_MAP[target];
}
