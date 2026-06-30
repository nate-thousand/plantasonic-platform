import type { PlatformPlugin } from '@plantasonic/platform-types';

import { {{APP_CONST}}_BROADCAST_BUNDLE } from './presetBundles.js';

export const {{APP_CONST}}_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: '{{APP_ID}}.broadcast-preset',
      name: '{{APP_NAME}} Broadcast Preset',
      version: '0.1.0',
      description: 'Contributes the default Broadcast starter bundle.',
      capabilities: ['preset-bundles', 'documentation'],
      defaultEnabled: true,
      documentation: {
        summary: 'Baseline CRT broadcast carrier for Signal 9 sessions.',
        tags: ['signal-9', 'broadcast'],
      },
    },
    register(context) {
      context.registerPresetBundle({{APP_CONST}}_BROADCAST_BUNDLE);
    },
  },
];
