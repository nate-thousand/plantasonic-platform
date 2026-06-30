# Application Guide

How to build thin Plantasonic applications on the platform.

## Principles

Every app must be **thin**. Apps own creative content only — not infrastructure.

## App owns

- Name, concept, copy, assets
- `PresetBundle[]` definitions
- Creative mappings (documentation)
- Default workspace config
- Optional `PlatformPlugin[]`

## App does not own

- Lifecycle, event bus, adapters
- Design tokens, shell, **Creative Workspace** layout
- MIDI/keyboard routing
- Preset registry runtime
- Project persistence implementation
- Engine internals

## Recommended structure

```
apps/my-app/src/
  main.ts
  appContent.ts
  config/          # ApplicationConfig, shell, workspace
  content/         # bundles, plugins, branding, mappings
  styles/          # DS imports (instrument + creative-workspace SCSS)
```

## Bootstrap

```typescript
import { mountInstrumentApp } from '@plantasonic/platform-demo/instrument-app';
import { myAppContent } from './appContent.js';

await mountInstrumentApp(container, myAppContent);
```

## References

- Runnable: `apps/plantasonic-reference/`
- Production: `../plantasonic-xyz/src/platform-consumer/`
- Template: `templates/instrument/`

## Cross references

- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md)
- [SDK_GUIDE.md](./SDK_GUIDE.md)
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- Skill: `create-prototype`
