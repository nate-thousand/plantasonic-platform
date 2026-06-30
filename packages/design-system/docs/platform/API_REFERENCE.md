# API Reference — Version 1.0

Official public API surface for `plantasonic-design-system@1.0.0`. Machine-readable manifest: `generated/api-surface.json`.

## Stability tiers

| Tier | Policy |
| --- | --- |
| **Public / Stable** | Semver-stable. Breaking changes require major version. |
| **SDK** | Stable programmatic APIs (`./ai`, `./prototype`, `./platform`, `./studio`). |
| **Generated** | Stable JSON exports for tooling; schema may add fields in minor releases. |
| **Experimental** | Metadata-only patterns, engine stubs — may change without major bump. |
| **Internal** | Not exported. No stability guarantee. |
| **Deprecated** | Removed in next major unless noted. |

---

## CSS & SCSS (stable)

| Import | Purpose |
| --- | --- |
| `plantasonic-design-system/css/variables.css` | Runtime `--ds-*` / `--ps-*` tokens |
| `plantasonic-design-system/scss/bootstrap-theme.scss` | Bootstrap 5 compile-time palette |
| `plantasonic-design-system/scss/css-theme-bridge.scss` | Bootstrap ↔ CSS var sync |
| `plantasonic-design-system/scss/bootstrap-components.scss` | Component styling layer |
| `plantasonic-design-system/scss/bootstrap-utilities.scss` | Utility layer |
| `plantasonic-design-system/scss/navigation-framework.scss` | Navigation chrome |
| `plantasonic-design-system/scss/application-shell.scss` | Application shell |
| `plantasonic-design-system/scss/primitives.scss` | Layout primitives |
| `plantasonic-design-system/scss/components.scss` | Component library |
| `plantasonic-design-system/scss/motion.scss` | Motion system |
| `plantasonic-design-system/scss/instrument.scss` | Instrument shell |

---

## Runtime APIs (stable)

### `./shell` — Application Shell

```typescript
import { renderApplicationShell, bindApplicationShell, EXAMPLE_SHELL } from 'plantasonic-design-system/shell';
```

### `./primitives` — Layout primitives

```typescript
import { stack, grid, sidebar, container } from 'plantasonic-design-system/primitives';
```

### `./components` — UI components

```typescript
import { button, card, panel, toolbar } from 'plantasonic-design-system/components';
```

### `./motion` — Motion system

```typescript
import { animate, transition, prefersReducedMotion } from 'plantasonic-design-system/motion';
```

### `./instrument` — Creative framework

```typescript
import { renderInstrumentShell, renderTransport, mountCanvas } from 'plantasonic-design-system/instrument';
```

### `./app` — Application SDK

```typescript
import { createApplication } from 'plantasonic-design-system/app';
```

---

## Platform SDKs (stable)

| Export | Key APIs |
| --- | --- |
| `./ai` | `getComponents`, `validateApplication`, `generateComponent`, `getImpact` |
| `./prototype` | `createPrototype`, `planFromBrief`, `validatePrototypeStructure` |
| `./platform` | `createProject`, `installEngine`, `validateProject`, `buildEcosystemContext` |
| `./studio` | `createProjectFromConcept`, `loadWorkspace`, `validateWorkspace`, `runAutomation` |

---

## CLI (stable)

```bash
plantasonic create <name> [--template react-vite|react-bootstrap|nextjs|electron]
plantasonic create <prototype-type> <name>
plantasonic spec "<brief>" --name "<display name>"
plantasonic list [prototypes|templates]
```

---

## Experimental

- Engine IDs without npm packages: `engine.physics`, `engine.particle`, `engine.osc`, `engine.camera`
- Pattern metadata (not shipped renderers): `pattern.search`, `pattern.settings`, `pattern.wizard`, etc.

---

## Deprecated

| ID | Replacement | Since |
| --- | --- | --- |
| `ai-native-design-system` package | `plantasonic-design-system` | 1.0.0 |
| Copied `AppLayout.tsx` | `./shell` Application Shell | 1.0.0 |

---

## Internal (do not import)

- `src/shell/internal/navigation.ts`
- `src/instrument/internal.ts`
- Build scripts under `scripts/`

See [GOVERNANCE.md](./GOVERNANCE.md) for API review and deprecation policy.
