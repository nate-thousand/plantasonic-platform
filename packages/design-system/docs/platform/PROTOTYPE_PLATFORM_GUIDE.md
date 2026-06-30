# Prototype Platform Guide

The Prototype Platform is a **reusable layer in the Design System** — not inside any single application. Every new prototype is generated from one command or brief and automatically inherits tokens, theme, layout, components, motion, accessibility, documentation, validation, and deployment setup.

---

## Quick start

```bash
# Official prototype type + name
npx plantasonic create generative-art flower-study

# From a written brief
npx plantasonic spec "Audio reactive flower installation with MIDI and fullscreen visuals" --name "Bloom Room"

# List all 12 types
npx plantasonic list prototypes
```

## What you get

Every generated prototype includes:

| Area | Included |
| --- | --- |
| Design System | `plantasonic-design-system` dependency |
| Tokens + theme | `@ds/css/variables.css`, `data-theme="dark"` |
| Layout | Instrument shell (`createApplication`) or Application Shell |
| Components | Registry-selected panels using `plantasonic-design-system/components` |
| Motion | `@ds/scss/motion` + `prefers-reduced-motion` defaults |
| Accessibility | `lang`, `color-scheme`, landmarks, reduced motion |
| Documentation | README, ROADMAP, CHANGELOG, validation checklist |
| Validation | `npm run validate` (structure + compliance) |
| Deployment | `vercel.json` for Vite static export |

## Architecture

```
src/prototype/catalog.ts     12 official prototype types + defaults
        ↓
src/prototype/spec-parser.ts Brief → plan (type, layout, features, panels)
        ↓
src/prototype/generate.ts    File generation
        ↓
cli/commands/prototype.mjs   plantasonic create | spec
        ↓
<your-prototype>/            Runnable Vite app
```

## SDK

```typescript
import { createPrototype, scaffoldPrototype } from 'plantasonic-design-system/prototype';

const { plan, files } = createPrototype({
  type: 'audio-reactive-installation',
  name: 'Bloom Room',
  sound: true,
  midi: true,
  touch: true,
});
```

See [Prototype SDK Guide](./PROTOTYPE_SDK_GUIDE.md).

## Related guides

- [Template Guide](./PROTOTYPE_TEMPLATE_GUIDE.md) — official prototype types
- [CLI Guide](./CLI_GUIDE.md) — commands and flags
- [AI Spec Guide](./AI_SPEC_GUIDE.md) — brief → prototype workflow
- [Generated App Architecture](./GENERATED_APP_ARCHITECTURE.md) — folder structure
- [Prototype Migration Guide](./PROTOTYPE_MIGRATION_GUIDE.md) — starter → prototype or type changes
