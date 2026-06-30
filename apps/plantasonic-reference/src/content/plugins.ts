import type { PlatformPlugin } from '@plantasonic/platform-types';

import { PLANTASONIC_SEED_BUNDLE } from './presetBundles.js';

/** Plantasonic app plugins — creative extensions registered through platform PluginManager */
export const PLANTASONIC_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: 'plantasonic.seed-preset',
      name: 'Plantasonic Seed Preset',
      version: '0.1.0',
      description: 'Contributes the default Plantasonic Seed unified preset bundle.',
      capabilities: ['preset-bundles', 'documentation'],
      defaultEnabled: true,
      documentation: {
        summary: 'Starter flora preset for new Plantasonic sessions.',
        tags: ['plantasonic', 'seed'],
      },
    },
    register(context) {
      context.registerPresetBundle(PLANTASONIC_SEED_BUNDLE);
    },
  },
  {
    manifest: {
      id: 'plantasonic.ascii-visual',
      name: 'Plantasonic Visual',
      version: '0.1.0',
      description: 'Declares Plantasonic visual engine adapter metadata.',
      capabilities: ['visual-adapter', 'documentation'],
      defaultEnabled: true,
    },
    register(context) {
      if (context.visual) {
        context.declareVisualAdapter({
          adapterId: context.visual.id,
          engineName: context.visual.engineName,
          description: 'Plantasonic visual session via platform adapter',
        });
      }
    },
  },
  {
    manifest: {
      id: 'plantasonic.sound',
      name: 'Plantasonic Sound',
      version: '0.1.0',
      description: 'Declares Plantasonic sound engine adapter metadata.',
      capabilities: ['sound-adapter', 'documentation'],
      defaultEnabled: true,
    },
    register(context) {
      if (context.sound) {
        context.declareSoundAdapter({
          adapterId: context.sound.id,
          engineName: context.sound.engineName,
          description: 'Plantasonic sound session via platform adapter',
        });
      }
    },
  },
];
