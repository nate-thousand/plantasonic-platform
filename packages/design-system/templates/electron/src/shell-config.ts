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
        id: 'desktop',
        label: 'Desktop',
        items: [{ id: 'home', label: 'Home', icon: '◉', active: true }],
      },
    ],
  },
  routes: [{ id: 'home', path: '/home', label: 'Home' }],
  docks: [
    {
      position: 'left',
      items: [{ id: 'home', label: 'Home', icon: '◉', active: true }],
    },
  ],
  panels: [{ id: 'system', title: 'System', state: 'collapsed' }],
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
