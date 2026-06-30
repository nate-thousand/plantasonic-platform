import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';

import { PLANTASONIC_BRANDING } from '../content/branding.js';

/** Design System shell configuration — no local tokens or theme files */
export const plantasonicShellConfig: ApplicationShellConfig = {
  id: 'plantasonic',
  title: PLANTASONIC_BRANDING.appTitle,
  variant: 'instrument',
  mode: 'edit',
  theme: 'dark',
  persistState: false,
  navigation: {
    title: PLANTASONIC_BRANDING.appTitle,
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
