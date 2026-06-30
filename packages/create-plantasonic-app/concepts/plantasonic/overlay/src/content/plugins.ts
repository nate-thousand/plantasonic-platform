import type { PlatformPlugin } from '@plantasonic/platform-types';

import { {{APP_CONST}}_SEED_BUNDLE } from './presetBundles.js';

export const {{APP_CONST}}_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: '{{APP_ID}}.seed-preset',
      name: '{{APP_NAME}} Seed Preset',
      version: '0.1.0',
      description: 'Contributes the default Plantasonic Seed unified preset bundle.',
      capabilities: ['preset-bundles', 'documentation'],
      defaultEnabled: true,
    },
    register(context) {
      context.registerPresetBundle({{APP_CONST}}_SEED_BUNDLE);
    },
  },
];
