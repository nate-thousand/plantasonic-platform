import type { PlatformApplication } from '@plantasonic/platform';

import { demoConfig } from './demoConfig.js';
import { DEMO_PRESET_BUNDLES } from './demoPresetBundles.js';
import { DEMO_PLUGINS, SEED_PRESET_BUNDLE } from './demoPlugins.js';
import { mountInstrumentApp } from './instrumentApp.js';
import { shellConfig } from './shellConfig.js';

/** Initialize and mount the platform demo application */
export async function mountDemo(container: HTMLElement): Promise<PlatformApplication> {
  return mountInstrumentApp(container, {
    application: demoConfig,
    shell: shellConfig,
    presetBundles: DEMO_PRESET_BUNDLES,
    browserSeedBundles: [SEED_PRESET_BUNDLE],
    plugins: DEMO_PLUGINS,
    branding: {
      eventSource: 'platform-demo',
      presetBrowserLabel: 'Preset Browser',
      transportTempo: 72,
    },
  });
}

export { mountInstrumentApp, type InstrumentAppContent, type InstrumentAppBranding } from './instrumentApp.js';
