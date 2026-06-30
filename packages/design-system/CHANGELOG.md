# Changelog

All notable changes to the Plantasonic Design System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] — 2026-06-30

### Added

- **AI First integration** — documentation for AI-generated UI workflow (Figma → MCP → tokens → v0 → Cursor → application).
- **[AI Design Guide](./docs/AI_DESIGN_GUIDE.md)** — integrating v0 output, token replacement rules, component/token/theme rules, acceptable and unacceptable patterns.
- **[V0 Guidelines](./docs/V0_GUIDELINES.md)** — v0 prompt structure, token usage, layout, accessibility, responsive, motion, dark and retro themes.
- **[Prompt Library](./docs/PROMPTS/README.md)** — reusable starter prompts: dashboard, audio app, game UI, settings panel, inspector, modal, toolbar, sidebar, mobile layout, retro terminal.
- **Vanilla HTML component demo** — `demo/` directory with sidebar navigation, theme switching, foundations, platform components, and all Bootstrap categories. Run `npm run demo:dev`.
- **Figma token import** — `npm run tokens:import-figma` reads `tokens/figma-source/` exports and regenerates foundation + theme token files.

### Fixed

- **Application shell showcase** — shell demos no longer hijack showcase theme or global keyboard shortcuts on every route; added `SHOWCASE_SHELL` config (single workspace, no persisted state); improved shell surface contrast and nav active states.

## [1.0.0] — 2026-06-29

### Version 1.0 — Production release

First stable release of the complete Plantasonic Design System platform. Public APIs frozen in `generated/api-surface.json`. Architecture complete — future work is application development and ecosystem expansion.

Promoted from `1.0.0-rc.1` after full verification: build, quality, 163 tests, 7 reference examples, platform audit, showcase build.

See [1.0.0-rc.1](#100-rc1--2026-06-29) for full stabilization and platform feature history.

## [1.0.0-rc.1] — 2026-06-29

### Platform stabilization — Version 1.0 Ready

Architecture complete. No new layers. Stabilization, audit, documentation, examples, and API freeze for production release.

- **Version 1.0 Release Candidate** — `1.0.0-rc.1`
- **Public API freeze** — `generated/api-surface.json` classifies public, SDK, generated, experimental, internal, deprecated exports
- **Platform audit** — `docs/platform/PLATFORM_AUDIT_REPORT.md`, `docs/generated/PLATFORM_AUDIT.json`, `npm run audit:platform`
- **7 reference examples** — dashboard, instrument, creative-studio, generative-art, audio-reactive-installation, presentation, portfolio (`examples/`); `npm run validate:examples`
- **Documentation** — API Reference, Application Development Guide, Release Guide, Governance, Platform Audit Report
- **Reports** — Testing Report, Performance Report (`docs/generated/`)
- **Tests** — `tests/stabilization.test.mjs`, `tests/examples.test.mjs`; platform deployment + studio validation coverage
- **Fix** — pattern metadata `source` corrected from phantom `./patterns` to `./ai`
- **Quality gate** — requires `./shell`, `./css/variables.css`, 7 examples, `api-surface.json`

Future work transitions from infrastructure development to **application development and ecosystem expansion**.

### Added — Autonomous Creative Studio (Phase 16)

Orchestrates the full creative lifecycle from concept through iteration — automating engineering, documentation, testing, and project coordination while preserving human creative intent.

- **Creative Studio SDK** — `createProjectFromConcept()`, `orchestrateProject()`, `loadWorkspace()`, `validateWorkspace()`, `upgradeProject()`, `publishWorkspace()`, `runAutomation()` (`plantasonic-design-system/studio`)
- **10-stage pipeline** — structured artifacts at every stage (`src/studio/pipeline.ts`)
- **project.json** — authoritative specification with engines, layouts, components, AI capabilities, quality requirements (`src/studio/specification.ts`)
- **Project orchestrator** — reproducible generation from spec (`src/studio/orchestrator.ts`)
- **Asset intelligence** — classify, tag, deduplicate assets (`src/studio/asset-intelligence.ts`)
- **Knowledge repository** — decisions, debt, principles, practices (`src/studio/knowledge.ts`)
- **Continuous validation** — extended gates + workspace audit (`src/studio/validation.ts`)
- **Intelligent refactoring** — migration plans with impact analysis (`src/studio/refactoring.ts`)
- **Portfolio management** — ecosystem-wide reporting (`src/studio/portfolio.ts`)
- **Creative workspace** — multi-project development (`src/studio/workspace.ts`)
- **9 automations** — create prototype, upgrade DS, docs, deploy, quality audit (`src/studio/automation.ts`)
- **AI context** — `generated/studio/*.json`
- **Docs** — Creative Studio, Project Specification, Workspace, Automation, Knowledge Repository, Portfolio Management, Studio Migration, Studio Architecture guides
- **Tests** — `tests/studio.test.mjs`; quality gate asserts studio layer

### Added — Unified Creative Ecosystem (Phase 15)

Every application becomes a lightweight client on shared platform infrastructure. Engines, assets, plugins, workflows, services, and documentation are installed — never duplicated.

- **Platform SDK** — `createProject()`, `installEngine()`, `registerAsset()`, `registerWorkflow()`, `createPlatformServices()`, `validateProject()`, `publishPrototype()` (`plantasonic-design-system/platform`)
- **10 shared engines** — catalog with npm resolution and transitive dependencies (`src/platform/engines.ts`)
- **Asset registry** — centralized assets with kind/tag query (`src/platform/assets.ts`)
- **Preset framework** — versioning, categories, import/export (`src/platform/presets.ts`)
- **8 built-in workflows** — import assets, generate textures, sound worlds, MIDI mappings, visual presets, documentation, marketing assets, demos (`src/platform/workflows.ts`)
- **12 shared services** — logging, settings, telemetry, storage, undo/redo, history, autosave, file import/export, search, notifications, recent projects (`src/platform/services.ts`)
- **Project registry** — `ProjectManifest`, `platform.json`, cross-project engine usage (`src/platform/projects.ts`)
- **Ecosystem plugins** — extends AI plugin host with panels, renderers, effects, presets, workflows, validation rules (`src/platform/ecosystem-plugins.ts`)
- **Deployment framework** — targets (local/preview/production/desktop/mobile/pwa/embedded), Vercel config, auto-generated deployment docs (`src/platform/deployment.ts`)
- **Quality framework** — `QUALITY_GATES`, `validateProjectFiles()`, generated validate scripts (`src/platform/quality.ts`)
- **AI collaboration** — `buildEcosystemContext()`, `exportProjectContext()`, `generated/ecosystem/*.json`
- **CLI** — `plantasonic create` / `spec` now use `createProject()` (adds platform manifest + services)
- **Docs** — Platform Architecture, Ecosystem Plugins, Engine Integration, Asset Pipeline, Workflow Automation, Project Registry, Deployment, Quality Assurance guides
- **Tests** — `tests/platform.test.mjs`; quality gate asserts platform layer

### Added — AI Prototype Platform (Phase 14)

Reusable platform layer so every new prototype automatically inherits the Design System. Not built inside applications — consumed via CLI and SDK.

- **12 official prototype types** — audio-reactive-installation, generative-art, visual-synth, music-instrument, ai-assistant, interactive-object, lighting-controller, portfolio-demo, presentation-prototype, creative-tool, data-visualization, research-experiment (`src/prototype/catalog.ts`)
- **Prototype SDK** — `createPrototype()`, `createPrototypeFromBrief()`, `scaffoldPrototype()`, `planFromBrief()`, `validatePrototype()` (`plantasonic-design-system/prototype`)
- **AI spec workflow** — brief → type, layout, features, panels, engines, roadmap, validation checklist (`src/prototype/spec-parser.ts`)
- **File generator** — tokens, theme, instrument or standard shell, components, motion, a11y defaults, README/ROADMAP/CHANGELOG, Vercel config, validate script
- **CLI** — `plantasonic create <type> <name>`, `plantasonic spec "<brief>" --name "…"`, `plantasonic list prototypes`
- **Validation** — `validateGeneratedFiles`, `validatePrototypeStructure`, `npm run validate:prototypes`
- **Docs** — Prototype Platform, Template, CLI, AI Spec, SDK, Generated App Architecture, Migration guides
- **Tests** — `tests/prototype.test.mjs` (9 cases); quality gate asserts prototype platform

### Added — AI-Native Platform (Phase 13)

The Design System becomes the foundation for AI-assisted design, development,
documentation, testing, and maintenance. Fully additive and backward compatible:
a new `plantasonic-design-system/ai` export plus generated artifacts; no existing
token, class name, or export changed.

- **AI metadata layer** — `src/ai/metadata.ts`: a versioned specification (`METADATA_SPEC_VERSION`) describing purpose, category, status, dependencies, variants, slots, props, events, accessibility, responsive + motion behavior, examples, migration history, and breaking changes for every element. `defineComponent`/`defineLayout`/`definePattern`/`defineToken`/`defineTheme` authoring helpers.
- **Registries** — searchable Component (29), Layout (9), Pattern (12), Token (141), and Theme (2) registries unified behind `Registry` (`src/ai/registry.ts`). Applications and AI tools discover elements through the registry, not the filesystem.
- **Knowledge graph + impact analysis** — `getKnowledgeGraph()` (193 nodes / relationship edges) and `getImpact(id)` for downstream impact before changes.
- **Public SDK** — `getComponents`/`getLayouts`/`getPatterns`/`getTokens`/`getThemes`/`query`/`getRegistry`/`getKnowledgeGraph`/`getImpact`/`getArchitecture`/`validateApplication`/`generateDocumentation`. Consumed identically by applications, build tools, and AI assistants.
- **Validation & compliance engine** — `validateApplication()` audits source for hardcoded colors, unknown/deprecated tokens, deprecated APIs, raw color functions, and duplicate components; configurable rule severities; `formatValidationReport()`.
- **Code generators** — `generateComponent`/`generateLayout`/`generatePattern`/`generateTheme`/`generateWorkspace`/`generateApplication`/`generatePlugin` produce convention-following, token-driven scaffolds that self-register.
- **Plugin architecture** — `definePlugin` + `createPluginHost` let plugins contribute components, layouts, patterns, themes, tokens, commands, documentation, and AI integrations without modifying core source.
- **AI context export** — `generated/ai/*.json` (components, layouts, patterns, tokens, themes, registry, knowledge-graph, architecture, compliance, index) give AI tools complete understanding without parsing source. Wired into `npm run build`; standalone via `npm run ai:context`.
- **Generated documentation** — registry-derived catalogs in `docs/generated/ai/` (component, layout, pattern catalogs + token reference + architecture). Removes hand-maintained duplication.
- **Package exports** — `./ai` and `./generated/ai/*.json`. New scripts: `generate:ai-tokens`, `generate:ai-context`, `generate:ai-docs`, `ai:context`.
- **Docs** — [AI Architecture](./docs/platform/AI_ARCHITECTURE.md), [Metadata Specification](./docs/platform/METADATA_SPECIFICATION.md), [Registry Guide](./docs/platform/REGISTRY_GUIDE.md), [Validation Guide](./docs/platform/VALIDATION_GUIDE.md), [Generator Guide](./docs/platform/GENERATOR_GUIDE.md), [Plugin Guide](./docs/platform/PLUGIN_GUIDE.md), [Application Compliance Guide](./docs/platform/APPLICATION_COMPLIANCE_GUIDE.md).
- **Tests** — `tests/ai.test.mjs` (19 cases) covering registry, knowledge graph, SDK, validation, generators, plugins, and the context export. Quality gate asserts the AI layer is present.

## [1.4.0] — 2026-06-29

Creative Application Framework — foundation increment of a reusable platform for
immersive creative software (music, visual, video, VJ, lighting, generative/AI,
creative coding, installation, simulation, performance). Fully additive and
backward compatible: `renderApplicationShell()` with no `variant` is unchanged,
and no existing token, class name, or export changed.

### Added

- **Instrument shell variant** — `renderApplicationShell({ variant: 'instrument' })`: edge-to-edge, canvas-first shell with minimal chrome, floating controls, HUD/status overlays, safe-area support, and four display modes. New `ShellVariant`, `ShellMode`, and `InstrumentConfig` types (all optional on `ApplicationShellConfig`). See [INSTRUMENT_SHELL_GUIDE.md](./docs/platform/INSTRUMENT_SHELL_GUIDE.md).
- **Creative Application Framework** — new `plantasonic-design-system/instrument` export:
  - **Regions** — 15 standardized region renderers (stage, transport, inspector, sidebar, floating, overlay, HUD, status, notification, workspace, dock, palette, browser, timeline, toolbar) with landmarks/ARIA.
  - **Transport** — `renderTransport` + `bindTransport` + `TransportState`, dispatching `ps-transport-*` CustomEvents (DS UI, app behavior).
  - **Canvas mounts** — `mountCanvas` adapter contract with built-in Canvas2D/HTML/Image/Video adapters and a custom-adapter API for WebGL/Three/Pixi/ASCII/SVG/Mixed; ResizeObserver + visibility + DPR lifecycle.
  - **Inspector + status registries** — `createInspector()` panel registry and `createMetrics()` with FPS/CPU/GPU/Audio/MIDI/Memory/Renderer/Latency/Recording/Streaming presets, `startMetricsLoop()` (rAF), and a built-in FPS sampler.
  - **Modes + floating + input** — `setShellMode`/`getShellMode`/`cycleShellMode`; `bindFloating` (drag/snap/collapse/pin/remember); `createInputManager` (normalized pointer/key/wheel/gesture) with an `InputAdapter` contract for MIDI/gamepad/pen.
- **Application SDK** — new `plantasonic-design-system/app` export: `createApplication()` with `registerWorkspace`/`registerPanels`/`registerInspector`/`registerTransport`/`registerStatus`/`registerCommands`/`registerInput`/`setMode` and an async `mount()`/`unmount()` lifecycle that wires the shell + transport + floating + inspector + metrics + input. See [APPLICATION_ARCHITECTURE_GUIDE.md](./docs/platform/APPLICATION_ARCHITECTURE_GUIDE.md).
- **Instrument tokens + SCSS** — additive `product.touch-target-large`, `product.instrument-gutter`, `product.floating-panel-min`, `product.hud-opacity` (new `--ps-*` CSS variables), and `scss/instrument.scss` (frame, regions, edit/performance/presentation/touch modes, floating affordances, touch targets, safe-area, reduced-motion). Reuses existing `.ps-*` instrument surfaces.
- **Package exports** — `./instrument`, `./app`, `./scss/instrument.scss`.
- **Showcase** — new "Creative Framework" group: Instrument Shell, Workspace Regions, Transport, Canvas System, Floating UI, Display Modes, Input & Output, Application SDK.
- **Docs** — nine new guides under `docs/platform/` (Creative Application, Instrument Shell, Workspace, Panel, Transport, Canvas, Presentation Mode, Touch Mode, Application Architecture) plus a MIGRATION section.
- **Tests + quality** — `instrument-shell`, `instrument`, `app-sdk`, and `input` test suites (render/token/a11y/reduced-motion + standard-path backward compatibility); `quality-check.mjs` extended for the framework files, exports, and showcase section.

### Changed

- `renderApplicationShell()` now branches to the instrument shell only when `variant === 'instrument'`; the standard navigation path is otherwise byte-for-byte unchanged.

## [1.3.0] — 2026-06-29

Platform foundation — first increment of the application-platform evolution. Fully additive and backward compatible: no existing API, token value, class name, or export changed.

### Added

- **Layout primitives (Layer 9)** — new `plantasonic-design-system/primitives` export with 17 composable, token-driven primitives (`stack`, `inline`, `cluster`, `grid`, `sidebar`, `split`, `frame`, `center`, `cover`, `container`, `surface`, `section`, `region`, `viewport`, `spacer`, `inset`, `flow`) and `scss/primitives.scss`. See [LAYOUT_PRIMITIVES.md](./docs/platform/LAYOUT_PRIMITIVES.md).
- **Component library (Layer 1, slice 1)** — new `plantasonic-design-system/components` export with `button`, `iconButton`, `toolbar`, `toolbarGroup`, `panel`, `panelHeader`, `card`, `section`, `controlGroup`, `badge`, `statusIndicator` (and `surface` re-exported from primitives), plus `scss/components.scss`. Reuses existing `.ps-*` and Bootstrap surfaces. See [COMPONENT_LIBRARY.md](./docs/platform/COMPONENT_LIBRARY.md).
- **Motion system (Layer 3)** — new `plantasonic-design-system/motion` export with `animate()`, presets, `transition()`, `prefersReducedMotion()`, and an optional injectable GSAP adapter, plus `scss/motion.scss`. See [MOTION_SYSTEM.md](./docs/platform/MOTION_SYSTEM.md).
- **Motion tokens** — additive `transition.instant`/`transition.slower`, `ease.standard`/`emphasized`/`spring`, and a semantic `motion.duration.*` / `motion.easing.*` group, generating new `--ds-motion-*` CSS variables.
- **Showcase** — new Platform Library sections: Layout Primitives, Components, Motion System (interactive, dark/light).
- **Tests** — `tests/primitives.test.mjs`, `tests/components.test.mjs`, `tests/motion.test.mjs` (render, token usage, accessibility, reduced motion). Suite now 59 tests. Quality gate extended to cover the new layers.

## [1.2.2] — 2026-06-28

### Fixed

- **Shell layout modifiers** — `regions.inspector: false` and `regions.dock: false` now apply both `inspector-hidden` and `no-dock` classes (previously only the first modifier was used)
- **Shell render** — omit inspector column, dock footer, and inspector toggle when regions are disabled

## [1.2.1] — 2026-06-28

Patch release — shell TypeScript compatibility for strict consumers and Plantasonic app integration complete.

### Fixed

- **Shell TypeScript strictness** — `exactOptionalPropertyTypes` compatibility in `src/shell/` (config merge, routes clone, panel states, theme cycle, render options)

### Changed

- **Phase 6 complete** — [Plantasonic app](https://github.com/nate-thousand/plantasonic) is the first consumer of the public Application Shell API

### Deployment

- **Showcase (production):** https://plantasonic-design-system.vercel.app
- **Build:** `npm run build && npm run showcase:build` → `showcase/dist`
- **Vercel:** `vercel.json` at repo root

### Known issues

- Bootstrap SCSS deprecation warnings during build (Bootstrap 5.0.2 + Dart Sass 3)
- No npm registry publish yet — consume via GitHub or `file:` dependency
- CI/GitHub Actions pipeline not yet configured (Phase 5)

## [1.2.0] — 2026-06-28

Developer platform release — public Application Shell API, CLI, starter templates, navigation framework, and Bootstrap styling layer.

### Added

- **Application Shell (public API)** — `plantasonic-design-system/shell` exports `renderApplicationShell()`, `bindApplicationShell()`, theme provider, command registry, window state persistence; internal navigation in `src/shell/internal/`; [APPLICATION_SHELL.md](./docs/platform/APPLICATION_SHELL.md)
- **Starter templates** — all four CLI templates (`react-vite`, `react-bootstrap`, `nextjs`, `electron`) consume the public shell API; no copied layouts; `npm run validate:templates`
- **Navigation & Workspace Framework** — sidebar, rail, top bar, dock, inspector, panels, command palette (⌘K), fuzzy search; `scss/navigation-framework.scss`; showcase section; [NAVIGATION_FRAMEWORK.md](./docs/platform/NAVIGATION_FRAMEWORK.md)
- **Bootstrap Styling Layer** — three-layer SCSS (`bootstrap-theme`, `bootstrap-components`, `bootstrap-utilities`); generated compile manifest; full interaction states; [BOOTSTRAP_STYLING_AUDIT.md](./docs/platform/BOOTSTRAP_STYLING_AUDIT.md)
- **Developer Platform** — CLI (`npx plantasonic create`), code generation pipeline, platform docs, quality gates, automated tests (32 tests), repo standards (AGENTS.md, SECURITY.md, CODE_OF_CONDUCT.md)
- **Build commands** — `tokens:build-bootstrap`, `generate`, `docs`, `quality`, `test`, `release`, `validate:templates`, `audit:bootstrap`
- **Generated artifacts** — TypeScript CSS var types, SCSS token aliases, token/component documentation
- **Vision and Scope** — canonical `docs/VISION_AND_SCOPE.md`; foundation reference docs (`COLORS.md`, `TYPOGRAPHY.md`, `SPACING.md`, `PATTERNS.md`)
- **Showcase Milestone 2 — Bootstrap Reference** — 12 Bootstrap category pages; Application Shell section (11 pages); Navigation section (15 pages); developer panel; WCAG contrast audit

### Fixed

- **Text color semantics** — `color.text.primary` is neutral readable text, not brand green
- **Runtime theme bridge** — `scss/css-theme-bridge.scss` so Bootstrap follows CSS custom properties when switching themes
- **Shell hardening** — routes wired to nav + command palette; `CommandRegistry.execute()` on palette click; full `persistState` restore

## [1.1.0] — 2026-06-28

### Added

- **Design System Showcase** — standalone Vite app in `showcase/`
- Interactive token browser, Bootstrap component catalog, Plantasonic reference components
- Theme switcher (dark/light), token inspector, search, responsive viewport preview
- Developer panel with version, build timestamp, token counts
- npm scripts: `showcase:dev`, `showcase:build`, `showcase:preview`
- Design validation workflow in README

## [1.0.0] — 2026-06-28

Initial public release of the Plantasonic Design System.

### Added

- W3C Design Tokens JSON — `foundation.tokens.json`, `theme.dark.tokens.json`, `theme.light.tokens.json`
- Generated `css/variables.css` — 122 CSS custom properties with `:root`, `[data-theme="dark"]`, and `[data-theme="light"]` blocks
- `scss/bootstrap-theme.scss` — Bootstrap 5.0.2 variable overrides
- Token build pipeline — `scripts/lib/tokens.mjs`, `scripts/validate-tokens.mjs`, `scripts/build-css.mjs`
- npm scripts: `tokens:validate`, `tokens:build-css`, `build`
- Documentation — brand guidelines, design principles, token architecture, component mapping
- AI application prompt — `prompts/APPLY_DESIGN_SYSTEM.md`
- MIT license, contributing guidelines, release workflow

### Notes

- Dark theme is the default (`:root`)
- Light theme provides 38 semantic overrides via `[data-theme="light"]`
- Product apps should consume this package — do not duplicate token definitions
