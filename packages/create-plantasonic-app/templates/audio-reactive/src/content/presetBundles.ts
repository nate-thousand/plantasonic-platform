import type { PresetBundle } from '@plantasonic/platform-types';

/** Pulse — bass-driven density, transient hits drive glitch */
export const {{APP_CONST}}_PULSE_BUNDLE: PresetBundle = {
  id: 'pulse',
  name: 'Pulse',
  description: 'Kick-driven density pulses — strong bass→density and transient→glitch mapping.',
  category: 'reactive',
  tags: ['{{APP_SLUG}}', 'pulse', 'bass'],
  sound: { presetId: 'root' },
  visual: { presetId: 'root' },
  audioReactive: {
    enabled: true,
    sensitivity: 0.85,
    smoothing: 0.55,
    mappings: [
      { feature: 'bass', target: 'density', amount: 0.65, enabled: true },
      { feature: 'mids', target: 'motion', amount: 0.35, enabled: true },
      { feature: 'highs', target: 'brightness', amount: 0.2, enabled: true },
      { feature: 'amplitude', target: 'scale', amount: 0.45, enabled: true },
      { feature: 'transient', target: 'glitch', amount: 0.4, enabled: true },
    ],
  },
  workspace: { activeInspectorPanel: 'audio-reactive' },
  ui: {
    audioReactiveEnabled: true,
    tempo: {{DEFAULT_TEMPO}},
    soundParameters: { growth: 0.45, bloom: 0.35, roots: 0.7, mold: 0.2, bacteria: 0.3 },
    visualParameters: { density: 0.8, speed: 0.5, glitchAmount: 0.15, trailAmount: 0.3 },
    bridgeSensitivity: 0.85,
    bridgeSmoothing: 0.55,
  },
};

/** Drift — mids and amplitude drive slow organic motion */
export const {{APP_CONST}}_DRIFT_BUNDLE: PresetBundle = {
  id: 'drift',
  name: 'Drift',
  description: 'Ambient drift — mids→motion and amplitude→scale with gentle smoothing.',
  category: 'reactive',
  tags: ['{{APP_SLUG}}', 'drift', 'ambient'],
  sound: { presetId: 'bloom' },
  visual: { presetId: 'bloom' },
  audioReactive: {
    enabled: true,
    sensitivity: 0.55,
    smoothing: 0.85,
    mappings: [
      { feature: 'bass', target: 'density', amount: 0.3, enabled: true },
      { feature: 'mids', target: 'motion', amount: 0.6, enabled: true },
      { feature: 'highs', target: 'brightness', amount: 0.45, enabled: true },
      { feature: 'amplitude', target: 'scale', amount: 0.55, enabled: true },
      { feature: 'transient', target: 'glitch', amount: 0.05, enabled: true },
    ],
  },
  workspace: { activeInspectorPanel: 'audio-reactive' },
  ui: {
    audioReactiveEnabled: true,
    tempo: 68,
    soundParameters: { growth: 0.55, bloom: 0.65, roots: 0.35, mold: 0.15, bacteria: 0.2 },
    visualParameters: { density: 0.5, speed: 0.35, glitchAmount: 0.02, trailAmount: 0.55 },
    bridgeSensitivity: 0.55,
    bridgeSmoothing: 0.85,
  },
};

/** Glitch — high sensitivity, transient-heavy experimental mapping */
export const {{APP_CONST}}_GLITCH_BUNDLE: PresetBundle = {
  id: 'glitch',
  name: 'Glitch',
  description: 'Experimental edge — high sensitivity with strong transient→glitch and mids→motion.',
  category: 'experimental',
  tags: ['{{APP_SLUG}}', 'glitch', 'experimental'],
  sound: { presetId: 'mutation' },
  visual: { presetId: 'mutation' },
  audioReactive: {
    enabled: true,
    sensitivity: 0.95,
    smoothing: 0.4,
    mappings: [
      { feature: 'bass', target: 'density', amount: 0.5, enabled: true },
      { feature: 'mids', target: 'motion', amount: 0.65, enabled: true },
      { feature: 'highs', target: 'brightness', amount: 0.5, enabled: true },
      { feature: 'amplitude', target: 'scale', amount: 0.4, enabled: true },
      { feature: 'transient', target: 'glitch', amount: 0.7, enabled: true },
    ],
  },
  workspace: { activeInspectorPanel: 'visual-parameters' },
  ui: {
    audioReactiveEnabled: true,
    tempo: 96,
    soundParameters: { growth: 0.5, bloom: 0.4, roots: 0.3, mold: 0.75, bacteria: 0.6 },
    visualParameters: { density: 0.85, speed: 0.6, glitchAmount: 0.4, trailAmount: 0.15 },
    bridgeSensitivity: 0.95,
    bridgeSmoothing: 0.4,
  },
};

/** Default browser seed — Pulse is the entry point for reactive sessions */
export const {{APP_CONST}}_STARTER_BUNDLE = {{APP_CONST}}_PULSE_BUNDLE;

/** All reactive preset bundles available in the preset browser */
export const {{APP_CONST}}_PRESET_BUNDLES: PresetBundle[] = [
  {{APP_CONST}}_PULSE_BUNDLE,
  {{APP_CONST}}_DRIFT_BUNDLE,
  {{APP_CONST}}_GLITCH_BUNDLE,
];
