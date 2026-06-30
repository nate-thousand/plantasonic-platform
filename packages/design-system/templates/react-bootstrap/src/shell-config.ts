import type { ApplicationShellConfig } from 'plantasonic-design-system/shell';
import { cycleShellTheme } from 'plantasonic-design-system/shell';

export const shellConfig: ApplicationShellConfig = {
  id: '__APP_NAME_KEBAB__',
  title: '__APP_NAME__',
  persistState: true,
  theme: 'dark',
  workspace: 'single',
  navigation: {
    title: '__APP_NAME__',
    groups: [
      {
        id: 'bootstrap',
        label: 'Bootstrap',
        items: [
          { id: 'home', label: 'Components', icon: '▦', active: true },
          { id: 'forms', label: 'Forms', icon: '☰' },
        ],
      },
    ],
  },
  routes: [
    { id: 'home', path: '/components', label: 'Components' },
    { id: 'forms', path: '/forms', label: 'Forms' },
  ],
  docks: [
    {
      position: 'left',
      items: [
        { id: 'home', label: 'Components', icon: '▦', active: true },
        { id: 'forms', label: 'Forms', icon: '☰' },
      ],
    },
  ],
  panels: [{ id: 'tokens', title: 'Design Tokens', state: 'collapsed' }],
  commands: [
    {
      id: 'palette',
      label: 'Command Palette',
      group: 'Navigation',
      shortcut: '⌘K',
      action: () => document.querySelector<HTMLElement>('[data-ps-command-trigger]')?.click(),
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      group: 'Settings',
      shortcut: '⌘⇧T',
      action: () => cycleShellTheme(),
    },
  ],
};
