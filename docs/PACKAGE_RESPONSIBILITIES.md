# Package Responsibilities

Each package in the Plantasonic ecosystem has exactly one responsibility. This document defines what each package owns and what it must never do.

## plantasonic-design-system (`packages/design-system/`)

**Owns:** UI components, layout primitives, theming, accessibility, design tokens

**Must never:**
- Import or call Sound Engine APIs
- Import or call Visual Engine APIs
- Manage application lifecycle
- Own preset data or routing logic
- Know about audio analysis or visual rendering

**Integrates via:** Workspace region DOM targets provided by the platform. User interactions emit platform events.

---

## Theme System (`themes/`)

**Owns:** Reusable theme package definitions and theme catalog metadata

**Must never:**
- Rename Design System tokens
- Change token values without an approved Design System release
- Own app-specific theme choices
- Override runtime app behavior directly

**Integrates via:** Applications choose supported themes; Design System owns token generation and CSS output.

---

## plantasia-sound-engine

**Owns:** Audio synthesis, playback, effects, audio analysis, MIDI input processing

**Must never:**
- Import or render UI components
- Import or call Visual Engine APIs
- Define workspace layout
- Know about preset browser UI

**Integrates via:** `SoundEngineAdapter` registered with the platform. Emits audio events on the platform bus. Receives preset data via `preset.applied` events.

---

## plantasia-visual-engine

**Owns:** Rendering, shaders, visual effects, canvas/WebGL management

**Must never:**
- Import or render UI components (beyond its own canvas)
- Import or call Sound Engine APIs directly
- Define workspace layout
- Know about transport controls UI

**Integrates via:** `VisualEngineAdapter` registered with the platform. Subscribes to `audio.*` events for reactivity. Renders into the `stage` workspace region.

---

## plantasonic-platform (this repo)

**Owns:** AI First Application Platform foundation — application lifecycle, event bus, workspace layout contract, preset registry, engine adapter orchestration, integration types, Design System workspace package, Theme System catalog, generator, AI workflow, and documentation

**Must never:**
- Implement UI components (delegates to Design System)
- Implement audio logic (delegates to Sound Engine)
- Implement rendering logic (delegates to Visual Engine)
- Import engine packages directly into the SDK
- Make creative decisions (delegates to applications)

**Integrates via:** SDK exports consumed by applications. Types consumed by all packages.

### Sub-packages

| Package | Responsibility |
|---------|---------------|
| `@plantasonic/platform-types` | Shared TypeScript interfaces — zero runtime code |
| `@plantasonic/platform` | SDK factory functions and orchestration |
| `@plantasonic/platform-demo` | Demo scaffold proving platform shape |

---

## Plantasonic Applications

**Owns:** Creative direction, user experience, composition of all packages, adapter implementations

**Must never:**
- Duplicate engine code
- Duplicate Design System components
- Bypass the platform event bus for cross-component communication
- Hardcode engine internals

**Integrates via:** `createApplication()` from the platform SDK. Wires Design System, engine adapters, and presets together.

---

## Boundary Enforcement

These rules are architectural, not just organizational:

```
✅ Application → Platform → Engine Adapter → Engine Package
✅ Design System → platform eventBus → Engine (via events)
✅ Sound Engine → platform eventBus → Visual Engine (via events)

❌ Design System → Sound Engine (direct)
❌ Sound Engine → Visual Engine (direct)
❌ Platform SDK → Engine Package (direct import)
❌ Engine → Design System (direct)
```

When in doubt: if two packages need to communicate, the message goes through the platform.
