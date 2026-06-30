# AI Spec Guide

Convert a written brief into a complete prototype plan: application structure, layout, components, panels, engine placeholders, documentation, roadmap, and validation checklist.

## CLI

```bash
npx plantasonic spec \
  "Audio reactive flower installation with uploaded assets, ambient sound, MIDI, fullscreen visuals, performance controls" \
  --name "Bloom Room"
```

## SDK

```typescript
import { planFromBrief, createPrototypeFromBrief } from 'plantasonic-design-system/prototype';

const plan = planFromBrief(brief, 'Bloom Room');
// plan.type, plan.layout, plan.features, plan.panels, plan.engines, plan.roadmap

const { files } = createPrototypeFromBrief(brief, 'Bloom Room');
```

Or merge brief with explicit config:

```typescript
createPrototype({
  type: 'audio-reactive-installation',
  name: 'Bloom Room',
  brief: '…',
  midi: true,
});
```

## Keyword detection

The spec parser infers prototype **type** and **features** from prose:

| Keywords | Inferred |
| --- | --- |
| audio reactive, ambient sound | `audio-reactive-installation`, `sound: true` |
| generative art | `generative-art` |
| visual synth, vj | `visual-synth` |
| music instrument, synthesizer | `music-instrument` |
| ai assistant, llm, copilot | `ai-assistant` |
| lighting, dmx | `lighting-controller` |
| midi | `midi: true` |
| touch, gesture, kiosk | `touch: true` |
| fullscreen, immersive | `layout.canvas` |
| upload, asset, flower | adds **Assets** panel |

If type cannot be inferred, pass `--type` or set `type` explicitly in the SDK.

## Generated spec artifacts

When a brief is provided, the prototype includes `docs/SPEC.md` with:

- Original brief
- Resolved type, layout, renderer, features
- Component and panel list from the registry

## AI agent workflow

1. Read brief from user or ticket
2. Call `planFromBrief(brief, name)` to preview the plan
3. Call `scaffoldPrototype({ …config, brief }, dir)` or use CLI `spec`
4. Run `npm run validate` in the output directory
5. Implement domain logic in `src/engines/` only — do not duplicate Design System UI

Use `plantasonic-design-system/ai` registry exports to pick components and patterns programmatically.
