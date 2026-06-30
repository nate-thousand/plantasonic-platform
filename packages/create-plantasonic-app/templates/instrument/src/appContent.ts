import type { InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';

import { {{APP_CAMEL}}AppConfig } from './config/appConfig.js';
import { {{APP_CAMEL}}ShellConfig } from './config/shellConfig.js';
import { {{APP_CONST}}_BRANDING } from './content/branding.js';
import { {{APP_CONST}}_DEFAULT_TEMPO } from './content/mappings.js';
import { {{APP_CONST}}_PRESET_BUNDLES, {{APP_CONST}}_STARTER_BUNDLE } from './content/presetBundles.js';
import { {{APP_CONST}}_PLUGINS } from './content/plugins.js';

/** App-owned content injected into platform orchestration */
export const {{APP_CAMEL}}AppContent: InstrumentAppContent = {
  application: {{APP_CAMEL}}AppConfig,
  shell: {{APP_CAMEL}}ShellConfig,
  presetBundles: {{APP_CONST}}_PRESET_BUNDLES,
  browserSeedBundles: [{{APP_CONST}}_STARTER_BUNDLE],
  plugins: {{APP_CONST}}_PLUGINS,
  branding: {
    eventSource: '{{EVENT_SOURCE}}',
    presetBrowserLabel: {{APP_CONST}}_BRANDING.presetBrowserLabel,
    transportTempo: {{APP_CONST}}_DEFAULT_TEMPO,
  },
};
