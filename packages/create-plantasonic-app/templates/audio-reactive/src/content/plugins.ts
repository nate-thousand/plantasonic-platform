import type { PlatformPlugin } from '@plantasonic/platform-types';

import {
  {{APP_CONST}}_DRIFT_BUNDLE,
  {{APP_CONST}}_GLITCH_BUNDLE,
  {{APP_CONST}}_PULSE_BUNDLE,
} from './presetBundles.js';

export const {{APP_CONST}}_PLUGINS: PlatformPlugin[] = [
  {
    manifest: {
      id: '{{APP_ID}}.reactive-presets',
      name: '{{APP_NAME}} Reactive Presets',
      version: '0.1.0',
      description: 'Contributes pulse, drift, and glitch audio-reactive preset bundles.',
      capabilities: ['preset-bundles'],
      defaultEnabled: true,
    },
    register(context) {
      context.registerPresetBundle({{APP_CONST}}_PULSE_BUNDLE);
      context.registerPresetBundle({{APP_CONST}}_DRIFT_BUNDLE);
      context.registerPresetBundle({{APP_CONST}}_GLITCH_BUNDLE);
    },
  },
];
