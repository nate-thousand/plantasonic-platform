# Prototype SDK Guide

Public API: `plantasonic-design-system/prototype`

## createPrototype

```typescript
import { createPrototype } from 'plantasonic-design-system/prototype';

const { plan, files } = createPrototype({
  type: 'audio-reactive-installation',
  name: 'Bloom Room',
  layout: 'layout.instrument',
  renderer: 'canvas',
  sound: true,
  midi: true,
  touch: true,
  documentation: true,
});
```

Returns a resolved `plan` and an array of `{ path, content }` files. Validation runs automatically unless `documentation: false`.

## Write to disk

```typescript
import { scaffoldPrototype, writePrototype } from 'plantasonic-design-system/prototype';

scaffoldPrototype({ type: 'generative-art', name: 'Flower Study' }, './flower-study');

// Or manual:
const result = createPrototype({ type: 'visual-synth', name: 'Signal Grid' });
writePrototype(result, { dir: './signal-grid' });
```

## Brief-based generation

```typescript
import { createPrototypeFromBrief, planFromBrief } from 'plantasonic-design-system/prototype';

const plan = planFromBrief('Generative art with seed control', 'Flower Study');
const { files } = createPrototypeFromBrief('Generative art with seed control', 'Flower Study');
```

## Validation

```typescript
import { validateGeneratedFiles, validatePrototype } from 'plantasonic-design-system/prototype';

validateGeneratedFiles(files);           // in-memory, pre-write
validatePrototype('./my-prototype');     // on disk
validatePrototypeStructure('./my-prototype'); // structure only
```

Checks include: required files, Design System dependency, token/motion imports, reduced-motion defaults, compliance engine (no hardcoded colors, unknown tokens).

## Catalog introspection

```typescript
import {
  PROTOTYPE_TYPES,
  PROTOTYPE_TYPE_IDS,
  getPrototypeTypeSpec,
  isPrototypeType,
} from 'plantasonic-design-system/prototype';

getPrototypeTypeSpec('music-instrument').panels;
isPrototypeType('generative-art'); // true
```

## Integration with AI SDK

```typescript
import { getComponents, getLayout } from 'plantasonic-design-system/ai';
import { resolvePrototypePlan } from 'plantasonic-design-system/prototype';

const plan = resolvePrototypePlan({ type: 'creative-tool', name: 'Editor' });
const layout = getLayout(plan.layout);
const components = plan.components.map((id) => getComponents().find((c) => c.id === id));
```
