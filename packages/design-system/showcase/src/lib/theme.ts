export type ThemeId = 'dark' | 'light';

const STORAGE_KEY = 'ds-showcase-theme';

export function getTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function setTheme(theme: ThemeId): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  document.dispatchEvent(new CustomEvent('ds-theme-change', { detail: { theme } }));
}

export function initTheme(): void {
  setTheme(getTheme());
}

export function toggleTheme(): ThemeId {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
