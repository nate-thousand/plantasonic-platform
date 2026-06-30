# Architecture

The Plantasonic Design System is a **token-first developer platform** — not an application.

## Layers

```
tokens/*.tokens.json     Source of truth (W3C Design Tokens)
        ↓
scripts/lib/tokens.mjs   Resolve aliases, validate, generate
        ↓
css/variables.css        Runtime CSS custom properties (--ds-*)
scss/bootstrap-theme     Bootstrap 5 SCSS variable overrides
scss/css-theme-bridge    Runtime Bootstrap ↔ CSS var mapping
        ↓
showcase/                Visual reference + Bootstrap coverage
templates/               Application starters
cli/                     Project generator (plantasonic create)
```

## Platform layers

On top of the token + Bootstrap + shell foundation, the package exposes additive, framework-agnostic platform layers. Each renders HTML strings styled by token-driven SCSS — the same model as the shell.

```
tokens/*.tokens.json
        ↓
src/primitives  → scss/primitives.scss   Layer 9 — composable layout primitives
src/components  → scss/components.scss    Layer 1 — reusable UI components
src/motion      → scss/motion.scss        Layer 3 — motion presets + tokens
src/shell       → scss/application-shell  Application Shell (composes the above)
src/instrument  → scss/instrument.scss    Creative Application Framework (instrument shell + regions)
src/creative-workspace → scss/creative-workspace.scss  Creative Workspace layouts (between shell and content)
src/app         → (uses /shell + /instrument)  createApplication() SDK
```

Public JS entrypoints (mirroring `./shell`):

| Import | Layer |
| --- | --- |
| `plantasonic-design-system/primitives` | 9 — [Layout Primitives](./LAYOUT_PRIMITIVES.md) |
| `plantasonic-design-system/components` | 1 — [Component Library](./COMPONENT_LIBRARY.md) |
| `plantasonic-design-system/motion` | 3 — [Motion System](./MOTION_SYSTEM.md) |
| `plantasonic-design-system/instrument` | Creative Application Framework — [Creative Application Guide](./CREATIVE_APPLICATION_GUIDE.md) |
| `plantasonic-design-system/creative-workspace` | Creative Workspace layouts — [Creative Workspace Guide](./CREATIVE_WORKSPACE_GUIDE.md) |
| `plantasonic-design-system/app` | Application SDK — [Application Architecture](./APPLICATION_ARCHITECTURE_GUIDE.md) |
| `plantasonic-design-system/ai` | AI-native registry, validation, generators — [AI Architecture](./AI_ARCHITECTURE.md) |
| `plantasonic-design-system/prototype` | Prototype scaffolding — [Prototype Platform](./PROTOTYPE_PLATFORM_GUIDE.md) |
| `plantasonic-design-system/platform` | Creative ecosystem — [Platform Architecture](./PLATFORM_ARCHITECTURE_GUIDE.md) |
| `plantasonic-design-system/studio` | Creative Studio — [Creative Studio Guide](./CREATIVE_STUDIO_GUIDE.md) |

Components compose primitives and motion; the shell composes components. The
**instrument** entrypoint adds a canvas-first shell variant plus regions,
transport, canvas mounts, inspector/status registries, modes, floating, and a
unified input layer. The **creative-workspace** entrypoint adds reusable layout
presets (instrument, visualizer, installation, presentation, studio) that sit
between the shell and application content — stage-first with floating overlays.
The **app** entrypoint (`createApplication()`) orchestrates the shell and these
subsystems. The **ai**, **prototype**, **platform**, and
**studio** entrypoints stack additive capabilities: machine-readable metadata,
one-command scaffolding, shared ecosystem infrastructure, and full-lifecycle
orchestration from `project.json`. `renderApplicationShell()` branches on
`variant: 'instrument'`; the standard navigation path is unchanged.
Remaining layers (icons, product patterns, accessibility framework, visual regression,
Figma pipeline) are sequenced in the [ROADMAP](../../ROADMAP.md).

## Consumption model

Applications depend on `plantasonic-design-system` and import:

1. `@ds/css/variables.css` — theme tokens at runtime
2. `@ds/scss/bootstrap-theme` — compile-time Bootstrap palette
3. `@ds/scss/css-theme-bridge` — sync Bootstrap components to CSS vars

Theme switching uses `data-theme="dark" | "light"` on `<html>` without reload.

## Boundaries

| In scope | Out of scope |
| --- | --- |
| Application chrome, tokens, Bootstrap theme | Product features, audio engine, ASCII visuals |
| Reference components in showcase | Full component library in apps |
| Starters and CLI scaffolding | Modifying existing Plantasonic apps |

See [Vision and Scope](../VISION_AND_SCOPE.md) for the canonical boundary definition.

## Version 1.0 API stability

Public APIs are frozen as of `1.0.0`. Classification:

| Tier | Location |
| --- | --- |
| Public exports | `package.json` → `exports` (CSS, SCSS, runtime) |
| SDK | `./ai`, `./prototype`, `./platform`, `./studio` |
| Generated | `generated/api-surface.json`, `generated/ai/*.json` |
| Internal | `src/shell/internal/`, `scripts/` |
| Experimental | Metadata-only patterns, engine stubs without npm packages |

No new architectural layers will be added in the 1.x series except additive
layout layers that compose existing public APIs (e.g. Creative Workspace).
Future platform work is **maintenance, performance, and documentation** —
application development moves to consuming repos.

See [Platform Audit Report](./PLATFORM_AUDIT_REPORT.md) and [Governance](./GOVERNANCE.md).
