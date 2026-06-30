# Application Shell Framework

The public operating system layer for every Plantasonic application.

## Public API

```typescript
import {
  renderApplicationShell,
  bindApplicationShell,
  EXAMPLE_SHELL,
} from 'plantasonic-design-system/shell';
```

**Only** `renderApplicationShell()` renders the shell. Navigation infrastructure lives in `src/shell/internal/` and is not exported.

## Styles

```scss
@import 'plantasonic-design-system/css/variables.css';
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import 'plantasonic-design-system/scss/bootstrap-components';
@import 'plantasonic-design-system/scss/bootstrap-utilities';
@import 'plantasonic-design-system/scss/plantasonic-components';
@import 'plantasonic-design-system/scss/navigation-framework';
@import 'plantasonic-design-system/scss/application-shell';
```

## Bootstrap

```typescript
import { initShellTheme } from 'plantasonic-design-system/shell';

initShellTheme('dark'); // or 'light' | 'auto'

document.getElementById('root')!.innerHTML = renderApplicationShell(config, workspaceHtml);
bindApplicationShell(config);
```

## Configuration (`ApplicationShellConfig`)

| Field | Purpose |
|-------|---------|
| `navigation` | Sidebar groups, items, breadcrumbs |
| `routes[]` | Wires nav `href` + adds `route:{id}` commands to palette |
| `commands[]` | Executable actions (palette + shortcuts) |
| `docks[]` | Left/right/floating dock items |
| `panels[]` | Collapsible workspace panels |
| `theme` | `dark` \| `light` \| `auto` |
| `persistState` | Restore sidebar, dock, inspector, theme, workspace, panels |

## Starter templates

All CLI templates consume this API — no copied shell code:

| Template | Shell config | Host component |
|----------|--------------|----------------|
| `react-vite` | `src/shell-config.ts` | `src/ShellHost.tsx` |
| `react-bootstrap` | `src/shell-config.ts` | `src/ShellHost.tsx` |
| `electron` | `src/shell-config.ts` | `src/ShellHost.tsx` |
| `nextjs` | `lib/shell-config.ts` | `components/ShellHost.tsx` |

```bash
npx plantasonic create my-app
npx plantasonic create my-app --template nextjs
```

**Apps provide:** page content, business logic, engine integration.  
**Package provides:** shell infrastructure, layout, navigation UX, theme, commands.

Validate template builds: `npm run validate:templates`

## Not exported

- `renderAppShell()` — removed
- `src/shell/internal/navigation.ts` — internal only
- Showcase-only code — never import from `showcase/`

## Related

- [Navigation Framework](./NAVIGATION_FRAMEWORK.md) — internal CSS primitives
- [Theme System](./THEME_SYSTEM.md)
