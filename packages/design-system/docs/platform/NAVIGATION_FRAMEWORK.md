# Navigation & Workspace Framework

Milestone 3.5 — **internal** navigation infrastructure for the Application Shell.

> **Applications:** use [`plantasonic-design-system/shell`](./APPLICATION_SHELL.md) only. Do not import navigation renderers directly.

Navigation styles and markup are consumed internally by `renderApplicationShell()`. TypeScript lives in `src/shell/internal/navigation.ts` (not exported).

---

## Styles

```scss
@import 'plantasonic-design-system/scss/navigation-framework';
@import 'plantasonic-design-system/scss/application-shell';
```

Configure navigation via `ApplicationShellConfig.navigation` — see [Application Shell](./APPLICATION_SHELL.md).

---

## Public API

```typescript
import { renderApplicationShell, bindApplicationShell } from 'plantasonic-design-system/shell';
```

`renderAppShell()` is **removed**. Use `renderApplicationShell()` only.

---

## CSS primitives

| Primitive | CSS prefix | Purpose |
|-----------|------------|---------|
| App Shell | `.ps-shell` | Grid frame: topbar, sidebar, main, inspector, dock |
| Sidebar | `.ps-nav-group`, `.ps-nav-item` | Groups, nesting, badges, favorites |
| Navigation Rail | `.ps-nav-rail` | Icon-only compact nav with tooltips |
| Top Bar | `.ps-shell__topbar` | Title, breadcrumbs, search, actions |
| Command Palette | `.ps-command-palette` | ⌘K universal commands |
| Search | `.ps-search` | Fuzzy search with recent items |
| Breadcrumbs | `.ps-breadcrumbs` | Hierarchy navigation |

---

## Layout modifiers (`.ps-shell--*`)

`sidebar-collapsed`, `sidebar-hidden`, `sidebar-floating`, `inspector-hidden`, `inspector-left`, `no-dock`, `fullscreen`

---

## Showcase

Run `npm run showcase` → **Navigation** section (primitive CSS demos). Package source: `src/shell/internal/navigation.ts`.
