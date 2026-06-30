# Application Guide

How to build thin Plantasonic applications on the platform.

The Plantasonic Platform is completely application agnostic. Applications consume the Platform and are developed, versioned, and deployed independently.

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
my-app/src/
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

- Internal scaffold: `apps/plantasonic-reference/` (validation only, not product ownership)
- Reference application: `../plantasonic-xyz/src/platform-consumer/` (independent repository)
- Template: `templates/instrument/`

## Cross references

- [GENERATOR_GUIDE.md](./GENERATOR_GUIDE.md)
- [SDK_GUIDE.md](./SDK_GUIDE.md)
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- Skill: `create-prototype`
