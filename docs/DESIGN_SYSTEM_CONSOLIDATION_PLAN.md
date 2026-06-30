# Design System Consolidation Plan

Audit and migration plan for making **Plantasonic Design System** part of **Plantasonic Platform** as the single source of truth for engines, design system, themes, templates, AI workflow, and app generation.

**Status:** Foundation Complete through Phase 2 — `plantasonic-design-system` lives in `packages/design-system/`, and reusable theme package definitions live in `themes/` without changing package name, exports, token values, component behavior, or runtime theme output.

---

## 1. Current repository audit

### plantasonic-platform (this repo)

| Area | Present | Location | Notes |
|------|---------|----------|-------|
| `packages/` | Yes | `packages/*` | sdk, shared-types, create-plantasonic-app, design-system, sound-engine, visual-engine |
| `apps/` | Yes | `apps/*` | demo, plantasonic-reference, plantasonic-v2, signal-9-live |
| `templates/` | Yes | `templates/` | Catalog stubs (instrument active; 6 placeholder types) |
| `themes/` | Yes | `themes/*` | `default` mirrors DS dark/light tokens; `plantasia` and `signal9` are placeholders |
| `docs/` | Yes | `docs/` | 20 guides including AI_WORKFLOW, TOOLCHAIN |
| Workspace config | Yes | `pnpm-workspace.yaml` | `packages/*`, `apps/*` only |
| Skills / AI rules | Yes | `skills/`, `.cursor/rules/` | 10 agent workflows |
| Examples | Yes | `examples/` | Pattern documentation (not runnable apps) |
| Scripts | Yes | `scripts/` | Placeholder interfaces (validate, release, audit) |

**Platform version:** `0.12.0` — Foundation Complete (root `package.json` / `CHANGELOG.md`)

**Engine vendoring:** `packages/sound-engine` and `packages/visual-engine` are workspace packages vendored into this monorepo. They currently share the platform git remote (not independent submodule remotes in this checkout).

### plantasonic-xyz (sibling reference host)

| Area | Location | Role |
|------|----------|------|
| Application code | `src/` | **Reference host** — presets, visuals, platform-consumer creative layer; demonstrates all platform capabilities |
| Design System | `plantasonic-design-system/` | **Nested workspace package** — tokens, SCSS, shell, components |
| Deployment | `vercel.json`, root Vite | Reference host at plantasonic.vercel.app |
| Manifest | `platform.json` | App identity, engine deps, deployment metadata |

**App version:** `0.4.0` (official reference application)

**Workspace:** npm workspaces with single member `plantasonic-design-system`

### plantasonic-design-system (current canonical location)

**Physical path:** `packages/design-system/`

**Temporary mirror:** `../plantasonic-xyz/plantasonic-design-system/` remains in place until Phase 6.

**Package name:** `plantasonic-design-system` v1.0.1

**Git remote (local checkout):** `https://github.com/nate-thousand/plantasonic.git` (same repo as plantasonic-xyz)

**Published repo URL (package.json):** `https://github.com/nate-thousand/plantasonic-design-system.git`

**Showcase deployment:** plantasonic-design-system.vercel.app

#### Package contents (move candidates)

| Directory | Size (approx) | Purpose |
|-----------|---------------|---------|
| `tokens/` | 72 KB | W3C design tokens (foundation, theme.dark, theme.light) |
| `css/` | 24 KB | Generated CSS variables (`variables.css`) |
| `scss/` | 172 KB | Bootstrap theme, components, instrument, creative-workspace |
| `src/` | 680 KB | shell, instrument, creative-workspace, components, ai, platform, studio |
| `generated/` | 640 KB | Token SCSS, AI context JSON, API surface |
| `scripts/` | 176 KB | Token build, Figma import, quality gates, release |
| `cli/` | — | `npx plantasonic create` CLI |
| `templates/` | — | DS starter templates (nextjs, react-vite, electron) |
| `examples/` | — | DS integration examples |
| `tests/` | 116 KB | Token and API tests |
| `docs/` | 508 KB | Vision, AI design guide, V0 guidelines, platform docs |
| `demo/` | ~36 MB | DS component demo (includes node_modules) |
| `showcase/` | ~61 MB | Public showcase site (includes node_modules) |
| `prompts/` | — | Cursor / AI agent instructions |

#### Public export surface (must preserve)

Apps and templates depend on these subpath exports — **do not rename during migration**:

- `css/variables.css`
- `scss/*` (11 SCSS entry files)
- `shell`, `instrument`, `creative-workspace`
- `components`, `primitives`, `motion`, `app`, `ai`, `prototype`, `platform`, `studio`
- `generated/ai/*`, `tokens/*.tokens.json`

See full `exports` map in `plantasonic-design-system/package.json`.

### Current dependency wiring

Phase 1 consumers resolve the Design System via the workspace package:

```json
"plantasonic-design-system": "workspace:*"
```

**Affected consumers:**

| Consumer | Path |
|----------|------|
| `apps/demo` | Platform demo |
| `apps/plantasonic-reference` | Reference thin app |
| `apps/plantasonic-v2` | Production cutover app |
| `templates/instrument` | Template catalog |
| `create-plantasonic-app/templates/instrument` | Generator template |
| `create-plantasonic-app/templates/audio-reactive` | Generator template |
| `create-plantasonic-app/templates/visual-synth` | Generator template |

`apps/signal-9-live` is intentionally left untouched in this pass because Phase 1 was constrained not to touch Signal 9.

**Vite alias duplication (6 vite.config.ts files):** Each app manually resolves `plantasonic-design-system/shell`, `/instrument`, `/creative-workspace` to `node_modules/plantasonic-design-system/src/...`.

**TypeScript path duplication (6 tsconfig.json files):** Same manual path mappings.

**SCSS import chain (identical in every app):** 11 `@import 'plantasonic-design-system/scss/...'` lines in each `src/styles/index.scss`.

---

## 2. Gap analysis vs target structure

### Proposed target

```
plantasonic-platform/
  packages/
    design-system/          ← NEW (from plantasonic-xyz/plantasonic-design-system)
    audio-engine/           ← RENAME from sound-engine (future)
    ascii-engine/           ← SPLIT or ALIAS from visual-engine (future)
    visual-engine/          ← EXISTS (ascii-visual-engine today)
    video-engine/           ← PLACEHOLDER (not in ecosystem yet)
    midi-engine/            ← PLACEHOLDER (MIDI lives in sound-engine today)
    ai/                     ← PLACEHOLDER (DS has src/ai; platform has skills/)
    shared/                 ← RENAME from shared-types (future)
    sdk/                    ← EXISTS (@plantasonic/platform)
    create-plantasonic-app/ ← EXISTS
  themes/
    default/                ← NEW (extract from DS theme.dark/light)
    signal9/                ← NEW (from blueprint app semantic themes)
    plantasia/              ← NEW (default Plantasonic brand theme)
  apps/
    demo/                   ← EXISTS (platform integration demo)
    plantasonic-xyz/        ← MOVE from sibling repo (reference host — Phase 6)
    plantasonic-reference/  ← EXISTS
    plantasonic-v2/         ← EXISTS (interim cutover)
    signal-9-live/          ← EXISTS (blueprint app)
  templates/                ← EXISTS (generator catalog)
  docs/                     ← EXISTS
```

### Mapping current → target

| Target | Current state | Migration phase |
|--------|---------------|-----------------|
| `packages/design-system/` | Workspace package copied from `plantasonic-xyz/plantasonic-design-system` | **Phase 1 complete** |
| `packages/audio-engine/` | `packages/sound-engine` (`plantasia-sound-engine`) | Phase 3 (rename only) |
| `packages/ascii-engine/` | Not separate — `ascii-visual-engine` is one package | Phase 4 (evaluate split) |
| `packages/visual-engine/` | `packages/visual-engine` | Keep; clarify naming |
| `packages/video-engine/` | Does not exist | Future |
| `packages/midi-engine/` | Web MIDI in platform SDK + sound-engine MIDI | Future |
| `packages/ai/` | DS `src/ai/` + platform `skills/` | Phase 5 (consolidate docs/context) |
| `packages/shared/` | `packages/shared-types` | Phase 3 (optional rename) |
| `themes/default/` | DS `tokens/theme.dark.tokens.json`, `theme.light.tokens.json` | **Phase 2 complete** |
| `themes/signal9/` | Placeholder; Signal 9 app-specific values stay in app | **Phase 2 placeholder** |
| `themes/plantasia/` | Placeholder; inherits default until reusable mappings are approved | **Phase 2 placeholder** |
| `apps/plantasonic-xyz/` | Sibling repo `../plantasonic-xyz/` (reference host) | Phase 6 |

---

## 3. What moves into `packages/design-system/`

### Move (entire package, excluding node_modules)

| Source | Destination |
|--------|-------------|
| `plantasonic-xyz/plantasonic-design-system/tokens/` | `packages/design-system/tokens/` |
| `plantasonic-xyz/plantasonic-design-system/css/` | `packages/design-system/css/` |
| `plantasonic-xyz/plantasonic-design-system/scss/` | `packages/design-system/scss/` |
| `plantasonic-xyz/plantasonic-design-system/src/` | `packages/design-system/src/` |
| `plantasonic-xyz/plantasonic-design-system/generated/` | `packages/design-system/generated/` |
| `plantasonic-xyz/plantasonic-design-system/scripts/` | `packages/design-system/scripts/` |
| `plantasonic-xyz/plantasonic-design-system/cli/` | `packages/design-system/cli/` |
| `plantasonic-xyz/plantasonic-design-system/templates/` | `packages/design-system/templates/` |
| `plantasonic-xyz/plantasonic-design-system/examples/` | `packages/design-system/examples/` |
| `plantasonic-xyz/plantasonic-design-system/tests/` | `packages/design-system/tests/` |
| `plantasonic-xyz/plantasonic-design-system/docs/` | `packages/design-system/docs/` |
| `plantasonic-xyz/plantasonic-design-system/prompts/` | `packages/design-system/prompts/` |
| `plantasonic-xyz/plantasonic-design-system/demo/` | `packages/design-system/demo/` |
| `plantasonic-xyz/plantasonic-design-system/showcase/` | `packages/design-system/showcase/` |
| Package metadata | `packages/design-system/package.json`, README, CHANGELOG, LICENSE |

### Do not move into design-system

| Item | Reason |
|------|--------|
| `plantasonic-xyz/src/` | Application creative layer |
| `plantasonic-xyz/platform.json` | App manifest |
| `plantasonic-xyz/vercel.json` | App deployment |
| `plantasonic-xyz/scripts/verify-*.ts` | App verification |
| Platform `packages/sdk/` | Orchestration — separate concern |
| Platform `skills/` | Cursor agent workflows — platform-owned |

### Preserve unchanged during migration

- **Token values** — no edits to `tokens/*.tokens.json`
- **Package name** — keep `plantasonic-design-system` for export compatibility
- **Export map** — preserve all `./scss/*`, `./shell`, `./instrument`, etc.
- **Engine packages** — no moves or refactors in Phase 1

---

## 4. What stays app-specific in plantasonic-xyz

These remain in the application layer (eventually `apps/plantasonic-xyz/` as the monorepo reference host):

| Path | Contents | Why app-specific |
|------|----------|------------------|
| `src/platform-consumer/` | branding, presetBundles, plugins, mappings, shellConfig | Creative layer injection |
| `src/presets/worlds/` | Seed, Root, Bloom, etc. | App preset content |
| `src/presets/*.ts` | Registry, validation, manifest | App preset orchestration |
| `src/visuals/` | App visual configuration | Creative direction |
| `src/recorder/` | App recording feature | Product feature |
| `src/services/` | App-level services | Not DS chrome |
| `src/styles/_ps-aliases.scss` | Legacy alias bridge | App migration shim |
| `src/styles/platform-instrument.scss` | App shell bridge | App layout overrides |
| `src/main.ts` | App bootstrap | Entry point |
| `platform.json` | Project manifest | App identity |
| `vite.config.ts` | App bundler config | Deployment |
| `vercel.json` | Production deployment | Hosting |

**Blueprint semantic themes** (e.g. Signal 9 accent colors in app theme config) stay app-owned until a later approved extraction into `themes/<blueprint>/` — never into core DS tokens.

---

## 5. What becomes reusable platform code

| Asset | Current owner | Future owner |
|-------|---------------|--------------|
| Design tokens, SCSS, shell APIs | plantasonic-xyz/plantasonic-design-system | `packages/design-system/` |
| Orchestration SDK | packages/sdk | packages/sdk (unchanged) |
| Shared contracts | packages/shared-types | packages/shared/ (optional rename) |
| Sound engine | packages/sound-engine | packages/audio-engine/ |
| ASCII/visual engine | packages/visual-engine | packages/visual-engine/ or ascii-engine/ |
| App generator | packages/create-plantasonic-app | packages/create-plantasonic-app/ |
| Blueprint themes | App `src/config/theme.ts` | `themes/<name>/` |
| AI workflow docs | docs/AI_WORKFLOW.md, docs/TOOLCHAIN.md | docs/ (unchanged) |
| DS AI context | DS `generated/ai/` | packages/design-system/generated/ai/ |
| Cursor skills | skills/ | skills/ (platform-owned) |
| Template catalog | templates/ + create-plantasonic-app/templates/ | Consolidate in Phase 5 |

### Naming collision to resolve (Phase 5)

DS exports `plantasonic-design-system/platform` (project manifest, createProject) which overlaps conceptually with `@plantasonic/platform` SDK. These are **different APIs** today:

- `@plantasonic/platform` — runtime orchestration (event bus, adapters, lifecycle)
- `plantasonic-design-system/platform` — project scaffolding types and validation

Document the boundary; do not merge without explicit API design.

---

## 6. Risks

### 6.1 Broken imports

| Risk | Severity | Mitigation |
|------|----------|------------|
| 9 `file:../../../plantasonic-xyz/...` deps break if sibling removed | **High** | Switch to `workspace:*` in same pnpm monorepo |
| 6 duplicated Vite alias blocks | **Medium** | Extract shared `vite.dsAliases()` helper in platform scripts |
| 6 duplicated tsconfig paths | **Medium** | Shared `tsconfig.ds-paths.json` extends pattern |
| plantasonic-xyz still depends on DS via npm workspace | **High** | Update xyz to `workspace:*` or published version after move |
| Relative paths in DS scripts referencing old location | **Medium** | Audit `scripts/*.mjs` internal paths post-move |

### 6.2 Package exports

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking subpath exports (`/shell`, `/scss/*`) | **Critical** | Keep package name + exports map identical |
| DS build scripts assume npm, platform uses pnpm | **Medium** | Add pnpm scripts at root; run DS build in workspace postinstall |
| `generated/` artifacts stale after move | **Medium** | Run `pnpm --filter plantasonic-design-system build` in CI |

### 6.3 Duplicated tokens

| Risk | Severity | Mitigation |
|------|----------|------------|
| `plantasonic-xyz/src/styles/_ps-aliases.scss` duplicates `--ds-*` | **Low** | Keep as app shim until aliases removed |
| Blueprint themes vs DS tokens | **Medium** | Keep app-owned until approved; reusable mappings belong in `themes/<blueprint>/`, never foundation tokens |
| Figma import path `tokens/figma-source/` | **Low** | Move with tokens/ intact |

### 6.4 Duplicated components

| Risk | Severity | Mitigation |
|------|----------|------------|
| DS `src/platform/` vs `@plantasonic/platform` SDK | **Medium** | Document; no merge in Phase 1 |
| DS `src/studio/` vs platform demo | **Low** | DS studio is design tooling; keep separate |
| Identical SCSS import blocks in every app | **Medium** | Future: single `@plantasonic/design-system/styles` entry |

### 6.5 App-specific theme leakage

| Risk | Severity | Mitigation |
|------|----------|------------|
| Signal 9 colors in app SCSS leak into DS | **Medium** | Enforce `themes/<blueprint>/` boundary |
| `data-blueprint` attribute styling in app-layout.scss | **Low** | Keep in app or theme package, not DS core |

### 6.6 Build configuration

| Risk | Severity | Mitigation |
|------|----------|------------|
| DS demo/showcase have own node_modules (~97 MB) | **Medium** | Exclude node_modules from copy; pnpm install at root |
| DS uses npm lockfile; platform uses pnpm | **Medium** | Remove DS package-lock.json; use pnpm exclusively |
| Token build required before app dev | **High** | Root `postinstall`: build design-system tokens |
| Vercel showcase deploy path changes | **Medium** | Update Vercel root directory to `packages/design-system/showcase` |
| plantasonic-xyz postinstall `ds:tokens` script | **High** | Replace with workspace filter command |

### 6.7 Git and publishing

| Risk | Severity | Mitigation |
|------|----------|------------|
| DS git history in plantasonic repo vs published DS repo | **Medium** | Use git subtree/filter-repo to preserve history; or fresh copy with attribution |
| Two remotes (plantasonic.git vs plantasonic-design-system.git) | **Medium** | Decide canonical remote before move |
| npm publish of `plantasonic-design-system` from new path | **Low** | Defer to Platform v1.0 milestone |

---

## 7. Recommended migration phases

### Phase 0 — Planning (current)

- [x] Audit repository structure
- [x] Document target layout, risks, and boundaries
- [ ] Stakeholder sign-off on canonical git remote strategy

**No code changes.**

### Phase 1 — Vendor design system (safest first move)

1. Copy `plantasonic-xyz/plantasonic-design-system/` → `packages/design-system/` (exclude `node_modules`, `demo/node_modules`, `showcase/node_modules`)
2. Add `packages/design-system` to pnpm workspace (already covered by `packages/*`)
3. Update 9 consumer `package.json` files: `plantasonic-design-system: "workspace:*"`
4. Run `pnpm install && pnpm --filter plantasonic-design-system build`
5. Verify: `pnpm dev`, `pnpm dev:reference`, `pnpm validate:reference`
6. Update README — remove sibling path requirement
7. Leave `plantasonic-xyz/plantasonic-design-system` in place as read-only mirror until Phase 6

**Validation gate:** All apps compile; token CSS unchanged; no export renames.

### Phase 2 — Extract themes

1. Create `themes/default/` — mirror DS `theme.dark.tokens.json` / `theme.light.tokens.json` (no value changes)
2. Create `themes/plantasia/` — planned placeholder; no new token values
3. Create `themes/signal9/` — planned placeholder; Signal 9 app files untouched
4. Defer generator consumption of `themes/<concept>/` to a later approved phase
5. Document theme vs token boundary in `themes/README.md` and Design System theme docs

**Validation gate:** App appearance unchanged; DS token file hashes match the default theme mirrors.

### Phase 3 — Consolidate shared config

1. Add `packages/platform-config/vite.ds.ts` — shared Vite alias helper
2. Add `packages/platform-config/tsconfig.ds.json` — shared TS paths
3. Replace duplicated alias blocks in 6 vite.config.ts files
4. Optional: rename `shared-types` → `shared`, `sound-engine` → `audio-engine` (package folder only; preserve npm names until v1.0)

**Validation gate:** Diff vite/tsconfig changes only; no runtime change.

### Phase 4 — Engine naming alignment (optional, deferred)

1. Evaluate whether `ascii-visual-engine` splits into `ascii-engine` + `visual-engine`
2. Placeholder packages for `video-engine`, `midi-engine` with README-only stubs
3. Do **not** refactor engine internals

### Phase 5 — AI and template consolidation

1. Co-locate DS `generated/ai/` with platform `skills/` cross-references
2. Deduplicate template catalogs (`templates/` vs `create-plantasonic-app/templates/`)
3. Resolve DS `src/platform/` naming documentation vs SDK

### Phase 6 — Absorb plantasonic-xyz reference host

1. Move `plantasonic-xyz/src/` → `apps/plantasonic-xyz/` (official reference host in monorepo)
2. Update Vercel project root to monorepo app path
3. Deprecate sibling `plantasonic-xyz` repo with redirect README pointing to `apps/plantasonic-xyz/`
4. Remove mirrored `plantasonic-xyz/plantasonic-design-system` copy (after Phase 1 workspace deps are stable)

**Validation gate:** plantasonic.vercel.app deploys from monorepo; reference host behavior unchanged.

---

## 8. Safest path summary

The **lowest-risk sequence** is:

1. **Copy, don't cut** — vendor DS into `packages/design-system/` while leaving the sibling copy intact
2. **Preserve package identity** — keep `plantasonic-design-system` name and all subpath exports
3. **Switch deps to workspace:*** — eliminate `file:../../../plantasonic-xyz/...` in one coordinated PR
4. **Verify before delete** — run full validation checklist on all apps before removing sibling paths
5. **Extract themes second** — after DS is stable in monorepo, move blueprint themes to `themes/`
6. **Absorb xyz reference host last** — reference host migration is independent of DS consolidation

This avoids simultaneous changes to tokens, engines, app behavior, and deployment.

---

## 9. Pre-migration checklist

Before executing Phase 1:

- [ ] Confirm canonical git remote for design system history
- [ ] Snapshot current token files (checksum `tokens/*.tokens.json`)
- [ ] Run `pnpm dev` and `pnpm validate:reference` on baseline
- [ ] Run DS `npm test` and `npm run quality` on baseline
- [ ] Document Vercel project configs for showcase and production app
- [ ] Create feature branch `feat/design-system-consolidation`
- [ ] Notify consumers of temporary dual-path period (sibling + workspace)

---

## 10. Related documents

- [REFERENCE_APP.md](./REFERENCE_APP.md) — plantasonic-xyz v0.4.0 reference application
- [PACKAGE_RESPONSIBILITIES.md](./PACKAGE_RESPONSIBILITIES.md) — ownership boundaries
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — design token source of truth principles
- [TOOLCHAIN.md](./TOOLCHAIN.md) — Figma → DS → v0 → Cursor flow
- [PLANTASONIC_APP_MIGRATION.md](./PLANTASONIC_APP_MIGRATION.md) — thin app cutover patterns
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) — DS import paths today
- [ROADMAP.md](../ROADMAP.md) — Milestone 19: Design System Consolidation
