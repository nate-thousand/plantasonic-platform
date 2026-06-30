# Generator Guide

Official generators scaffold code that follows Design System conventions automatically: token-driven, framework-agnostic HTML-string render functions, accessible markup, and a matching metadata record so generated elements register themselves.

Each generator returns `GeneratedFile[]` (`{ path, content, description }`) so callers — CLI, build tools, or AI agents — write them wherever appropriate.

```typescript
import {
  generateComponent,
  generateLayout,
  generatePattern,
  generateTheme,
  generateWorkspace,
  generateApplication,
  generatePlugin,
} from 'plantasonic-design-system/ai';
```

---

## generateComponent

```typescript
const files = generateComponent({
  name: 'level-meter',
  purpose: 'Displays an audio level.',
  category: 'feedback',
  variants: ['default', 'accent'],
});
// → src/components/level-meter.ts        (token-driven render function)
// → src/ai/contrib/level-meter.meta.ts   (defineComponent metadata)
```

Generated components contain no hardcoded values and reuse the shared `classList` / `escapeHtml` helpers.

## generateLayout

```typescript
generateLayout({ name: 'gallery', variant: 'standard', regions: ['header', 'grid', 'footer'] });
// → src/ai/contrib/gallery.layout.ts (defineLayout metadata with regions)
```

## generatePattern

```typescript
generatePattern({ name: 'inspector', composedOf: ['component.panel'], layouts: ['layout.instrument'] });
// → src/patterns/inspector.ts            (render function)
// → src/ai/contrib/inspector.pattern.ts  (definePattern metadata)
```

## generateTheme

```typescript
generateTheme({ name: 'sunset', overrides: { 'color.primary.default': '#ff8800' } });
// → tokens/theme.sunset.tokens.json (W3C Design Tokens shape)
```

Add the new token file to the build pipeline and run `npm run tokens:build-css`.

## generateWorkspace / generateApplication

```typescript
generateApplication({ title: 'My Instrument', variant: 'instrument' });
// → src/main.ts (createApplication() bootstrap)

generateWorkspace({ id: 'mixer', label: 'Mixer' });
// → src/workspaces/mixer.ts
```

## generatePlugin

```typescript
generatePlugin({ name: 'midi-tools', description: 'MIDI learn + mapping.' });
// → plugins/midi-tools/index.ts (definePlugin scaffold)
```

See the [Plugin Guide](./PLUGIN_GUIDE.md) for how contributions are registered.

---

## Conventions enforced

- Token-driven only — no hex / rgb literals in generated render functions.
- Accessible markup — escape user text; document roles in metadata.
- Self-registering — every generated element ships a metadata record.
- `experimental` status by default — promote to `beta`/`stable` after review.
