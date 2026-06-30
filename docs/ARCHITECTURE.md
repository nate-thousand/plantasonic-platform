# Architecture

> See also: [../ARCHITECTURE.md](../ARCHITECTURE.md) (detailed ecosystem diagram)

## Layer model

1. **Plantasonic Platform** — application-agnostic reusable foundation
2. **Reusable Packages** — SDK, Design System, Theme System, engines, templates, AI workflow, documentation
3. **Independent Applications** — reference app, Signal 9, Plantasia, future apps

Permanent rule: applications consume the Platform. Applications are developed, versioned, and deployed independently.

## Package dependency rules

- `@plantasonic/platform-types` → zero runtime deps
- `@plantasonic/platform` → types only (+ engines inside adapters)
- Independent apps → platform + DS + engines
- Engines → no platform imports
- DS → no engine imports

## Bootstrap pattern

Thin apps inject `InstrumentAppContent` and call:

```typescript
import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';
await mountInstrumentApp(container, appContent);
```

## Cross references

- [PACKAGE_RESPONSIBILITIES.md](./PACKAGE_RESPONSIBILITIES.md)
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [SDK_GUIDE.md](./SDK_GUIDE.md)
- Skill: `integrate-design-system`, `integrate-sound-engine`, `integrate-visual-engine`
