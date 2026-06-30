# Workspace Cleanup Plan

Date: 2026-06-30

Scope: parent workspace at `/Users/natethousandfingers/Documents/AI-Projects`.

This plan is audit-only. No files were moved, deleted, or modified outside this document.

## Goal

Separate the three projects cleanly:

- `plantasonic-platform`: reusable foundation only.
- `plantasonic-xyz`: separate Plantasonic reference/demo app.
- `signal-9-live`: separate Signal 9 product app.

The platform should remain application agnostic. Product apps and product-specific themes should live in product repositories, not inside `plantasonic-platform`.

## Current Structure

Parent workspace currently contains:

```text
AI-Projects/
  README.md
  archive/
  assets/
  natethousandlabs-xyz/
  plantasonic-platform/
  plantasonic-platform.zip
  plantasonic-xyz/
  signal-9-handoff-1.rtf
  signal-9-live/
```

`plantasonic-platform/` currently contains:

```text
plantasonic-platform/
  apps/
    demo/
    plantasonic-reference/
    plantasonic-v2/
    signal-9-live/
  docs/
  examples/
  packages/
    create-plantasonic-app/
    design-system/
    sdk/
    shared-types/
    sound-engine/
    visual-engine/
  scripts/
  skills/
  templates/
  themes/
    default/
    plantasia/
    signal9/
```

The platform workspace file currently includes all app folders:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## Target Structure

Target parent workspace:

```text
AI-Projects/
  archive/
    plantasonic-platform-cleanup-2026-06-30/
      apps/
      themes/
  plantasonic-platform/
  plantasonic-xyz/
  signal-9-live/
```

Target `plantasonic-platform/`:

```text
plantasonic-platform/
  docs/
  examples/
  packages/
  scripts/
  skills/
  templates/
  themes/
    default/
```

Optional target if the platform still needs a runnable smoke-test app:

```text
plantasonic-platform/
  apps/
    demo/
```

If `apps/demo` remains, it should be treated as a generic platform smoke test only. It should not carry product identity, product presets, or app-specific themes.

## App Folder Classification

### Reusable Platform Examples

- `plantasonic-platform/apps/demo`
  - Status: keep for now.
  - Reason: package name is `@plantasonic/platform-demo`; description says "Minimal demo scaffold for the Plantasonic platform"; dependencies point to workspace platform packages.
  - Boundary requirement: keep product-agnostic. If it gains product branding, convert it into `examples/` documentation or archive it.

- `plantasonic-platform/examples/*`
  - Status: keep.
  - Reason: documented as non-runnable examples for minimal app, instrument, audio-reactive config, plugin patterns, workspace regions, and persistence.

- `plantasonic-platform/templates/*`
  - Status: keep.
  - Reason: template catalog for the app generator. Product-specific generated output should not be committed back into platform as app folders.

### Duplicate Demo Apps

- `plantasonic-platform/apps/plantasonic-reference`
  - Status: archive candidate.
  - Reason: thin consumer/reference app overlaps with the standalone `plantasonic-xyz` project and duplicates the "reference app" role.
  - Recommended disposition: archive from platform after confirming `apps/demo` covers platform smoke testing.
  - Do not merge into `plantasonic-xyz` automatically.

### Product Apps

- `plantasonic-platform/apps/signal-9-live`
  - Status: remove from platform by archiving the platform copy.
  - Reason: Signal 9 is a separate product app and already exists as top-level `signal-9-live`.
  - Audit note: the embedded platform copy is not identical to top-level `signal-9-live`. The standalone app has additional production folders such as `server/`, `public/`, `src/ai/`, `src/audio/`, `src/export/`, `src/game/`, `src/navigation/`, `src/platform/`, `src/startup/`, `src/theme/`, and `src/ui/`. The platform copy has generated blueprint placeholders such as `blueprint.meta.json`, `src/content/concept.ts`, `src/content/scenes.ts`, and `src/config/theme.ts`.
  - Recommended disposition: archive the platform copy only. Leave top-level `signal-9-live` untouched.

- `plantasonic-platform/apps/plantasonic-v2`
  - Status: archive candidate.
  - Reason: README describes it as a platform-based replacement scaffold for the production Plantasonic app. It is app/product-specific and overlaps with standalone `plantasonic-xyz`.
  - Audit note: it is not equivalent to `plantasonic-xyz`; the standalone project has its own repo metadata, docs, design-system workspace, public assets, verification scripts, services, visuals, recorder, and platform consumer/reference code.
  - Recommended disposition: archive from platform as an old migration experiment. Do not overwrite or merge into `plantasonic-xyz` automatically.

### Old Experiments

- `plantasonic-platform/apps/plantasonic-v2`
  - Status: old experiment / migration scaffold.
  - Safe action: archive after review.
  - Unsafe action: using it as the source of truth for `plantasonic-xyz`.

- `plantasonic-platform/apps/plantasonic-reference`
  - Status: duplicate reference scaffold.
  - Safe action: archive after `apps/demo` is confirmed as the only platform smoke-test app.
  - Unsafe action: treating it as the canonical `plantasonic-xyz` app.

### Safe To Archive

Safe to archive from `plantasonic-platform` after a final review:

- `apps/plantasonic-reference`
- `apps/plantasonic-v2`
- `apps/signal-9-live`
- `themes/plantasia`
- `themes/signal9`

When archiving app folders, exclude generated dependency/build artifacts:

- `node_modules/`
- `dist/`

### Unsafe To Move

Leave untouched unless there is a separate migration task:

- Top-level `plantasonic-xyz`
- Top-level `signal-9-live`
- `plantasonic-platform/packages/*`
- `plantasonic-platform/templates/*`
- `plantasonic-platform/examples/*`
- `plantasonic-platform/scripts/*`
- `plantasonic-platform/skills/*`
- `plantasonic-platform/themes/default`

Unsafe moves:

- Do not move `plantasonic-platform/apps/signal-9-live` into top-level `signal-9-live`; they differ.
- Do not move `plantasonic-platform/apps/plantasonic-v2` into top-level `plantasonic-xyz`; they differ.
- Do not move product-specific theme placeholders into product repos until there are real token values or approved theme contracts to preserve.
- Do not change imports until the app folders have been removed from `pnpm-workspace.yaml` and the remaining workspace builds cleanly.

## Theme Classification

### Reusable Platform Themes

- `plantasonic-platform/themes/default`
  - Status: keep.
  - Reason: active reusable default theme; mirrors Design System dark/light semantic token files.
  - Boundary: reusable infrastructure belongs in platform.

### Product-Specific Themes

- `plantasonic-platform/themes/plantasia`
  - Status: archive or move to product ownership later.
  - Reason: Plantasia/Plantasonic brand identity belongs to `plantasonic-xyz` unless a reusable platform-level theme contract is approved.
  - Current contents are placeholder metadata only; no token sources are defined.

- `plantasonic-platform/themes/signal9`
  - Status: archive or move to product ownership later.
  - Reason: Signal 9 visual identity belongs to `signal-9-live`.
  - Current contents are placeholder metadata only; no token sources are defined.

### Temporary Placeholders

- `themes/plantasia`
- `themes/signal9`

Both are marked `status: planned`, inherit `default`, have empty `tokenSources`, and do not change runtime output. They are safe to remove from the platform catalog after archiving their metadata.

## Folders To Keep

Keep in `plantasonic-platform`:

- `packages/`
- `templates/`
- `docs/`
- `examples/`
- `scripts/`
- `skills/`
- `themes/default/`
- `apps/demo/` only if retained as a generic platform smoke test.

Keep as separate projects:

- `plantasonic-xyz/`
- `signal-9-live/`

## Folders To Move Or Archive

Archive out of `plantasonic-platform`:

- `plantasonic-platform/apps/plantasonic-reference`
- `plantasonic-platform/apps/plantasonic-v2`
- `plantasonic-platform/apps/signal-9-live`
- `plantasonic-platform/themes/plantasia`
- `plantasonic-platform/themes/signal9`

Recommended archive destination:

```text
AI-Projects/archive/plantasonic-platform-cleanup-2026-06-30/
  apps/
    plantasonic-reference/
    plantasonic-v2/
    signal-9-live/
  themes/
    plantasia/
    signal9/
```

## Folders To Leave Untouched

Do not move in this cleanup pass:

- `plantasonic-xyz/`
- `signal-9-live/`
- `archive/ai-native-design-system/`
- `archive/ai-product-framework/`
- `assets/`
- `natethousandlabs-xyz/`
- `plantasonic-platform/packages/`
- `plantasonic-platform/templates/`
- `plantasonic-platform/examples/`
- `plantasonic-platform/scripts/`
- `plantasonic-platform/skills/`
- `plantasonic-platform/themes/default/`

## Risks

- `pnpm-workspace.yaml` includes `apps/*`; removing app folders requires updating the workspace file in the actual cleanup pass.
- Root scripts reference app package names:
  - `dev`: `pnpm --filter @plantasonic/platform-demo dev`
  - `dev:reference`: `pnpm --filter @plantasonic/plantasonic-reference dev`
  - `validate:reference`: `pnpm --filter @plantasonic/plantasonic-reference validate`
- `plantasonic-xyz` depends on `@plantasonic/platform-demo` via `file:../plantasonic-platform/apps/demo`; removing `apps/demo` would break that dependency.
- `plantasonic-xyz` depends on platform packages by relative file path, so any platform package moves are high risk.
- `signal-9-live` depends on platform packages and `plantasonic-xyz/plantasonic-design-system` by relative file path; leave those dependency edges unchanged until a separate dependency cleanup.
- The embedded `apps/signal-9-live` and standalone `signal-9-live` differ substantially. Automatic merge or overwrite risks losing product work.
- The embedded `apps/plantasonic-v2` and standalone `plantasonic-xyz` differ substantially. Automatic merge or overwrite risks losing production/reference app work.
- `themes/plantasia` and `themes/signal9` are placeholders today, but deleting them without archiving would erase boundary documentation.
- Generated `dist/` and `node_modules/` folders are present under platform apps; archiving them would create unnecessary noise and large copies.

## Recommended Commands

These commands are recommendations for a future cleanup pass. Do not run them until the archive/move plan is approved.

### 1. Capture Current State

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects"

git -C plantasonic-platform status --short
git -C plantasonic-platform diff --stat

diff -qr --exclude node_modules --exclude dist \
  plantasonic-platform/apps/signal-9-live \
  signal-9-live > archive/signal-9-live-platform-copy.diff.txt || true

diff -qr --exclude node_modules --exclude dist \
  plantasonic-platform/apps/plantasonic-v2 \
  plantasonic-xyz > archive/plantasonic-v2-platform-copy.diff.txt || true
```

### 2. Create Archive Folders

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects"

mkdir -p archive/plantasonic-platform-cleanup-2026-06-30/apps
mkdir -p archive/plantasonic-platform-cleanup-2026-06-30/themes
```

### 3. Archive Platform App Copies

Use `rsync` first so the archive can be reviewed before anything is removed from the platform.

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects"

rsync -a --exclude node_modules --exclude dist \
  plantasonic-platform/apps/plantasonic-reference/ \
  archive/plantasonic-platform-cleanup-2026-06-30/apps/plantasonic-reference/

rsync -a --exclude node_modules --exclude dist \
  plantasonic-platform/apps/plantasonic-v2/ \
  archive/plantasonic-platform-cleanup-2026-06-30/apps/plantasonic-v2/

rsync -a --exclude node_modules --exclude dist \
  plantasonic-platform/apps/signal-9-live/ \
  archive/plantasonic-platform-cleanup-2026-06-30/apps/signal-9-live/
```

### 4. Archive Product Theme Placeholders

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects"

rsync -a plantasonic-platform/themes/plantasia/ \
  archive/plantasonic-platform-cleanup-2026-06-30/themes/plantasia/

rsync -a plantasonic-platform/themes/signal9/ \
  archive/plantasonic-platform-cleanup-2026-06-30/themes/signal9/
```

### 5. Remove Archived Copies From Platform

Run only after confirming the archive contains the expected files.

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects/plantasonic-platform"

rm -rf apps/plantasonic-reference
rm -rf apps/plantasonic-v2
rm -rf apps/signal-9-live
rm -rf themes/plantasia
rm -rf themes/signal9
```

### 6. Update Platform Workspace Metadata

Edit `pnpm-workspace.yaml` so it no longer auto-includes every app if `apps/demo` is the only retained runnable app:

```yaml
packages:
  - 'packages/*'
  - 'apps/demo'
```

Edit root `package.json` to remove or replace scripts that target archived app packages:

```json
{
  "scripts": {
    "dev": "pnpm --filter @plantasonic/platform-demo dev",
    "create:app": "node packages/create-plantasonic-app/bin/create-plantasonic-app.mjs",
    "plantasonic": "node packages/create-plantasonic-app/bin/plantasonic.mjs",
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "clean": "pnpm -r exec rm -rf dist"
  }
}
```

### 7. Verify Platform Boundary

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects/plantasonic-platform"

pnpm install
pnpm -r typecheck
pnpm -r build
```

Then verify standalone apps from their own project roots:

```bash
cd "/Users/natethousandfingers/Documents/AI-Projects/plantasonic-xyz"
npm run typecheck
npm run build

cd "/Users/natethousandfingers/Documents/AI-Projects/signal-9-live"
pnpm install
pnpm typecheck
pnpm build
```

## Recommended Next Prompt

Use this prompt for the actual cleanup pass:

```text
Apply the approved workspace cleanup plan in plantasonic-platform/docs/WORKSPACE_CLEANUP_PLAN.md.

Do not touch top-level plantasonic-xyz or signal-9-live.
Archive the platform app copies and product theme placeholders first.
Then remove the archived copies from plantasonic-platform.
Update only plantasonic-platform workspace metadata/scripts required by the removal.
Run verification commands and report any failures.
```
