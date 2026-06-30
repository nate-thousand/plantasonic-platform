import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';

import { PLANTASONIC_V2_BRANDING } from '../content/branding.js';

export const plantasonicV2ShellConfig: ApplicationShellConfig = {
  id: 'plantasonic-v2',
  title: PLANTASONIC_V2_BRANDING.appTitle,
  variant: 'instrument',
  mode: 'edit',
  theme: 'dark',
  persistState: false,
  navigation: {
    title: PLANTASONIC_V2_BRANDING.appTitle,
    groups: [],
  },
  regions: {
    header: false,
    sidebar: false,
    inspector: false,
    dock: false,
    overlay: true,
  },
};
