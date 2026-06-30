# Prototype Template Guide

Twelve official prototype types ship with the Design System. Each type defines default layout, renderer, features, components, panels, patterns, and roadmap items.

Run `npx plantasonic list prototypes` for the current list.

| Type | Default layout | Shell | Sound | MIDI | Touch |
| --- | --- | --- | --- | --- | --- |
| `audio-reactive-installation` | canvas | instrument | ✓ | | |
| `generative-art` | canvas | instrument | | | |
| `visual-synth` | instrument | instrument | ✓ | ✓ | |
| `music-instrument` | instrument | instrument | ✓ | ✓ | ✓ |
| `ai-assistant` | dashboard | standard | | | |
| `interactive-object` | instrument | instrument | | | ✓ |
| `lighting-controller` | studio | instrument | | ✓ | ✓ |
| `portfolio-demo` | landing | standard | | | |
| `presentation-prototype` | presentation | instrument | | | |
| `creative-tool` | studio | instrument | | | |
| `data-visualization` | dashboard | standard | | | |
| `research-experiment` | workspace | standard | | | |

## Examples

```bash
npx plantasonic create generative-art flower-study
npx plantasonic create audio-reactive-installation bloom-room
npx plantasonic create visual-synth signal-grid
npx plantasonic create music-instrument pad-lab
```

## Overrides

Any type accepts feature overrides via the SDK or brief keywords:

```typescript
createPrototype({
  type: 'generative-art',
  name: 'Flower Study',
  sound: true,      // enable audio engine placeholder
  midi: true,
  layout: 'layout.instrument',
});
```

## Adding a new type

1. Add a `PrototypeTypeSpec` entry in `src/prototype/catalog.ts`
2. Extend `PrototypeType` in `src/prototype/types.ts`
3. Add brief detection rules in `src/prototype/spec-parser.ts` (optional)
4. Run `npm run validate:prototypes`

Do not add prototype logic to product applications — extend the catalog in the Design System.
