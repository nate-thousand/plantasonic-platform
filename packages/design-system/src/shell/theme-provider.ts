import type { ThemeMode } from './types';
import { resolveTheme } from './window-state';

const THEME_KEY = 'ps-shell-theme';

export type ResolvedTheme = 'dark' | 'light';

export function getShellTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'auto') return stored;
  return 'dark';
}

export function setShellTheme(mode: ThemeMode): ResolvedTheme {
  localStorage.setItem(THEME_KEY, mode);
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.dataset.psThemeMode = mode;
  document.dispatchEvent(new CustomEvent('ps-shell-theme', { detail: { mode, resolved } }));
  return resolved;
}

export function initShellTheme(mode: ThemeMode = getShellTheme()): ResolvedTheme {
  return setShellTheme(mode);
}

export function cycleShellTheme(): ThemeMode {
  const order: ThemeMode[] = ['dark', 'light', 'auto'];
  const current = getShellTheme();
  const next = order[(order.indexOf(current) + 1) % order.length] ?? 'dark';
  setShellTheme(next);
  return next;
}

export function watchSystemTheme(onChange: (resolved: ResolvedTheme) => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const handler = () => {
    if (getShellTheme() === 'auto') onChange(resolveTheme('auto'));
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
