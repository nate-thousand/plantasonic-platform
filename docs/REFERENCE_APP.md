# Reference Application — plantasonic-xyz v0.4.0

**plantasonic-xyz v0.4.0** is the official reference application for the **Plantasonic AI First Application Platform**.

It is not a throwaway demo and it is not part of this repository. It is an **independent reference application** — a living, deployable app that demonstrates every major platform capability in one place. New apps, templates, and blueprints should trace their architecture back to patterns shown here.

Platform milestone `v0.12.0` marks **Foundation Complete**. The reference host remains the canonical example for applying that foundation.

---

## Platform hierarchy

```
Plantasonic Platform          ← application-agnostic source of truth for reusable systems
    ↓
Reusable Packages             ← SDK · DS · themes · engines · templates · AI workflow
    ↓
Independent Applications      ← plantasonic-xyz · Signal 9 · Plantasia · future apps
```

| Layer | Role |
|-------|------|
| **Plantasonic Platform** | SDK, generator, engines, templates, skills, docs — reusable infrastructure |
| **Design System** | UI shell, tokens, components, Creative Workspace layouts |
| **plantasonic-xyz** | Independent official reference application that demonstrates the full platform stack |
| **Signal 9** | Independent first product application |
| **Plantasia / future apps** | Independent repositories; consume platform packages and own product-specific content |

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
| Reference application | `../plantasonic-xyz/` (independent repo) | v0.4.0 — production deploy at plantasonic.vercel.app |
| Design System | `packages/design-system/` | Platform-owned workspace package; sibling copy remains as a temporary mirror until Phase 6 |
| Theme System | `themes/` | Platform-owned theme catalog; default mirrors dark/light DS tokens |
| Platform thin consumer | `../plantasonic-xyz/src/platform-consumer/` | Creative layer injection pattern |
| Internal demo/scaffold | `apps/` | Internal validation/demo scaffolds only; not product app ownership |
| First product app | Signal 9 | Independent product application repository |

The reference application stays independent. The Design System and Theme System foundation live in this repo; the sibling Design System copy remains as a temporary mirror until a later cleanup phase.

---

## Reference vs product apps

### plantasonic-xyz (independent reference app)

- Demonstrates **all** platform capabilities
- Owns default preset bundles, platform overview content, and developer-facing surfaces
- Serves as the architectural north star for new apps
- Deployed as the public face of the platform ecosystem

### Signal 9 Live (first product app)

- Built with `pnpm plantasonic create audio-reactive signal-9-live --concept signal-9`
- Lives outside the platform as an independent product application
- Owns cyberpunk broadcast creative direction, Signal 9 branding, and product-specific themes
- Inherits platform orchestration — does not reimplement engines or shell wiring

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
