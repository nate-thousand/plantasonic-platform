# Architecture

> See also: [../ARCHITECTURE.md](../ARCHITECTURE.md) (detailed ecosystem diagram)

## Layer model

1. **Applications** — concept, copy, assets, presets, mappings, config
2. **Platform SDK** — lifecycle, event bus, adapters, bridge, presets, performance, plugins, persistence
3. **Design System** — UI shell, components, tokens, layout
4. **Engines** — sound synthesis, visual rendering

## Package dependency rules

- `@plantasonic/platform-types` → zero runtime deps
- `@plantasonic/platform` → types only (+ engines inside adapters)
- Apps → platform + DS + engines
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
