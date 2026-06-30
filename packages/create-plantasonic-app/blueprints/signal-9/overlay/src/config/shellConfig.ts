import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';

import { {{APP_CONST}}_BRANDING } from '../content/branding.js';

/**
 * Instrument shell — Creative Workspace preset owns layout.
 * Stage is dominant; transport, inspector, preset browser, and HUD float above.
 * Command palette (⌘K) is rendered by the Design System application shell.
 */
export const {{APP_CAMEL}}ShellConfig: ApplicationShellConfig = {
  id: '{{APP_ID}}',
  title: {{APP_CONST}}_BRANDING.appTitle,
  variant: 'instrument',
  mode: 'edit',
  theme: '{{THEME_INTENT}}',
  persistState: false,
  navigation: {
    title: {{APP_CONST}}_BRANDING.appTitle,
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
