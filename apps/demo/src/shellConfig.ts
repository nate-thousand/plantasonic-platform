import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';

/** Design System application shell configuration for the platform demo. */
export const shellConfig: ApplicationShellConfig = {
  id: 'platform-demo',
  title: 'Plantasonic Platform Demo',
  variant: 'instrument',
  mode: 'edit',
  theme: 'dark',
  persistState: false,
  navigation: {
    title: 'Plantasonic Platform Demo',
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
