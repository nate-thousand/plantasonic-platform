import type { PlatformPlugin } from '@plantasonic/platform-types';

import { {{APP_CONST}}_STARTER_BUNDLE } from './presetBundles.js';

export const {{APP_CONST}}_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: '{{APP_ID}}.starter-preset',
      name: '{{APP_NAME}} Starter Preset',
      version: '0.1.0',
      description: 'Contributes the default starter preset bundle.',
      capabilities: ['preset-bundles'],
      defaultEnabled: true,
    },
    register(context) {
      context.registerPresetBundle({{APP_CONST}}_STARTER_BUNDLE);
    },
  },
];
