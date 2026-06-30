import type { InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';

import { plantasonicV2AppConfig } from './config/appConfig.js';
import { plantasonicV2ShellConfig } from './config/shellConfig.js';
import { PLANTASONIC_V2_BRANDING } from './content/branding.js';
import { PLANTASONIC_V2_DEFAULT_TEMPO } from './content/mappings.js';
import { PLANTASONIC_V2_PRESET_BUNDLES, PLANTASONIC_V2_STARTER_BUNDLE } from './content/presetBundles.js';
import { PLANTASONIC_V2_PLUGINS } from './content/plugins.js';

/** App-owned content injected into platform orchestration */
export const plantasonicV2AppContent: InstrumentAppContent = {
  application: plantasonicV2AppConfig,
  shell: plantasonicV2ShellConfig,
  presetBundles: PLANTASONIC_V2_PRESET_BUNDLES,
  browserSeedBundles: [PLANTASONIC_V2_STARTER_BUNDLE],
  plugins: PLANTASONIC_V2_PLUGINS,
  branding: {
    eventSource: 'plantasonic-v2',
    presetBrowserLabel: PLANTASONIC_V2_BRANDING.presetBrowserLabel,
    transportTempo: PLANTASONIC_V2_DEFAULT_TEMPO,
  },
};
