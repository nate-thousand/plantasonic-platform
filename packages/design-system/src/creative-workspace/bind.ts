/**
 * Creative Workspace — behavior wiring.
 *
 * Attaches floating panel interactions within a workspace root.
 * Composes the instrument `bindFloating()` helper; no-ops without DOM.
 */

import { bindFloating, type FloatingOptions } from '../instrument/floating.ts';

export type CreativeWorkspaceBindOptions = FloatingOptions & {
  /** Also wire floating behavior inside nested overlay layers (default true). */
  wireOverlays?: boolean;
};

/**
 * Wire drag, snap, collapse, and pin for floating workspace surfaces.
 * Returns a cleanup function.
 */
export function bindCreativeWorkspace(
  root: ParentNode | null | undefined,
  options: CreativeWorkspaceBindOptions = {},
): () => void {
  if (!root || typeof (root as Element).querySelectorAll !== 'function') return () => {};

  const cleanups: Array<() => void> = [];
  const floatingOpts: FloatingOptions = {
    persist: options.persist,
    storageKey: options.storageKey ?? 'ps-creative-workspace',
    snapThreshold: options.snapThreshold,
  };

  cleanups.push(bindFloating(root as HTMLElement, floatingOpts));

  if (options.wireOverlays !== false) {
    (root as Element).querySelectorAll('[data-ps-cw-overlays]').forEach((layer) => {
      cleanups.push(bindFloating(layer, floatingOpts));
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
