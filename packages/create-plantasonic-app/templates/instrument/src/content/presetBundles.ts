import type { PresetBundle } from '@plantasonic/platform-types';

/** Starter bundle — customize or add more in this file */
export const {{APP_CONST}}_STARTER_BUNDLE: PresetBundle = {
  id: 'starter',
  name: 'Starter',
  description: 'Default {{APP_NAME}} session — edit presetBundles.ts to customize.',
  category: 'flora',
  tags: ['{{APP_SLUG}}', 'starter'],
  sound: { presetId: 'seed' },
  visual: { presetId: 'seed' },
  audioReactive: {
    enabled: true,
    sensitivity: 0.6,
    smoothing: 0.7,
    mappings: [
      { feature: 'bass', target: 'density', amount: 0.35, enabled: true },
      { feature: 'mids', target: 'motion', amount: 0.3, enabled: true },
      { feature: 'highs', target: 'brightness', amount: 0.25, enabled: true },
      { feature: 'amplitude', target: 'scale', amount: 0.2, enabled: true },
      { feature: 'transient', target: 'glitch', amount: 0.08, enabled: true },
    ],
  },
  workspace: { activeInspectorPanel: 'sound-parameters' },
  ui: {
    audioReactiveEnabled: true,
    tempo: {{DEFAULT_TEMPO}},
    soundParameters: { growth: 0.4, bloom: 0.5, roots: 0.5, mold: 0.2, bacteria: 0.25 },
    visualParameters: { density: 0.6, speed: 0.45, glitchAmount: 0.05, trailAmount: 0.35 },
  },
};

/** Additional preset bundles — add creative sessions here */
export const {{APP_CONST}}_PRESET_BUNDLES: PresetBundle[] = [];
