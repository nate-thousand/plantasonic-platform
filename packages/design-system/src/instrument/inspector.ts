/**
 * Inspector framework — applications contribute panels, the Design System
 * renders them. Panels cover properties / parameters / metadata / debug /
 * performance / presets / automation / MIDI; the registry is open so apps add
 * their own. Output reuses the existing `.ps-inspector` surface.
 */

import { attrs, classList, escapeHtml } from './internal.ts';

export type InspectorPanel = {
  id: string;
  title: string;
  /** Optional group heading (panels are grouped in registration order). */
  group?: string;
  /** Sort order within a group (lower first). */
  order?: number;
  /** Start collapsed. */
  collapsed?: boolean;
  /** Returns the panel body HTML (called at render time). */
  render: () => string;
};

export type InspectorRegistry = {
  registerPanel(panel: InspectorPanel): InspectorRegistry;
  unregisterPanel(id: string): InspectorRegistry;
  getPanels(): InspectorPanel[];
  render(): string;
};

export function createInspector(): InspectorRegistry {
  const panels = new Map<string, InspectorPanel>();
  const registry: InspectorRegistry = {
    registerPanel(panel) {
      panels.set(panel.id, panel);
      return registry;
    },
    unregisterPanel(id) {
      panels.delete(id);
      return registry;
    },
    getPanels() {
      return [...panels.values()];
    },
    render() {
      return renderInspector(registry.getPanels());
    },
  };
  return registry;
}

function renderPanel(panel: InspectorPanel): string {
  const bodyId = `ps-inspector-${panel.id}`;
  const collapsed = !!panel.collapsed;
  return `<section class="${classList('ps-inspector__panel', collapsed && 'ps-is-collapsed')}" data-ps-inspector-panel="${escapeHtml(panel.id)}">
  <button type="button" class="ps-inspector__header" aria-expanded="${!collapsed}" aria-controls="${bodyId}" data-ps-inspector-toggle>
    <span class="ps-inspector__title">${escapeHtml(panel.title)}</span>
    <span class="ps-inspector__chevron" aria-hidden="true">⌄</span>
  </button>
  <div class="ps-inspector__body" id="${bodyId}"${collapsed ? ' hidden' : ''}>${panel.render()}</div>
</section>`;
}

/** Render a set of inspector panels into a `.ps-inspector` container. */
export function renderInspector(panels: InspectorPanel[]): string {
  const groups = new Map<string, InspectorPanel[]>();
  for (const panel of panels) {
    const key = panel.group ?? '';
    const list = groups.get(key) ?? [];
    list.push(panel);
    groups.set(key, list);
  }

  const sections = [...groups.entries()]
    .map(([group, list]) => {
      const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const heading = group ? `<h2 class="ps-inspector__group">${escapeHtml(group)}</h2>` : '';
      return heading + sorted.map(renderPanel).join('');
    })
    .join('');

  const rootAttrs = attrs({
    class: 'ps-inspector',
    'data-ps-inspector': true,
    role: 'complementary',
    'aria-label': 'Inspector',
  });
  return `<div ${rootAttrs}>${sections}</div>`;
}

/** Wire inspector panel collapse toggles. Returns a cleanup function. */
export function bindInspector(root: ParentNode | null | undefined): () => void {
  if (!root || typeof (root as Element).addEventListener !== 'function') return () => {};
  const el = root as Element;
  const onClick = (event: Event) => {
    const toggle = (event.target as Element)?.closest?.('[data-ps-inspector-toggle]');
    if (!toggle) return;
    const panel = toggle.closest('[data-ps-inspector-panel]');
    const body = panel?.querySelector('.ps-inspector__body');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    panel?.classList.toggle('ps-is-collapsed', expanded);
    if (body) {
      if (expanded) body.setAttribute('hidden', '');
      else body.removeAttribute('hidden');
    }
  };
  el.addEventListener('click', onClick);
  return () => el.removeEventListener('click', onClick);
}
