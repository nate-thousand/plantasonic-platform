/**
 * Internal navigation infrastructure — not part of the public shell API.
 * Applications use renderApplicationShell() only.
 */

import type { CommandItemConfig, NavItemConfig, NavGroupConfig, NavigationConfig, BreadcrumbItem } from '../types';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderNavItem(item: NavItemConfig, nested = false): string {
  const cls = [
    'ps-nav-item',
    item.active ? 'ps-nav-item--active' : '',
    item.favorite ? 'ps-nav-item--favorite' : '',
    nested ? 'ps-nav-item--nested' : '',
  ].filter(Boolean).join(' ');

  const icon = item.icon ? `<span class="ps-nav-item__icon" aria-hidden="true">${item.icon}</span>` : '';
  const badge = item.badge ? `<span class="ps-nav-item__badge">${escapeHtml(item.badge.label)}</span>` : '';
  const tag = item.href ? 'a' : 'button';
  const href = item.href ? ` href="${escapeHtml(item.href)}"` : ' type="button"';

  let html = `<${tag} class="${cls}"${href} data-nav-id="${escapeHtml(item.id)}" data-ps-route-id="${escapeHtml(item.id)}">${icon}<span class="ps-shell__sidebar-label">${escapeHtml(item.label)}</span>${badge}</${tag}>`;

  if (item.children?.length) {
    html += item.children.map((c) => renderNavItem(c, true)).join('');
  }
  return html;
}

export function renderNavGroups(groups: NavGroupConfig[]): string {
  return groups
    .map(
      (g) => `
    <div class="ps-nav-group" role="group" aria-label="${escapeHtml(g.label)}">
      <div class="ps-nav-group__label ps-shell__sidebar-label">${escapeHtml(g.label)}</div>
      ${g.items.map((i) => renderNavItem(i)).join('')}
    </div>`,
    )
    .join('');
}

export function renderBreadcrumbs(items: BreadcrumbItem[]): string {
  return `<ol class="ps-breadcrumbs" aria-label="Breadcrumb">${items
    .map((b) => `<li>${b.href ? `<a href="${escapeHtml(b.href)}">${escapeHtml(b.label)}</a>` : escapeHtml(b.label)}</li>`)
    .join('')}</ol>`;
}

export type InternalShellRenderOptions = {
  inspectorWidth?: number;
  shellId?: string;
  layoutModifiers?: string[];
  hideInspector?: boolean;
  hideDock?: boolean;
};

function shellModifierClasses(config: NavigationConfig, modifiers: string[] = []): string {
  const fromConfig = config.layout && config.layout !== 'default' ? [config.layout] : [];
  const unique = [...new Set([...modifiers, ...fromConfig])];
  return unique.map((mod) => ` ps-shell--${mod}`).join('');
}

export function renderNavigationFrame(
  config: NavigationConfig,
  workspaceContent: string,
  options: InternalShellRenderOptions = {},
): string {
  const layoutClass = shellModifierClasses(config, options.layoutModifiers);
  const inspectorWidth = options.inspectorWidth ?? 280;
  const hideInspector = options.hideInspector === true;
  const hideDock = options.hideDock === true;

  const inspectorToggle = hideInspector
    ? ''
    : `<button type="button" class="ps-shell__topbar-action" data-ps-inspector-toggle aria-label="Toggle inspector">
          <span class="ps-shell__topbar-action-label">Inspector</span>
        </button>`;

  const inspectorAside = hideInspector
    ? ''
    : `<aside class="ps-shell__inspector" aria-label="Inspector" data-ps-inspector style="width:var(--ps-shell-inspector-width)">
        <div class="ps-section-header">Inspector</div>
        <p class="small text-muted">Contextual parameters appear here. Applications provide content slots.</p>
      </aside>`;

  const dockFooter = hideDock
    ? ''
    : `<footer class="ps-shell__dock" role="contentinfo">
        <div class="ps-transport" style="border:0;background:transparent;padding:0;min-height:auto">
          <button type="button" class="ps-transport-btn ps-transport-btn--primary" aria-label="Play">▶</button>
          <button type="button" class="ps-transport-btn" aria-label="Stop">■</button>
        </div>
        <div class="ps-shell__status"><span class="ps-status-dot ps-status-dot--active"></span> Ready</div>
      </footer>`;

  return `
    <div class="ps-shell${layoutClass}" data-ps-shell data-shell-id="${escapeHtml(options.shellId ?? 'default')}" style="--ps-shell-inspector-width:${inspectorWidth}px" data-ds-tokens="--ps-nav-height,--ps-dock-height,--ps-sidebar-width">
      <header class="ps-shell__topbar" role="banner">
        <button type="button" class="ps-shell__topbar-action d-lg-none" data-ps-sidebar-toggle aria-label="Toggle sidebar">☰</button>
        <h2 class="ps-topbar-title">${escapeHtml(config.title)}</h2>
        ${config.breadcrumbs ? renderBreadcrumbs(config.breadcrumbs) : ''}
        <div class="ps-search ps-shell__topbar-actions">
          <span class="ps-search__icon" aria-hidden="true">⌕</span>
          <input type="search" class="ps-search__input" placeholder="Search…" aria-label="Search" data-ps-search-input />
          <div class="ps-search__dropdown" data-ps-search-dropdown role="listbox"></div>
        </div>
        <button type="button" class="ps-shell__topbar-action" data-ps-command-trigger aria-label="Command palette">
          <span class="ps-shell__topbar-action-label">Commands</span> <kbd>⌘K</kbd>
        </button>
        ${inspectorToggle}
        <div class="ps-shell__topbar-action" aria-label="Profile slot" style="cursor:default">◎</div>
      </header>
      <nav class="ps-shell__sidebar" aria-label="Main navigation">${renderNavGroups(config.groups)}</nav>
      <main class="ps-shell__main" role="main">${workspaceContent}</main>
      ${inspectorAside}
      ${dockFooter}
    </div>`;
}

export function renderCommandPalette(commands: CommandItemConfig[]): string {
  const grouped = commands.reduce<Record<string, CommandItemConfig[]>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});

  const items = Object.entries(grouped)
    .map(
      ([group, cmds]) => `
      <div class="ps-command-palette__group-label">${escapeHtml(group)}</div>
      ${cmds
        .map(
          (c) =>
            `<button type="button" class="ps-command-palette__item" data-command-id="${escapeHtml(c.id)}" role="option"><span>${escapeHtml(c.label)}</span>${c.shortcut ? `<kbd>${escapeHtml(c.shortcut)}</kbd>` : ''}</button>`,
        )
        .join('')}`,
    )
    .join('');

  return `
    <div class="ps-command-palette" data-ps-command-palette role="dialog" aria-modal="true" aria-label="Command palette" hidden>
      <div class="ps-command-palette__dialog">
        <input type="text" class="ps-command-palette__input" placeholder="Type a command or search…" aria-label="Command search" data-ps-command-input autocomplete="off" />
        <div class="ps-command-palette__results" role="listbox">${items}</div>
      </div>
    </div>`;
}

export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i += 1) {
    if (t[i] === q[qi]) qi += 1;
  }
  return qi === q.length;
}

export function filterCommands(commands: CommandItemConfig[], query: string): CommandItemConfig[] {
  const q = query.trim();
  if (!q) return commands;
  return commands.filter(
    (c) =>
      fuzzyMatch(q, c.label) ||
      fuzzyMatch(q, c.group) ||
      c.keywords?.some((k) => fuzzyMatch(q, k)),
  );
}
