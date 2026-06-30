/**
 * Floating panel behavior — drag, edge-snap, collapse, pin, and remembered
 * position. Layered on the existing `.ps-floating-panel` surface; markup uses
 * `data-ps-floating-*` hooks:
 *
 *   <div class="ps-floating-panel" data-ps-floating-panel="mixer">
 *     <div class="ps-floating-panel__handle" data-ps-floating-handle>
 *       Mixer
 *       <button data-ps-floating-pin>…</button>
 *       <button data-ps-floating-collapse>…</button>
 *     </div>
 *     <div class="ps-floating-panel__body">…</div>
 *   </div>
 *
 * Multi-monitor + auto-hide animations deepen in a later release; the API is
 * stable now.
 */

export type FloatingOptions = {
  /** Persist positions in localStorage. */
  persist?: boolean;
  /** Storage namespace (default `ps-floating`). */
  storageKey?: string;
  /** Distance (px) from an edge that triggers a snap (default 24). */
  snapThreshold?: number;
};

type Position = { x: number; y: number };

function storageId(ns: string, panelId: string): string {
  return `${ns}:${panelId}`;
}

function loadPosition(ns: string, panelId: string): Position | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageId(ns, panelId));
    return raw ? (JSON.parse(raw) as Position) : null;
  } catch {
    return null;
  }
}

function savePosition(ns: string, panelId: string, pos: Position): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(storageId(ns, panelId), JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function applyPosition(panel: HTMLElement, pos: Position): void {
  panel.style.left = `${pos.x}px`;
  panel.style.top = `${pos.y}px`;
  panel.style.right = 'auto';
  panel.style.bottom = 'auto';
}

/**
 * Wire floating-panel behavior within `root`. Returns a cleanup function.
 * No-ops in non-DOM environments.
 */
export function bindFloating(root: ParentNode | null | undefined, options: FloatingOptions = {}): () => void {
  if (!root || typeof (root as Element).querySelectorAll !== 'function') return () => {};
  const el = root as HTMLElement;
  const ns = options.storageKey ?? 'ps-floating';
  const threshold = options.snapThreshold ?? 24;

  // Restore persisted positions.
  if (options.persist) {
    el.querySelectorAll<HTMLElement>('[data-ps-floating-panel]').forEach((panel) => {
      const id = panel.getAttribute('data-ps-floating-panel');
      if (!id) return;
      const pos = loadPosition(ns, id);
      if (pos) applyPosition(panel, pos);
    });
  }

  let active: HTMLElement | null = null;
  let pointerId = -1;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  const onPointerDown = (event: Event) => {
    const pe = event as PointerEvent;
    const handle = (pe.target as Element)?.closest?.('[data-ps-floating-handle]');
    if (!handle) return;
    // Ignore drags initiated on control buttons inside the handle.
    if ((pe.target as Element)?.closest?.('[data-ps-floating-pin],[data-ps-floating-collapse]')) return;
    const panel = handle.closest('[data-ps-floating-panel]') as HTMLElement | null;
    if (!panel) return;
    active = panel;
    pointerId = pe.pointerId;
    startX = pe.clientX;
    startY = pe.clientY;
    const rect = panel.getBoundingClientRect();
    const parentRect = (el.getBoundingClientRect?.() ?? { left: 0, top: 0 }) as DOMRect;
    originX = rect.left - parentRect.left;
    originY = rect.top - parentRect.top;
    panel.classList.add('ps-is-dragging');
    (handle as HTMLElement).setPointerCapture?.(pe.pointerId);
  };

  const onPointerMove = (event: Event) => {
    if (!active) return;
    const pe = event as PointerEvent;
    if (pe.pointerId !== pointerId) return;
    applyPosition(active, { x: originX + (pe.clientX - startX), y: originY + (pe.clientY - startY) });
  };

  const onPointerUp = (event: Event) => {
    if (!active) return;
    const pe = event as PointerEvent;
    const panel = active;
    panel.classList.remove('ps-is-dragging');

    // Edge snap within the container.
    const parent = el.getBoundingClientRect?.();
    const rect = panel.getBoundingClientRect();
    if (parent) {
      let x = rect.left - parent.left;
      let y = rect.top - parent.top;
      let snapped = false;
      if (x <= threshold) { x = 0; snapped = true; }
      if (y <= threshold) { y = 0; snapped = true; }
      if (parent.right - rect.right <= threshold) { x = parent.width - rect.width; snapped = true; }
      if (parent.bottom - rect.bottom <= threshold) { y = parent.height - rect.height; snapped = true; }
      applyPosition(panel, { x, y });
      panel.classList.toggle('ps-is-snapped', snapped);
      if (options.persist) {
        const id = panel.getAttribute('data-ps-floating-panel');
        if (id) savePosition(ns, id, { x, y });
      }
    }
    active = null;
    pointerId = -1;
    void pe;
  };

  const onClick = (event: Event) => {
    const target = event.target as Element;
    const collapse = target?.closest?.('[data-ps-floating-collapse]');
    if (collapse) {
      const panel = collapse.closest('[data-ps-floating-panel]');
      panel?.classList.toggle('ps-is-collapsed');
      return;
    }
    const pin = target?.closest?.('[data-ps-floating-pin]');
    if (pin) {
      const panel = pin.closest('[data-ps-floating-panel]');
      const pinned = panel?.classList.toggle('ps-is-pinned');
      pin.setAttribute('aria-pressed', String(!!pinned));
    }
  };

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
  el.addEventListener('click', onClick);

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
    el.removeEventListener('pointercancel', onPointerUp);
    el.removeEventListener('click', onClick);
  };
}
