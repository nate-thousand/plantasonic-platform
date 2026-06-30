/**
 * Display modes for the instrument shell: edit / performance / presentation /
 * touch. Toggles `.ps-instrument--{mode}` on the shell root and optionally
 * persists the choice via the shell's window-state.
 *
 * - performance: distraction-free — hides nav/toolbars/dev, keeps stage +
 *   transport + performance overlays.
 * - presentation: hides editing controls, adds branding/minimal chrome.
 * - touch: enlarges hit targets and thumb zones.
 */

import type { ShellMode } from '../shell/types';
import { loadWindowState, saveWindowState } from '../shell/window-state.ts';

export const SHELL_MODES: ShellMode[] = ['edit', 'performance', 'presentation', 'touch'];

export function shellModeClass(mode: ShellMode): string {
  return `ps-instrument--${mode}`;
}

export type SetModeOptions = {
  shellId?: string;
  persist?: boolean;
};

/** Apply a display mode to the instrument root. Returns the applied mode. */
export function setShellMode(
  root: Element | null | undefined,
  mode: ShellMode,
  options: SetModeOptions = {},
): ShellMode {
  if (root && root.classList) {
    for (const m of SHELL_MODES) root.classList.toggle(shellModeClass(m), m === mode);
    root.setAttribute?.('data-ps-mode', mode);
  }
  if (options.persist && options.shellId && typeof localStorage !== 'undefined') {
    try {
      saveWindowState(options.shellId, { shellMode: mode });
    } catch {
      /* ignore storage failures */
    }
  }
  return mode;
}

/** Read the persisted display mode for a shell (defaults to `edit`). */
export function getShellMode(shellId: string): ShellMode {
  try {
    return loadWindowState(shellId).shellMode ?? 'edit';
  } catch {
    return 'edit';
  }
}

/** Advance to the next mode in `SHELL_MODES`, wrapping around. */
export function cycleShellMode(
  root: Element | null | undefined,
  current: ShellMode,
  options: SetModeOptions = {},
): ShellMode {
  const idx = SHELL_MODES.indexOf(current);
  const next = SHELL_MODES[(idx + 1) % SHELL_MODES.length] ?? 'edit';
  return setShellMode(root, next, options);
}
