# Roadmap

Milestone plan for the Plantasonic Design System.

Success is defined in [docs/VISION_AND_SCOPE.md](./docs/VISION_AND_SCOPE.md#success-criteria): every Plantasonic application feels related, Figma/tokens/CSS/components stay synchronized, and the design language scales coherently.

---

## Phase 1 — Package Extraction ✅

**Status:** Complete

- Standalone repo with tokens, CSS, SCSS, and docs
- Foundation + dark/light theme token files
- Bootstrap 5.0.2 theme overrides
- Brand guidelines, design principles, token architecture, component mapping

---

## Phase 2 — Build Pipeline ✅

**Status:** Complete

- Token build: `tokens/*.json` → `css/variables.css`
- Alias validation (`npm run tokens:validate`)
- npm scripts: `tokens:validate`, `tokens:build-css`, `build`

---

## Phase 3 — GitHub Publish ✅

**Status:** Complete

- Production README, LICENSE, CONTRIBUTING
- Package metadata for npm/GitHub consumption
- Initial public release (v1.0.0)

---

## Phase 4 — Design System Showcase ✅

**Status:** Complete (Milestone 1 — foundations + shell)

- Standalone Vite showcase in `showcase/`
- Foundations, theme switcher, token inspector, search, responsive viewport
- Design validation workflow documented

---

## Phase 4b — Showcase Milestone 2B: Bootstrap Styling Layer ✅

**Status:** Complete — [styling audit](./docs/platform/BOOTSTRAP_STYLING_AUDIT.md) passed 2026-06-28

- Three-layer Bootstrap architecture: `bootstrap-theme` → `bootstrap-components` → `bootstrap-utilities`
- Generated compile-time token SCSS (`_bootstrap-compile.generated.scss`) — no hardcoded theme values
- Full interaction states (default, hover, focus, active, selected, disabled) for all Bootstrap components
- Showcase updated with state labels; dark + light theme validation
- **Plantasonic app integration deferred** until styling validated in showcase
- Audit: `docs/platform/BOOTSTRAP_STYLING_AUDIT.md` — 12/12 categories pass; `npm run audit:bootstrap`

---

## Phase 4b — Showcase Milestone 2: Bootstrap Reference ✅

**Status:** Complete

- 12 Bootstrap category pages (buttons, forms, selection, navigation, cards, lists, tables, feedback, disclosure, floating UI, dialogs, utilities)
- Every component demonstrates interaction states (default, hover, focus, active, disabled)
- Expanded `scss/css-theme-bridge.scss` — ghost buttons, pills, validation, alerts, badges, popovers
- Bootstrap overview with coverage checklist and validation criteria
- Plantasonic components deferred to Milestone 3

---

## Phase 4d — Developer Platform ✅

**Status:** Complete (Milestone 4)

- `plantasonic` CLI — `npx plantasonic create <name> [--template]`
- Starter templates: `react-vite`, `react-bootstrap`, `nextjs`, `electron` — all consume public `plantasonic-design-system/shell` (no copied layouts)
- Template validation: `npm run validate:templates`
- Code generation: CSS vars, SCSS aliases, TypeScript types, token/component docs
- Build pipeline: `generate`, `docs`, `quality`, `test`, `release`
- Platform documentation in `docs/platform/`
- Automated validation: tokens, themes, bootstrap coverage, accessibility contrast
- Repository standards: AGENTS.md, SECURITY.md, CODE_OF_CONDUCT.md

---

## Phase 4c — Showcase Milestone 3: Plantasonic Components

**Status:** In progress

- Native `.ps-*` instrument components (controls, transport, MIDI, musical, presets, layout, feedback, visual)
- `scss/plantasonic-components.scss` — token-driven component stylesheet
- Showcase sections per category

---

## Phase 4c — Showcase Milestone 3.5: Navigation & Workspace Framework ✅

**Status:** Complete

- Reusable app shell, sidebar, navigation rail, top bar, dock, inspector, workspace layouts, panels
- Command palette (⌘K) and fuzzy search framework
- Developer configuration API — applications provide nav data, design system renders
- `scss/navigation-framework.scss` + showcase Navigation section (15 interactive pages)
- Documentation: [NAVIGATION_FRAMEWORK.md](./docs/platform/NAVIGATION_FRAMEWORK.md)

---

## Phase 4e — Application Shell Framework ✅

**Status:** Complete (Showcase Milestone 4 + public API + template migration)

- Application Shell — app frame, workspace manager, layout engine, dock framework, panel system
- Overlay manager, notification system, theme provider (dark/light/auto), command registry, keyboard framework
- Window state persistence (sidebar, dock, theme, workspace layout)
- Public package export: `plantasonic-design-system/shell` — `renderApplicationShell()`, `bindApplicationShell()`
- All starter templates consume the public shell API (no copied layouts)
- `scss/application-shell.scss` + showcase Application Shell section (11 interactive pages)
- Documentation: [APPLICATION_SHELL.md](./docs/platform/APPLICATION_SHELL.md)
- Builds on M3.5 Navigation & Workspace Framework

---

## Phase 5 — CI & Quality Gates

**Status:** Next

- GitHub Actions: validate + build on every PR
- Verify committed `css/variables.css` matches build output
- Showcase build in CI

---

## Phase 6 — App Integration ✅

**Status:** Complete (Plantasonic app v0.2.2 — first consumer)

- [Plantasonic app](https://github.com/nate-thousand/plantasonic) consumes `plantasonic-design-system/shell`
- Public `renderApplicationShell()` + `bindApplicationShell()` API in production use
- No duplicated token definitions in app repo

---

## Phase 7 — Figma Sync

**Status:** Planned

- Port Figma import scripts from Plantasonic app
- `npm run tokens:import-json` for native Figma `.tokens.json` exports
- Figma MCP pull workflow documentation

---

## Phase 8 — Light Theme Validation

**Status:** Planned

- WCAG contrast audit for light theme
- Visual regression snapshots via showcase
- Theme toggle component spec

---

## Phase 10 — Release & Deployment ✅

**Status:** Complete (v1.2.1)  
**Date:** 2026-06-28

- [x] Public Application Shell API (`plantasonic-design-system/shell`)
- [x] Plantasonic app is first consumer (Phase 6 integration)
- [x] Showcase deployed to Vercel — https://plantasonic-design-system.vercel.app
- [x] Version tags v1.2.0, v1.2.1 pushed to GitHub
- [x] 32 automated tests passing; quality gates passing

### Known issues

- Bootstrap SCSS deprecation warnings (Bootstrap 5.0.2 + Dart Sass 3)
- No npm registry publish yet — consume via GitHub or `file:` dependency
- CI/GitHub Actions pipeline not yet configured

### Next milestone

Phase 5 — CI/CD pipeline, npm publish, Figma library (Phase 9)

---

## Phase 9 — Figma Library

**Status:** Planned

- Publish Figma component library aligned to this package
- Code Connect mappings to Bootstrap classes
- Variable collections synced to `tokens/` files

---

## Phase 11 — Application Platform

Evolve the design system from a token + Bootstrap + shell framework into a complete application platform across 10 additive, backward-compatible layers. Applications should eventually contain little UI code beyond business logic.

**Release A — Foundation ✅ (v1.3.0, 2026-06-29)**

- Layer 9 — Layout primitives (`plantasonic-design-system/primitives`, `scss/primitives.scss`)
- Layer 3 — Motion system + tokens (`plantasonic-design-system/motion`, `scss/motion.scss`)
- Layer 1 — Component library, slice 1 (`plantasonic-design-system/components`, `scss/components.scss`)
- Docs: [LAYOUT_PRIMITIVES](./docs/platform/LAYOUT_PRIMITIVES.md), [COMPONENT_LIBRARY](./docs/platform/COMPONENT_LIBRARY.md), [MOTION_SYSTEM](./docs/platform/MOTION_SYSTEM.md)

**Planned releases**

- Release B — Layer 1 completion (form controls, overlays, data display) + Layer 4 Icon system (`./icons`)
- Release C — Layer 2 Layout variants via `renderApplicationShell({ variant })` (dashboard, instrument, studio, canvas, presentation, kiosk, documentation, landing, settings, workspace)
- Release D — Layer 5 Product patterns (`./patterns`)
- Release E — Layer 10 Application SDK (`./app`, `createApplication()`)
- Release F — Layer 6 Accessibility framework + Layer 7 Visual regression + CI (also closes Phase 5)
- Release G — Layer 8 Figma pipeline (aligns with Phases 7 & 9)

## Phase 12 — Creative Application Framework

Make the Design System a first-class platform for **immersive creative
software** (music, visual, video, animation, VJ, lighting, generative/AI,
creative coding, installation, simulation, performance). Reusable by any
creative application — not specific to Plantasonic. Additive and backward
compatible: the standard navigation shell is unchanged.

**Release A — Foundation ✅ (v1.4.0, 2026-06-29)**

- Instrument shell variant — `renderApplicationShell({ variant: 'instrument' })`
- Standardized regions (`plantasonic-design-system/instrument`): stage, transport, inspector, sidebar, floating, overlay, HUD, status, notification, workspace, dock, palette, browser, timeline, toolbar
- Transport framework (`renderTransport` + `bindTransport` + events)
- Canvas mount system (`mountCanvas` + Canvas2D/HTML/Image/Video adapters; custom adapter contract)
- Inspector + status registries (panels; FPS/CPU/GPU/Audio/MIDI/Memory/Renderer/Latency/Recording/Streaming presets + rAF loop)
- Display modes (edit/performance/presentation/touch), floating behavior (drag/snap/collapse/pin/remember)
- Unified input layer (pointer/key/wheel/gesture + `InputAdapter` for MIDI/gamepad/pen)
- Application SDK — `createApplication()` (`plantasonic-design-system/app`)
- Tokens + `scss/instrument.scss`; showcase "Creative Framework" sections; tests + quality gates
- Docs: [Creative Application](./docs/platform/CREATIVE_APPLICATION_GUIDE.md), [Instrument Shell](./docs/platform/INSTRUMENT_SHELL_GUIDE.md), [Workspace](./docs/platform/WORKSPACE_GUIDE.md), [Panel](./docs/platform/PANEL_GUIDE.md), [Transport](./docs/platform/TRANSPORT_GUIDE.md), [Canvas](./docs/platform/CANVAS_GUIDE.md), [Presentation Mode](./docs/platform/PRESENTATION_MODE_GUIDE.md), [Touch Mode](./docs/platform/TOUCH_MODE_GUIDE.md), [Application Architecture](./docs/platform/APPLICATION_ARCHITECTURE_GUIDE.md)

**Release B — Creative Workspace layer ✅ (v1.0.1, 2026-06-29)**

- Creative Workspace — `plantasonic-design-system/creative-workspace`, `scss/creative-workspace.scss`
- Five layout presets: instrument, visualizer, installation, presentation, studio
- Instrument workspace regions: fullscreen stage, floating transport, floating inspector, preset browser, status HUD, optional command palette
- Floating surface primitives + `bindCreativeWorkspace()` behavior wiring
- Showcase Creative Workspace sections + layout diagrams
- Docs: [Creative Workspace Guide](./docs/platform/CREATIVE_WORKSPACE_GUIDE.md), [Studio Workspace Guide](./docs/platform/STUDIO_WORKSPACE_GUIDE.md)

**Planned releases**

- Release C — Full floating engine (multi-monitor, auto-hide, magnetic snap) + workspace-preset manager (multiple saved layouts; presentation/dev/compact presets with UI)
- Release C — Device input backends: Web MIDI, Gamepad API, pen pressure/tilt — as adapters on the Release A input API
- Release D — Advanced inspector panels (automation, MIDI-learn, presets) + deeper output metrics (GPU/CPU sampling, recording/streaming integrations)
- Release E — Shipped renderer adapters (Three.js, PixiJS, ASCII) on the canvas mount API

## Phase 13 — AI-Native Platform

Evolve the Design System from a UI framework into an **AI-native platform**
capable of generating, validating, documenting, and governing every application
built on top of it. AI capabilities live in the Design System so every
application benefits automatically — applications do not build their own AI
features against the design layer. Additive and backward compatible: a new
`plantasonic-design-system/ai` export plus generated artifacts.

**Release A — Foundation ✅ (Unreleased, 2026-06-29)**

- AI metadata layer + specification (`src/ai/metadata.ts`, `METADATA_SPEC_VERSION`)
- Component / Layout / Pattern / Token / Theme registries + unified `Registry` (`src/ai/registry.ts`)
- Knowledge graph + impact analysis (`getKnowledgeGraph()`, `getImpact()`)
- Public SDK (`src/ai/sdk.ts`) — `getComponents`/`getLayouts`/`getPatterns`/`getTokens`/`getThemes`/`validateApplication`/`generateDocumentation`/`getArchitecture`
- Validation & compliance engine (`src/ai/validate.ts`)
- Official code generators (`src/ai/generators.ts`)
- Plugin architecture (`src/ai/plugin.ts`)
- AI context export `generated/ai/*.json` + generated catalogs `docs/generated/ai/`
- Docs: [AI Architecture](./docs/platform/AI_ARCHITECTURE.md), [Metadata Specification](./docs/platform/METADATA_SPECIFICATION.md), [Registry](./docs/platform/REGISTRY_GUIDE.md), [Validation](./docs/platform/VALIDATION_GUIDE.md), [Generator](./docs/platform/GENERATOR_GUIDE.md), [Plugin](./docs/platform/PLUGIN_GUIDE.md), [Application Compliance](./docs/platform/APPLICATION_COMPLIANCE_GUIDE.md)

**Planned releases**

- Release B — Semantic-versioning automation: diff registry snapshots between versions to detect breaking changes, new/deprecated APIs, and token/component/layout changes; generate migration docs and release notes automatically; fail releases on undocumented breaking changes.
- Release C — Compliance CLI + CI action (`plantasonic validate`) and an application audit report (incorrect token usage, local styling, duplicates, deprecated APIs, missing accessibility, layout/theme violations) with actionable migration output.
- Release D — Promote `planned` layouts (canvas, presentation, landing, settings, documentation) and product patterns (search, settings, asset browser, project picker, workspace, timeline, media library, wizard) from metadata-only to shipped renderers (aligns with Phase 11 Releases C & D).
- Release E — Figma reference sync on token metadata (`figmaReference`) + Code Connect mapping export (aligns with Phases 7 & 9).
- Release F — MCP server / prompt packs that expose the registry + SDK to AI agents directly.

## Phase 14 — AI Prototype Platform

Generate prototypes that **automatically inherit** the Design System — tokens, theme, layout, components, motion, accessibility, documentation, validation, and deployment. A reusable platform layer in the Design System, not inside product applications.

**Release A — Foundation ✅ (Unreleased, 2026-06-29)**

- 12 official prototype types with catalog defaults (`src/prototype/catalog.ts`)
- Prototype SDK — `createPrototype()`, brief parsing, file generation, validation (`plantasonic-design-system/prototype`)
- CLI — `plantasonic create <type> <name>`, `plantasonic spec "<brief>" --name "…"`
- Generated apps: Vite + TS, instrument or standard shell, engine placeholders, panels, docs, `vercel.json`, `npm run validate`
- Docs: [Prototype Platform](./docs/platform/PROTOTYPE_PLATFORM_GUIDE.md), [Templates](./docs/platform/PROTOTYPE_TEMPLATE_GUIDE.md), [CLI](./docs/platform/CLI_GUIDE.md), [AI Spec](./docs/platform/AI_SPEC_GUIDE.md), [SDK](./docs/platform/PROTOTYPE_SDK_GUIDE.md), [Architecture](./docs/platform/GENERATED_APP_ARCHITECTURE.md), [Migration](./docs/platform/PROTOTYPE_MIGRATION_GUIDE.md)

**Planned releases**

- Release B — Prototype build CI (`validate:prototypes` + sample `npm run build` in temp dirs); `plantasonic validate` for existing apps
- Release C — Showcase section demonstrating each prototype type; Figma starter kits per type
- Release D — Engine adapter presets (ASCII, Web Audio, Web MIDI) wired into generated `src/engines/` stubs

## Phase 15 — Unified Creative Ecosystem

Every application becomes a **lightweight client** on shared platform services. Engines, assets, plugins, workflows, and projects are installed — never duplicated inside applications.

**Release A — Foundation ✅ (Unreleased, 2026-06-29)**

- Platform SDK — `createProject()`, `installEngine()`, `registerAsset()`, `registerWorkflow()`, `validateProject()`, `publishPrototype()` (`plantasonic-design-system/platform`)
- **10 shared engines** — sound, visual, physics, particle, animation, lighting, MIDI, OSC, camera, AI (`src/platform/engines.ts`)
- **Asset registry** — images, video, audio, models, fonts, textures, presets, LUTs, particle systems
- **Preset framework** — versioning, categories, tags, import/export
- **8 built-in workflows** — import assets, generate textures/sound worlds/MIDI mappings/visual presets/docs/marketing/demo
- **12 shared services** — logging, settings, telemetry, storage, undo/redo, history, autosave, import/export, search, notifications, recent projects
- **Project registry** — `platform.json` manifest, cross-project engine usage analysis
- **Ecosystem plugins** — extends AI plugins with panels, renderers, effects, presets, workflows, validation rules
- **Deployment framework** — local, preview, production, desktop, mobile, PWA, embedded
- **Quality framework** — inherited gates, `validateProject()`, generated validate scripts
- **AI collaboration** — `buildEcosystemContext()`, `generated/ecosystem/*.json`
- CLI — `plantasonic create` uses `createProject()` (prototype + platform files)
- Docs: [Platform Architecture](./docs/platform/PLATFORM_ARCHITECTURE_GUIDE.md), [Ecosystem Plugins](./docs/platform/ECOSYSTEM_PLUGIN_GUIDE.md), [Engine Integration](./docs/platform/ENGINE_INTEGRATION_GUIDE.md), [Asset Pipeline](./docs/platform/ASSET_PIPELINE_GUIDE.md), [Workflow Automation](./docs/platform/WORKFLOW_AUTOMATION_GUIDE.md), [Project Registry](./docs/platform/PROJECT_REGISTRY_GUIDE.md), [Deployment](./docs/platform/DEPLOYMENT_GUIDE.md), [Quality Assurance](./docs/platform/QUALITY_ASSURANCE_GUIDE.md)

**Planned releases**

- Release B — Cloud preset sync + shared asset CDN; `plantasonic project list` / dependency graph CLI
- Release C — Workflow runner service (invoke workflows from CLI/CI); engine version pinning + migration
- Release D — MCP server exposing ecosystem context + project registry to AI agents

## Phase 16 — Autonomous Creative Studio

Transform the platform into an **autonomous creative operating system** — orchestrating concept through iteration while automating engineering, not human creativity.

**Release A — Foundation ✅ (Unreleased, 2026-06-29)**

- Creative Studio SDK — `createProjectFromConcept()`, `loadWorkspace()`, `generateSpecification()`, `validateWorkspace()`, `upgradeProject()`, `publishWorkspace()` (`plantasonic-design-system/studio`)
- **10-stage pipeline** — concept → specification → architecture → roadmap → generation → implementation → testing → documentation → deployment → iteration
- **project.json** — authoritative project specification (`src/studio/specification.ts`)
- **Project orchestrator** — `orchestrateProject()` coordinates generation, docs, validation (`src/studio/orchestrator.ts`)
- **Asset intelligence** — classify, tag, deduplicate, dependency map (`src/studio/asset-intelligence.ts`)
- **Knowledge repository** — ADRs, debt, principles, best practices (`src/studio/knowledge.ts`)
- **Continuous validation** — architecture, tokens, components, a11y, engine/plugin compat (`src/studio/validation.ts`)
- **Intelligent refactoring** — dependency/token/component/engine migration plans with impact preview (`src/studio/refactoring.ts`)
- **Portfolio management** — multi-project reporting, shared dependencies (`src/studio/portfolio.ts`)
- **Creative workspace** — multi-project load, switch, search, command palette (`src/studio/workspace.ts`)
- **9 automations** — create prototype, upgrade DS, docs, deploy, quality audit, etc. (`src/studio/automation.ts`)
- AI context — `generated/studio/*.json`
- Docs: [Creative Studio](./docs/platform/CREATIVE_STUDIO_GUIDE.md), [Project Specification](./docs/platform/PROJECT_SPECIFICATION_GUIDE.md), [Workspace](./docs/platform/WORKSPACE_GUIDE.md), [Automation](./docs/platform/AUTOMATION_GUIDE.md), [Knowledge Repository](./docs/platform/KNOWLEDGE_REPOSITORY_GUIDE.md), [Portfolio Management](./docs/platform/PORTFOLIO_MANAGEMENT_GUIDE.md), [Studio Migration](./docs/platform/STUDIO_MIGRATION_GUIDE.md), [Studio Architecture](./docs/platform/STUDIO_ARCHITECTURE_GUIDE.md)

**Planned releases**

- Release B — `plantasonic studio` CLI (run pipeline, automations, workspace commands)
- Release C — Visual workspace UI in showcase; real asset analysis (dimensions, duration, poly count)
- Release D — CI integration — pipeline stages as GitHub Actions; auto-iteration on spec change

## Phase 17 — Platform Stabilization & Version 1.0

**Status: Complete ✅ (1.0.0, 2026-06-29)**

Architecture complete. No new layers. Stabilize, simplify, document, test, and prepare for v1.0.

- **Public API freeze** — `generated/api-surface.json` (public / SDK / generated / experimental / internal / deprecated)
- **Platform audit** — [Platform Audit Report](./docs/platform/PLATFORM_AUDIT_REPORT.md), `npm run audit:platform`
- **7 reference examples** — [examples/](./examples/README.md); `npm run validate:examples`
- **Documentation** — [API Reference](./docs/platform/API_REFERENCE.md), [Application Development](./docs/platform/APPLICATION_DEVELOPMENT_GUIDE.md), [Release Guide](./docs/platform/RELEASE_GUIDE.md), [Governance](./docs/platform/GOVERNANCE.md)
- **Reports** — [Testing](./docs/generated/TESTING_REPORT.md), [Performance](./docs/generated/PERFORMANCE_REPORT.md)
- **150+ automated tests** — stabilization + examples + full platform coverage
- **Pattern metadata fix** — phantom `./patterns` export references corrected

**Platform marked Version 1.0 Ready.** Future work: **application development and ecosystem expansion** — not infrastructure.

## Non-Goals

Per [VISION_AND_SCOPE.md](./docs/VISION_AND_SCOPE.md#scope-boundaries):

- An application, dashboard, page builder, or theme gallery (the showcase is documentation tooling, not the design system)
- A collection of disconnected components or style experiments
- Application business logic or runtime orchestration
- Engine aesthetics (ASCII visuals, audio timbres)
- Engineering workflow templates
