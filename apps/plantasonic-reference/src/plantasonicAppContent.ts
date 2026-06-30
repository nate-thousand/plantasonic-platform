import type { InstrumentAppContent } from '@plantasonic/platform-demo/instrument-app';

import { plantasonicAppConfig } from './config/appConfig.js';
import { plantasonicShellConfig } from './config/shellConfig.js';
import { PLANTASONIC_BRANDING } from './content/branding.js';
import { PLANTASONIC_DEFAULT_TEMPO } from './content/mappings.js';
import {
  PLANTASONIC_PRESET_BUNDLES,
  PLANTASONIC_SEED_BUNDLE,
} from './content/presetBundles.js';
import { PLANTASONIC_PLUGINS } from './content/plugins.js';

/**
 * All Plantasonic-specific configuration in one injectable object.
 * Everything else is platform orchestration via mountInstrumentApp().
 */
export const plantasonicAppContent: InstrumentAppContent = {
  application: plantasonicAppConfig,
  shell: plantasonicShellConfig,
  presetBundles: PLANTASONIC_PRESET_BUNDLES,
  browserSeedBundles: [PLANTASONIC_SEED_BUNDLE],
  plugins: PLANTASONIC_PLUGINS,
  branding: {
    eventSource: 'plantasonic-reference',
    presetBrowserLabel: PLANTASONIC_BRANDING.presetBrowserLabel,
    transportTempo: PLANTASONIC_DEFAULT_TEMPO,
  },
};
