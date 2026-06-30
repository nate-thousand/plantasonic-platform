import type { PresetBundle } from '@plantasonic/platform-types';

/**
 * Plantasonic unified preset bundles — app-owned creative configuration.
 * Platform PresetBundleRegistry applies these through adapters without engine coupling.
 */
export const PLANTASONIC_PRESET_BUNDLES: PresetBundle[] = [
  {
    id: 'root',
    name: 'Root',
    description: 'Deep subharmonic roots — Plantasonic earth tone session.',
    category: 'flora',
    tags: ['plantasonic', 'organic', 'deep'],
    sound: { presetId: 'root' },
    visual: { presetId: 'root' },
    audioReactive: {
      enabled: true,
      sensitivity: 0.7,
      smoothing: 0.8,
      mappings: [
        { feature: 'bass', target: 'density', amount: 0.55, enabled: true },
        { feature: 'mids', target: 'motion', amount: 0.25, enabled: true },
        { feature: 'highs', target: 'brightness', amount: 0.15, enabled: true },
        { feature: 'amplitude', target: 'scale', amount: 0.35, enabled: true },
        { feature: 'transient', target: 'glitch', amount: 0.1, enabled: true },
      ],
    },
    workspace: { activeInspectorPanel: 'audio-reactive' },
    ui: {
      audioReactiveEnabled: true,
      tempo: 60,
      soundParameters: { growth: 0.5, bloom: 0.3, roots: 0.75, mold: 0.25, bacteria: 0.35 },
      visualParameters: { density: 0.75, speed: 0.3, glitchAmount: 0.08, trailAmount: 0.45 },
    },
  },
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Bright floral canopy — mids and highs drive Plantasonic motion.',
    category: 'flora',
    tags: ['plantasonic', 'bright', 'motion'],
    sound: { presetId: 'bloom' },
    visual: { presetId: 'bloom' },
    audioReactive: {
      enabled: true,
      sensitivity: 0.65,
      smoothing: 0.6,
      mappings: [
        { feature: 'bass', target: 'density', amount: 0.3, enabled: true },
        { feature: 'mids', target: 'motion', amount: 0.5, enabled: true },
        { feature: 'highs', target: 'brightness', amount: 0.45, enabled: true },
        { feature: 'amplitude', target: 'scale', amount: 0.25, enabled: true },
        { feature: 'transient', target: 'glitch', amount: 0.12, enabled: true },
      ],
    },
    workspace: { activeInspectorPanel: 'visual-parameters' },
    ui: {
      audioReactiveEnabled: true,
      tempo: 78,
      soundParameters: { growth: 0.65, bloom: 0.7, roots: 0.4, mold: 0.2, bacteria: 0.25 },
      visualParameters: { density: 0.55, speed: 0.6, glitchAmount: 0.1, trailAmount: 0.3 },
    },
  },
  {
    id: 'mycelium',
    name: 'Mycelium',
    description: 'Networked ambient texture — trailing Plantasonic visuals.',
    category: 'ambient',
    tags: ['plantasonic', 'ambient', 'network'],
    sound: { presetId: 'mycelium' },
    visual: { presetId: 'mycelium' },
    audioReactive: {
      enabled: true,
      sensitivity: 0.5,
      smoothing: 0.85,
      mappings: [
        { feature: 'bass', target: 'density', amount: 0.4, enabled: true },
        { feature: 'mids', target: 'motion', amount: 0.35, enabled: true },
        { feature: 'highs', target: 'brightness', amount: 0.2, enabled: true },
        { feature: 'amplitude', target: 'scale', amount: 0.3, enabled: true },
        { feature: 'transient', target: 'glitch', amount: 0.15, enabled: true },
      ],
    },
    workspace: { activeInspectorPanel: 'audio-reactive' },
    ui: {
      audioReactiveEnabled: true,
      tempo: 54,
      soundParameters: { growth: 0.4, bloom: 0.35, roots: 0.6, mold: 0.45, bacteria: 0.5 },
      visualParameters: { density: 0.7, speed: 0.35, glitchAmount: 0.12, trailAmount: 0.55 },
    },
  },
  {
    id: 'mutation',
    name: 'Mutation',
    description: 'Corrupted evolution — experimental Plantasonic edge case.',
    category: 'experimental',
    tags: ['plantasonic', 'experimental', 'glitch'],
    sound: { presetId: 'mutation' },
    visual: { presetId: 'mutation' },
    audioReactive: {
      enabled: true,
      sensitivity: 0.9,
      smoothing: 0.45,
      mappings: [
        { feature: 'bass', target: 'density', amount: 0.45, enabled: true },
        { feature: 'mids', target: 'motion', amount: 0.55, enabled: true },
        { feature: 'highs', target: 'brightness', amount: 0.4, enabled: true },
        { feature: 'amplitude', target: 'scale', amount: 0.35, enabled: true },
        { feature: 'transient', target: 'glitch', amount: 0.55, enabled: true },
      ],
    },
    workspace: { activeInspectorPanel: 'visual-parameters' },
    ui: {
      audioReactiveEnabled: true,
      tempo: 96,
      soundParameters: { growth: 0.55, bloom: 0.4, roots: 0.35, mold: 0.7, bacteria: 0.65 },
      visualParameters: { density: 0.8, speed: 0.55, glitchAmount: 0.35, trailAmount: 0.2 },
    },
  },
];

/** Seed bundle contributed by Plantasonic Seed plugin */
export const PLANTASONIC_SEED_BUNDLE: PresetBundle = {
  id: 'seed',
  name: 'Seed',
  description: 'Gentle organic sprout — default Plantasonic starter session.',
  category: 'flora',
  tags: ['plantasonic', 'starter', 'organic'],
  sound: { presetId: 'seed' },
  visual: { presetId: 'seed' },
  audioReactive: {
    enabled: true,
    sensitivity: 0.55,
    smoothing: 0.75,
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
    tempo: 68,
    soundParameters: { growth: 0.35, bloom: 0.45, roots: 0.55, mold: 0.15, bacteria: 0.2 },
    visualParameters: { density: 0.6, speed: 0.4, glitchAmount: 0.05, trailAmount: 0.35 },
  },
};
