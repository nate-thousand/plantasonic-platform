# Plantasonic Design System

Centralized design tokens, CSS variables, Bootstrap theme, Application Shell, CLI, and starter templates for the [Plantasonic](https://github.com/nate-thousand/plantasonic) product ecosystem.

**Current release:** v1.0.1

**Showcase (production):** https://plantasonic-design-system.vercel.app

This repository is the single source of truth for visual identity — product apps consume this package instead of duplicating token definitions.

> **Platform status:** v1.0.0 stable. Public APIs frozen. Future work is application development and ecosystem expansion.

**Start here:** [Vision and Scope](./docs/VISION_AND_SCOPE.md) defines the purpose, boundaries, and decision filter for every change to this system.

---

## Purpose

Plantasonic is a generative audiovisual instrument. This design system is the visual operating system for the Plantasonic ecosystem — not another UI kit. It provides:

- **W3C Design Tokens JSON** — foundation primitives and dark/light theme semantics
- **CSS custom properties** — runtime theming via `--ds-*` and `--ps-*` variables
- **Bootstrap 5.0.2 theme** — SCSS variable overrides for component styling
- **Application Shell** — public API at `plantasonic-design-system/shell` for app chrome, navigation, commands, and theme
- **Developer platform** — CLI (`npx plantasonic create`), starter templates, code generation, quality gates
- **Documentation** — vision, brand guidelines, design principles, token architecture, component mapping

Engine aesthetics (ASCII visuals, audio) live in separate repositories. This package covers application chrome only.

---

## AI First Design Workflow

The Plantasonic Design System is the **canonical source of truth** for AI-generated interfaces — v0, Cursor, and future development tools consume tokens, components, and guidance from this repository.

```text
Figma
  ↓
Figma MCP
  ↓
Design Tokens
  ↓
Plantasonic Design System
  ↓
v0
  ↓
Cursor
  ↓
Application
```

| Step | Action |
| --- | --- |
| **Figma** | Designers define components, layouts, and semantic roles |
| **Figma MCP** | Sync exports via `npm run tokens:import-figma` |
| **Design Tokens** | Edit `tokens/*.tokens.json`; run `npm run build` |
| **Design System** | Tokens, Bootstrap theme, components, `generated/ai/` context |
| **v0** | Generate UI from [Prompt Library](./docs/PROMPTS/README.md) + [V0 Guidelines](./docs/V0_GUIDELINES.md) |
| **Cursor** | Integrate output, replace hardcoded values, validate compliance |
| **Application** | Ship UI that passes token audit and matches the showcase |

**Start here for AI UI work:**

- [AI Design Guide](./docs/AI_DESIGN_GUIDE.md) — integration workflow, token rules, theme rules
- [V0 Guidelines](./docs/V0_GUIDELINES.md) — prompt structure, accessibility, responsive, motion
- [Prompt Library](./docs/PROMPTS/README.md) — reusable prompts for dashboard, audio app, inspector, modal, and more
- [Apply Design System](./prompts/APPLY_DESIGN_SYSTEM.md) — Cursor agent instructions

Machine-readable context for AI tools: `generated/ai/index.json` — regenerate with `npm run ai:context`.

---

## Installation

### Git submodule or clone

```bash
git clone https://github.com/nate-thousand/plantasonic-design-system.git
```

### npm (local path — for monorepo or adjacent checkout)

```json
{
  "dependencies": {
    "plantasonic-design-system": "file:../plantasonic-design-system"
  }
}
```

### npm (GitHub — after publish)

```bash
npm install github:nate-thousand/plantasonic-design-system
```

No npm dependencies are required to build this package — only Node.js 18+.

---

## Developer Platform

Create a new Plantasonic application in minutes:

```bash
npx plantasonic create my-app
npx plantasonic create my-app --template nextjs
npx plantasonic list
```

### Starter templates

All templates consume the public Application Shell — no copied layout code:

| Template | Stack |
| --- | --- |
| `react-vite` | Vite + React + Application Shell (default) |
| `react-bootstrap` | React + Bootstrap + Application Shell |
| `nextjs` | Next.js App Router + Application Shell |
| `electron` | Electron + Vite + Application Shell |

Each generated app includes `shell-config.ts`, `ShellHost`, design tokens, Bootstrap theme, shell SCSS, theme switching, command palette, and an example page. Customize navigation in shell config; add pages under `src/pages/` or `app/`.

Validate template builds: `npm run validate:templates`

### Build commands

```bash
npm run tokens:validate       # alias + reference checks
npm run tokens:build-css      # regenerate css/variables.css
npm run tokens:build-bootstrap # validate Bootstrap theme + optional showcase build
npm run generate              # types, SCSS, token/component docs
npm run docs                  # documentation index
npm run audit:bootstrap       # CSS var resolution + hardcoded value scan
npm run quality               # full validation gate
npm run test                  # automated tests
npm run release -- patch      # semver bump + release notes
npm run validate:examples     # 7 reference example specs
npm run audit:platform        # API surface + platform audit
npm run showcase              # alias for showcase:dev
npm run tokens:watch          # rebuild CSS on token changes
```

Platform documentation: [docs/platform/README.md](./docs/platform/README.md)

Bootstrap styling audit: [docs/platform/BOOTSTRAP_STYLING_AUDIT.md](./docs/platform/BOOTSTRAP_STYLING_AUDIT.md)

Navigation framework: [docs/platform/NAVIGATION_FRAMEWORK.md](./docs/platform/NAVIGATION_FRAMEWORK.md)

Application shell: [docs/platform/APPLICATION_SHELL.md](./docs/platform/APPLICATION_SHELL.md)

### Application Shell (public API)

```typescript
import {
  renderApplicationShell,
  bindApplicationShell,
  EXAMPLE_SHELL,
} from 'plantasonic-design-system/shell';
```

Navigation infrastructure is internal — apps configure `ApplicationShellConfig` only. See [APPLICATION_SHELL.md](./docs/platform/APPLICATION_SHELL.md).

### Platform layers (public API)

Additive, framework-agnostic layers that render HTML strings styled by token-driven SCSS:

```typescript
import { stack, grid, sidebar } from 'plantasonic-design-system/primitives'; // Layer 9
import { button, card, panel } from 'plantasonic-design-system/components';   // Layer 1
import { animate, prefersReducedMotion } from 'plantasonic-design-system/motion'; // Layer 3
```

```scss
@import 'plantasonic-design-system/scss/primitives';
@import 'plantasonic-design-system/scss/components';
@import 'plantasonic-design-system/scss/motion';
```

- [Layout Primitives](./docs/platform/LAYOUT_PRIMITIVES.md) — composable building blocks
- [Component Library](./docs/platform/COMPONENT_LIBRARY.md) — reusable UI components
- [Motion System](./docs/platform/MOTION_SYSTEM.md) — token-driven motion + presets

These are part of the [Application Platform initiative](./ROADMAP.md#phase-11--application-platform).

### Creative Application Framework (v1.4+)

A reusable framework for **immersive creative software** (music, visual, video,
VJ, lighting, generative/AI, creative coding, installation, simulation,
performance) — an additive `instrument` shell variant, standardized regions,
transport, canvas mounts, inspector + status registries, floating panels,
display modes, a unified input layer, and a `createApplication()` SDK.

```typescript
import { createApplication } from 'plantasonic-design-system/app';
import { renderCanvasMount, METRIC_PRESETS } from 'plantasonic-design-system/instrument';

const app = createApplication({ title: 'My Instrument' });
app.registerWorkspace({ id: 'main', render: () => renderCanvasMount() })
   .registerStatus([METRIC_PRESETS.fps(() => 60)]);
await app.mount(document.getElementById('root'));
```

```scss
@import 'plantasonic-design-system/scss/instrument';
```

- [Creative Application Guide](./docs/platform/CREATIVE_APPLICATION_GUIDE.md) — start here
- [Creative Workspace](./docs/platform/CREATIVE_WORKSPACE_GUIDE.md) · [Instrument Shell](./docs/platform/INSTRUMENT_SHELL_GUIDE.md) · [Workspace](./docs/platform/WORKSPACE_GUIDE.md) · [Panels](./docs/platform/PANEL_GUIDE.md) · [Transport](./docs/platform/TRANSPORT_GUIDE.md) · [Canvas](./docs/platform/CANVAS_GUIDE.md)
- [Presentation Mode](./docs/platform/PRESENTATION_MODE_GUIDE.md) · [Touch Mode](./docs/platform/TOUCH_MODE_GUIDE.md) · [Application Architecture](./docs/platform/APPLICATION_ARCHITECTURE_GUIDE.md)

### Creative Workspace (layout presets)

Reusable layouts between the Application Shell and application content. The
stage is always dominant; transport, inspector, browser, HUD, and command
palette are floating overlays — not permanent dashboard panels.

```typescript
import { renderCreativeWorkspace, bindCreativeWorkspace } from 'plantasonic-design-system/creative-workspace';
import { renderApplicationShell } from 'plantasonic-design-system/shell';
import { renderTransport, renderCanvasMount } from 'plantasonic-design-system/instrument';

const workspace = renderCreativeWorkspace({
  preset: 'instrument',
  stage: renderCanvasMount(),
  transport: renderTransport({ state: { tempo: 120 } }),
  inspector: '<div class="ps-inspector">…</div>',
  presetBrowser: '<nav>…</nav>',
  statusHud: '<span>FPS 60</span>',
});

document.getElementById('root')!.innerHTML = renderApplicationShell(
  { variant: 'instrument', title: 'My App' },
  workspace,
);
bindCreativeWorkspace(document.querySelector('.ps-creative-workspace'));
```

Presets: `instrument` · `visualizer` · `installation` · `presentation` · `studio`

```scss
@import 'plantasonic-design-system/scss/creative-workspace';
```

- [Creative Workspace Guide](./docs/platform/CREATIVE_WORKSPACE_GUIDE.md) — presets, floating surfaces, layout diagrams

### AI-Native Platform (Phase 13)

The Design System is the authoritative, **machine-readable** source of truth.
Every component, layout, pattern, token, and theme registers structured metadata
so applications and AI agents discover, generate, validate, document, and govern
UI through one stable SDK — not the filesystem.

```typescript
import {
  getComponents,
  getTokens,
  getKnowledgeGraph,
  getImpact,
  validateApplication,
  generateComponent,
} from 'plantasonic-design-system/ai';

const report = validateApplication([{ path: 'app.css', content }]); // compliance
const impact = getImpact('token.color.primary.default');            // impact analysis
const files = generateComponent({ name: 'level-meter' });           // scaffolding
```

Non-TypeScript consumers read the published context export:

```typescript
import manifest from 'plantasonic-design-system/generated/ai/index.json' assert { type: 'json' };
```

- [AI Architecture](./docs/platform/AI_ARCHITECTURE.md) — start here · [Metadata Specification](./docs/platform/METADATA_SPECIFICATION.md) · [Registry](./docs/platform/REGISTRY_GUIDE.md)
- [Validation](./docs/platform/VALIDATION_GUIDE.md) · [Generators](./docs/platform/GENERATOR_GUIDE.md) · [Plugins](./docs/platform/PLUGIN_GUIDE.md) · [Application Compliance](./docs/platform/APPLICATION_COMPLIANCE_GUIDE.md)

```bash
npm run ai:context   # regenerate generated/ai/*.json + docs/generated/ai/*.md
```

### AI Prototype Platform (Phase 14)

Scaffold prototypes that inherit the full Design System in one command:

```bash
npx plantasonic create generative-art flower-study
npx plantasonic spec "Audio reactive installation with MIDI" --name "Bloom Room"
```

```typescript
import { createProject } from 'plantasonic-design-system/platform';

createProject({
  type: 'audio-reactive-installation',
  name: 'Bloom Room',
  sound: true,
  midi: true,
  touch: true,
});
// Adds platform.json, docs/PLATFORM.md, src/platform/services.ts, engine deps
```

- [Prototype Platform Guide](./docs/platform/PROTOTYPE_PLATFORM_GUIDE.md) · [CLI](./docs/platform/CLI_GUIDE.md) · [AI Spec](./docs/platform/AI_SPEC_GUIDE.md) · [SDK](./docs/platform/PROTOTYPE_SDK_GUIDE.md)

### Unified Creative Ecosystem (Phase 15)

Every application is a lightweight client — install engines, reference shared assets, invoke workflows, use platform services:

```typescript
import {
  createProject,
  installEngine,
  registerAsset,
  registerWorkflow,
  validateProject,
  buildEcosystemContext,
} from 'plantasonic-design-system/platform';

const spec = installEngine('engine.sound');
registerAsset('audio', 'Ambient Loop', 'assets://audio/loop.wav');
```

- [Platform Architecture](./docs/platform/PLATFORM_ARCHITECTURE_GUIDE.md) · [Engines](./docs/platform/ENGINE_INTEGRATION_GUIDE.md) · [Assets](./docs/platform/ASSET_PIPELINE_GUIDE.md) · [Workflows](./docs/platform/WORKFLOW_AUTOMATION_GUIDE.md)
- [Project Registry](./docs/platform/PROJECT_REGISTRY_GUIDE.md) · [Deployment](./docs/platform/DEPLOYMENT_GUIDE.md) · [Quality](./docs/platform/QUALITY_ASSURANCE_GUIDE.md) · [Ecosystem Plugins](./docs/platform/ECOSYSTEM_PLUGIN_GUIDE.md)

```bash
npm run generate:ecosystem-context   # generated/ecosystem/*.json for AI tools
```

### Autonomous Creative Studio (Phase 16)

Orchestrate the full creative lifecycle — concept through iteration — with `project.json` as the authoritative specification:

```typescript
import {
  createProjectFromConcept,
  loadWorkspace,
  validateWorkspace,
  runAutomation,
} from 'plantasonic-design-system/studio';

const result = createProjectFromConcept({
  name: 'Bloom Room',
  brief: 'Audio reactive installation with MIDI',
});
// result.spec, result.files, result.manifest — reproducible from project.json
```

- [Creative Studio](./docs/platform/CREATIVE_STUDIO_GUIDE.md) · [Project Specification](./docs/platform/PROJECT_SPECIFICATION_GUIDE.md) · [Workspace](./docs/platform/WORKSPACE_GUIDE.md) · [Automation](./docs/platform/AUTOMATION_GUIDE.md)
- [Knowledge Repository](./docs/platform/KNOWLEDGE_REPOSITORY_GUIDE.md) · [Portfolio](./docs/platform/PORTFOLIO_MANAGEMENT_GUIDE.md) · [Studio Architecture](./docs/platform/STUDIO_ARCHITECTURE_GUIDE.md)

```bash
npm run generate:studio-context   # generated/studio/*.json for AI tools
```

### Version 1.0 — Platform Ready

Public APIs are frozen. See [API Reference](./docs/platform/API_REFERENCE.md) and `generated/api-surface.json`.

- [Application Development Guide](./docs/platform/APPLICATION_DEVELOPMENT_GUIDE.md) · [Release Guide](./docs/platform/RELEASE_GUIDE.md) · [Governance](./docs/platform/GOVERNANCE.md)
- [Platform Audit Report](./docs/platform/PLATFORM_AUDIT_REPORT.md) · [Reference Examples](./examples/README.md)

---

## Design System Showcase

The **Showcase** is the canonical visual reference for every Plantasonic application. Implement every new design feature here first — before shipping product UI.

```bash
# Install showcase dependencies (first time)
cd showcase && npm install

# Development server
npm run showcase:dev

# Production build
npm run showcase:build

# Preview production build
npm run showcase:preview
```

Open `http://localhost:5173` after running `showcase:dev`.

### Vanilla HTML demo

A lighter **copy-paste reference** for foundations, platform components, and Bootstrap — no TypeScript:

```bash
cd demo && npm install
npm run demo:dev    # from repository root
```

See [`demo/README.md`](./demo/README.md).

### What the showcase includes

**Milestone 4 — Application Shell Framework (complete):**

- Full application operating system: app frame, workspace manager, dock framework, panel system, overlay manager, notification system, theme provider, command registry, keyboard framework, window state persistence
- Developer API — `ApplicationShellConfig` + `renderApplicationShell()`
- Styles: `scss/application-shell.scss` (extends navigation-framework)

**Milestone 3.5 — Navigation & Workspace Framework (complete):**

- Reusable app shell, sidebar, navigation rail, top bar, dock, inspector, workspace, panels
- Command palette (⌘K), fuzzy search, breadcrumbs, keyboard navigation
- Developer API — applications configure navigation with data; design system renders everything
- Styles: `scss/navigation-framework.scss`

**Milestone 2B — Bootstrap Styling Layer (complete):**

- Three-layer SCSS: `bootstrap-theme` → `bootstrap-components` → `bootstrap-utilities`
- Every Bootstrap component styled from tokens — no default Bootstrap blue/gray
- Full interaction states with showcase state labels

**Milestone 2 — Bootstrap Reference (complete):**

- 12 Bootstrap category pages with full interaction state coverage
- Bootstrap Overview with coverage checklist
- Theme switching (dark/light) without reload via css-theme-bridge

**Foundations + tooling:**

- Design tokens, colors, typography, spacing, radius, shadows, motion
- Token inspector, search, responsive viewport, WCAG contrast audit
- Developer panel with git commit and file locations

**Milestone 3 — Plantasonic components:** planned (knob, dock, stage, presets, etc.)

### Design validation workflow

Before implementing UI in any Plantasonic application:

1. Find or create the matching section in the showcase
2. Match token usage and layout patterns exactly
3. Switch themes and verify both dark and light
4. Use token inspector to confirm CSS variables
5. Compare your implementation side-by-side with the showcase
6. Do not ship UI that diverges without explicit design review

The showcase imports **only** from this repository (`css/variables.css`, `scss/bootstrap-theme.scss`, `tokens/*.json`). No Plantasonic app code is imported.

---

## Repository Structure

```text
plantasonic-design-system/
├── tokens/                  W3C Design Tokens JSON (source of truth)
├── css/variables.css        Generated CSS custom properties
├── scss/bootstrap-theme.scss       Bootstrap $variable overrides (compile-time)
├── scss/bootstrap-components.scss  Runtime component styling (CSS vars)
├── scss/bootstrap-utilities.scss   Utility class overrides
├── scripts/                 Token build pipeline
├── showcase/                Design system showcase app (Vite)
├── docs/                    Brand, principles, architecture, AI guides
├── docs/PROMPTS/            Reusable v0/Cursor prompt library
├── prompts/                 AI agent instructions
└── package.json
```

---

## Token Architecture

Three-layer model:

```text
foundation.tokens.json     Primitives — palette, spacing, typography, motion
        ↓
theme.dark.tokens.json     Semantic roles — dark instrument theme (default)
theme.light.tokens.json    Semantic roles — light variant
        ↓
css/variables.css            Runtime CSS custom properties
scss/bootstrap-theme.scss    Bootstrap SCSS variable overrides
```

| Prefix | Usage |
| ------ | ----- |
| `--ds-*` | Design system semantic tokens |
| `--ps-*` | Product layout tokens (nav height, dock, touch targets) |

See [docs/TOKEN_ARCHITECTURE.md](./docs/TOKEN_ARCHITECTURE.md) for naming rules and Figma sync guidance.

---

## Build Commands

`css/variables.css` is generated — do not edit manually.

```bash
# Validate token aliases (no file write)
npm run tokens:validate

# Regenerate css/variables.css
npm run tokens:build-css

# Full build — generate CSS, then validate
npm run build
```

After editing token JSON, run `npm run build` and commit both token files and regenerated CSS.

---

## Consuming the Design System

### CSS variables (any stack)

```html
<link rel="stylesheet" href="node_modules/plantasonic-design-system/css/variables.css" />
```

```css
.panel {
  background: var(--ds-color-surface-raised);
  color: var(--ds-color-text-primary);
  border-radius: var(--ds-radius-default);
}
```

### Bootstrap 5 (SCSS)

```scss
@import 'plantasonic-design-system/scss/bootstrap-theme';
@import 'bootstrap/scss/bootstrap';
@import 'plantasonic-design-system/scss/bootstrap-components';
@import 'plantasonic-design-system/scss/bootstrap-utilities';
```

Also link `css/variables.css` for runtime theming. `css-theme-bridge.scss` re-exports components + utilities for backward compatibility.

### Theme switching

```html
<html data-theme="dark">   <!-- default -->
<html data-theme="light">
```

### AI-assisted development

Use the [AI First Design Workflow](#ai-first-design-workflow) above. Agent instructions: [prompts/APPLY_DESIGN_SYSTEM.md](./prompts/APPLY_DESIGN_SYSTEM.md).

---

## Release Workflow

1. Update token JSON in `tokens/`
2. Run `npm run build` — validation must pass
3. Update `CHANGELOG.md` with version and date
4. Bump `version` in `package.json` (semver)
5. Commit token JSON + regenerated CSS together
6. Tag: `git tag v1.x.x`
7. Push to GitHub: `git push origin main --tags`

Pre-release checklist:

- [ ] `npm run build` passes
- [ ] `CHANGELOG.md` updated
- [ ] `package.json` version bumped
- [ ] No manual edits to `css/variables.css`

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

- Edit tokens in `tokens/` — not CSS directly
- Run `npm run build` before committing
- Keep changes scoped to design system assets

---

## Documentation

| Doc | Contents |
| --- | -------- |
| [VISION_AND_SCOPE.md](./docs/VISION_AND_SCOPE.md) | **Start here** — purpose, boundaries, decision filter, success criteria |
| [COLORS.md](./docs/COLORS.md) | Semantic color roles and values |
| [TYPOGRAPHY.md](./docs/TYPOGRAPHY.md) | Font families and type scale |
| [SPACING.md](./docs/SPACING.md) | Spacing scale and product layout tokens |
| [PATTERNS.md](./docs/PATTERNS.md) | App shell and interaction patterns |
| [BRAND_GUIDELINES.md](./docs/BRAND_GUIDELINES.md) | Color identity, typography, visual hierarchy |
| [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md) | Implementation rules — tokens, motion, accessibility |
| [TOKEN_ARCHITECTURE.md](./docs/TOKEN_ARCHITECTURE.md) | Naming, layers, theme switching |
| [COMPONENT_MAPPING.md](./docs/COMPONENT_MAPPING.md) | Bootstrap class mapping |
| [AI_DESIGN_GUIDE.md](./docs/AI_DESIGN_GUIDE.md) | **AI UI integration** — v0 → Cursor workflow, token rules, themes |
| [V0_GUIDELINES.md](./docs/V0_GUIDELINES.md) | v0 prompt structure, accessibility, motion, dark/retro themes |
| [PROMPTS/](./docs/PROMPTS/README.md) | Reusable AI prompt library (dashboard, audio app, inspector, …) |
| [APPLY_DESIGN_SYSTEM.md](./prompts/APPLY_DESIGN_SYSTEM.md) | Cursor agent instructions |
| [AI_ARCHITECTURE.md](./docs/platform/AI_ARCHITECTURE.md) | AI-native platform — registry, SDK, validation, generators |
| [METADATA_SPECIFICATION.md](./docs/platform/METADATA_SPECIFICATION.md) | Machine-readable metadata contract |

---

## Ecosystem

```text
plantasonic-design-system   →  tokens, theme, docs (this repo)
plantasonic                   →  product app (future consumer)
plantasia-sound-engine        →  audio capability
ascii-visual-engine           →  visual capability
```

Do not copy token source into product repos. Reference this package.

---

## License

[MIT](./LICENSE) © 2026 Nate Thousand
