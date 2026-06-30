import type { PlatformPlugin, PresetBundle } from '@plantasonic/platform-types';

/** Seed preset bundle contributed via plugin (also in demo preset list) */
export const SEED_PRESET_BUNDLE: PresetBundle = {
  id: 'seed',
  name: 'Seed',
  description: 'Gentle organic sprout — contributed by Seed Preset Plugin.',
  category: 'flora',
  tags: ['organic', 'gentle', 'starter', 'plugin'],
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
  workspace: {
    activeInspectorPanel: 'sound-parameters',
    regions: { stage: { visible: true }, inspector: { visible: true } },
  },
  ui: {
    audioReactiveEnabled: true,
    tempo: 68,
    soundParameters: { growth: 0.35, bloom: 0.45, roots: 0.55, mold: 0.15, bacteria: 0.2 },
    visualParameters: { density: 0.6, speed: 0.4, glitchAmount: 0.05, trailAmount: 0.35 },
    bridgeSensitivity: 0.55,
    bridgeSmoothing: 0.75,
  },
};

/** Seed Preset Plugin — registers the Seed unified preset bundle */
export const seedPresetPlugin: PlatformPlugin = {
  manifest: {
    id: 'demo.seed-preset',
    name: 'Seed Preset Plugin',
    version: '0.1.0',
    description: 'Contributes the Seed unified preset bundle to the platform registry.',
    capabilities: ['preset-bundles', 'documentation'],
    defaultEnabled: true,
    documentation: {
      summary: 'Starter flora preset bundle for the demo.',
      tags: ['preset', 'seed', 'flora'],
    },
  },
  register(context) {
    context.registerPresetBundle(SEED_PRESET_BUNDLE);
    context.registerDocumentation({
      summary: 'Seed bundle maps sound seed → visual seed with gentle reactive defaults.',
      tags: ['seed'],
    });
  },
};

/** ASCII Visual Plugin placeholder — declares visual engine adapter metadata */
export const asciiVisualPlugin: PlatformPlugin = {
  manifest: {
    id: 'demo.ascii-visual',
    name: 'ASCII Visual Plugin',
    version: '0.1.0',
    description: 'Placeholder plugin for ascii-visual-engine (Plantasia Visual Engine) integration.',
    capabilities: ['visual-adapter', 'documentation', 'panels'],
    defaultEnabled: true,
    documentation: {
      summary: 'Wraps ascii-visual-engine via createVisualEngineAdapter().',
      url: 'https://github.com/nate-thousand/ascii-visual-engine',
      tags: ['visual', 'ascii'],
    },
  },
  register(context) {
    if (context.visual) {
      context.declareVisualAdapter({
        adapterId: context.visual.id,
        engineName: context.visual.engineName,
        description: 'Runtime visual adapter from demo',
      });
    } else {
      context.declareVisualAdapter({
        adapterId: 'visual',
        engineName: 'ascii-visual-engine',
        description: 'Visual adapter placeholder — mount at runtime',
      });
    }
    context.registerPanel({
      id: 'plugin-ascii-visual',
      title: 'ASCII Visual (Plugin)',
      description: 'Plugin-declared panel placeholder',
    });
    context.registerDocumentation({
      summary: 'Visual rendering via platform VisualEngineAdapter — no engine code in plugin.',
      tags: ['visual', 'plugin'],
    });
  },
};

/** Plantasia Sound Plugin placeholder — declares sound engine adapter metadata */
export const plantasiaSoundPlugin: PlatformPlugin = {
  manifest: {
    id: 'demo.plantasia-sound',
    name: 'Plantasia Sound Plugin',
    version: '0.1.0',
    description: 'Placeholder plugin for plantasia-sound-engine integration.',
    capabilities: ['sound-adapter', 'documentation', 'commands'],
    defaultEnabled: true,
    documentation: {
      summary: 'Wraps plantasia-sound-engine via createSoundEngineAdapter().',
      tags: ['sound', 'plantasia'],
    },
  },
  register(context) {
    if (context.sound) {
      context.declareSoundAdapter({
        adapterId: context.sound.id,
        engineName: context.sound.engineName,
        description: 'Runtime sound adapter from demo',
      });
    } else {
      context.declareSoundAdapter({
        adapterId: 'sound',
        engineName: 'plantasia-sound-engine',
        description: 'Sound adapter placeholder — init at runtime',
      });
    }
    context.registerCommand({
      id: 'sound-reload-species',
      label: 'Reload Species',
      description: 'Placeholder command — reload active sound species',
    });
    context.registerDocumentation({
      summary: 'Audio via platform SoundEngineAdapter — plugin does not import engine internals.',
      tags: ['sound', 'plugin'],
    });
  },
};

/** Performance Mapping Plugin placeholder — adds demo performance mapping */
export const performanceMappingPlugin: PlatformPlugin = {
  manifest: {
    id: 'demo.performance-mapping',
    name: 'Performance Mapping Plugin',
    version: '0.1.0',
    description: 'Contributes additional performance control mappings.',
    capabilities: ['performance-mappings', 'audio-reactive-mappings', 'documentation'],
    dependencies: [{ pluginId: 'demo.plantasia-sound', optional: true }],
    defaultEnabled: true,
  },
  register(context) {
    context.registerPerformanceMapping({
      id: 'plugin-midi-cc74',
      source: 'midi-cc',
      sourceValue: 74,
      target: 'visual-parameter',
      targetId: 'trailAmount',
      enabled: true,
    });
    context.registerAudioReactiveMapping({
      feature: 'highs',
      target: 'brightness',
      amount: 0.2,
      enabled: true,
    });
    context.registerDocumentation({
      summary: 'Adds MIDI CC 74 → visual trails and supplemental highs→brightness mapping.',
      tags: ['performance', 'midi'],
    });
  },
};

export const DEMO_PLUGINS: PlatformPlugin[] = [
  seedPresetPlugin,
  asciiVisualPlugin,
  plantasiaSoundPlugin,
  performanceMappingPlugin,
];
