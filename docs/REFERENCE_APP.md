# Reference Application — plantasonic-xyz v0.4.0

**plantasonic-xyz v0.4.0** is the official reference application for the **Plantasonic AI First Application Platform**.

It is not a throwaway demo. It is the **reference host** — a living, deployable application that demonstrates every major platform capability in one place. New apps, templates, and blueprints should trace their architecture back to patterns shown here.

---

## Platform hierarchy

```
Plantasonic Platform          ← source of truth for reusable systems
    ↓
plantasonic-xyz v0.4.0        ← official reference host (this document)
    ↓
Signal 9 Live                 ← first real product app built on the platform
    ↓
Future apps                   ← inherit platform; customize themes, tokens, assets, app logic
```

| Layer | Role |
|-------|------|
| **Plantasonic Platform** | SDK, generator, engines, templates, skills, docs — reusable infrastructure |
| **Design System** | UI shell, tokens, components, Creative Workspace layouts |
| **plantasonic-xyz** | Reference host that demonstrates the full platform stack |
| **Signal 9 Live** | First real application — blueprint `signal-9`, product-specific creative layer |
| **Future apps** | Generated or hand-built; consume platform packages; own branding and content |

---

## What the reference application demonstrates

plantasonic-xyz v0.4.0 is the canonical example for each platform surface:

| Surface | What it shows |
|---------|---------------|
| **Platform Overview** | End-to-end AI First workflow from design through deployment |
| **Design System** | Instrument shell, Creative Workspace, floating HUD surfaces |
| **Theme System** | Light/dark tokens, semantic theme overrides, brand alignment |
| **Components** | Shell chrome, transport, inspector, preset browser, status HUD |
| **Templates** | Thin consumer pattern — app injects content; platform wires orchestration |
| **Audio Engine** | Sound engine adapter, presets, parameter control, transport sync |
| **ASCII Engine** | Visual engine adapter, preset mapping, resize handling |
| **Visual Engine** | Renderer pipeline, post-processing, export hooks |
| **Video Engine slot** | Reserved integration point for future video source/render pipeline |
| **MIDI** | Web MIDI + keyboard performance controls via platform performance manager |
| **AI Workflow** | Figma → Design System → v0 → Cursor → Platform → GitHub → Vercel |
| **Developer Tools** | Validation scripts, local dev workflow, platform consumer bootstrap |
| **Settings** | App config, shell config, workspace layout, persistence |
| **Documentation** | In-app docs surfaces and links to platform guides |
| **Live Instrument** | Full playable instrument — transport, presets, audio-reactive bridge |

---

## Repository locations

| Artifact | Location today | Notes |
|----------|----------------|-------|
| Reference application | `../plantasonic-xyz/` (sibling repo) | v0.4.0 — production deploy at plantasonic.vercel.app |
| Design System | `packages/design-system/` | Platform-owned workspace package; sibling copy remains as a temporary mirror until Phase 6 |
| Platform thin consumer | `../plantasonic-xyz/src/platform-consumer/` | Creative layer injection pattern |
| Platform demo (in monorepo) | `apps/demo/` | Integration sandbox — not the reference host |
| Thin consumer scaffold | `apps/plantasonic-reference/` | Minimal wiring example for migration |
| First product app | `apps/signal-9-live/` | Blueprint `signal-9` — first real app on the platform |

Future consolidation (Phase 6) will absorb the reference host into `apps/plantasonic-xyz/` within this monorepo. Phase 1 has consolidated the Design System into `packages/design-system/`; the sibling copy remains as a read-only mirror until Phase 6.

---

## Reference vs product apps

### plantasonic-xyz (reference host)

- Demonstrates **all** platform capabilities
- Owns default preset bundles, platform overview content, and developer-facing surfaces
- Serves as the architectural north star for new apps
- Deployed as the public face of the platform ecosystem

### Signal 9 Live (first product app)

- Built with `pnpm plantasonic create audio-reactive signal-9-live --concept signal-9`
- Owns cyberpunk broadcast creative direction, Signal 9 branding, and blueprint-specific themes
- Inherits platform orchestration — does not reimplement engines or shell wiring
- See [apps/signal-9-live/README.md](../apps/signal-9-live/README.md)

### Future apps

- Scaffold from templates or blueprints via `@plantasonic/create-app`
- Customize: themes, tokens, assets, preset bundles, plugins, mappings, shell config
- Do **not** duplicate platform orchestration — compose `@plantasonic/platform` instead

---

## Bootstrap pattern

The reference application bootstraps as a thin platform consumer:

```
plantasonic-xyz/src/main.ts
    ↓
mountInstrumentApp({ content: PlatformConsumerContent })
    ↓
@plantasonic/platform — lifecycle, adapters, bridge, presets, performance, plugins, persistence
    ↓
Design System shell + Sound Engine + Visual Engine
```

Creative content lives in `src/platform-consumer/` — branding, preset bundles, plugins, mappings, shell config. Platform wiring lives in `mountInstrumentApp()`.

See [PLANTASONIC_APP_MIGRATION.md](./PLANTASONIC_APP_MIGRATION.md) for the full cutover guide.

---

## Local development

The reference application runs from its sibling repository:

```bash
cd ../plantasonic-xyz
pnpm install
pnpm dev
```

Platform monorepo apps for comparison:

```bash
pnpm dev              # Platform demo (5173)
pnpm dev:reference    # Thin consumer scaffold (5174)
pnpm --filter @plantasonic/signal-9-live dev   # Signal 9 (5176)
```

Validation:

```bash
pnpm validate:reference   # Validates apps/plantasonic-reference/ in monorepo
```

---

## Related documents

- [PLATFORM_OVERVIEW.md](./PLATFORM_OVERVIEW.md) — ecosystem home
- [ARCHITECTURE.md](./ARCHITECTURE.md) — layer model and dependency rules
- [APPLICATION_GUIDE.md](./APPLICATION_GUIDE.md) — building thin apps
- [DESIGN_SYSTEM_CONSOLIDATION_PLAN.md](./DESIGN_SYSTEM_CONSOLIDATION_PLAN.md) — future monorepo absorption plan
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — AI First development workflow
- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md) — scaffolding new apps
