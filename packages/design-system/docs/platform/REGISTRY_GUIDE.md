# Registry Guide

The registry is the searchable source of truth. Every component, primitive, layout, pattern, token, and theme registers itself, and applications and AI tools discover capabilities through the registry rather than the filesystem.

---

## The default registry

```typescript
import { registry, getRegistry } from 'plantasonic-design-system/ai';

registry.summary();        // { component, primitive, layout, pattern, token, theme, total }
registry.components();     // ComponentMetadata[] (components + primitives)
registry.layouts();        // LayoutMetadata[]
registry.patterns();       // PatternMetadata[]
registry.tokens();         // TokenMetadata[]
registry.themes();         // ThemeMetadata[]
registry.get('component.button');
registry.categories('component');
registry.deprecated();
```

## Querying

```typescript
registry.query({ kind: 'pattern', status: 'stable' });
registry.query({ kind: ['component', 'primitive'], category: 'layout' });
registry.query({ text: 'transport' });   // matches id, name, purpose, tags
registry.query({ tag: 'primitive' });
```

## Knowledge graph & impact analysis

```typescript
import { getKnowledgeGraph, getImpact } from 'plantasonic-design-system/ai';

const { nodes, edges } = getKnowledgeGraph();
// edge types: depends-on, composed-of, used-in-layout, fits-layout, uses-token, themes

const report = getImpact('token.color.primary.default');
report.directDependents;      // immediate references
report.transitiveDependents;  // full downstream impact
```

Use impact analysis before changing or deprecating an element to understand what is affected.

## Custom registries

```typescript
import { Registry, createDefaultRegistry } from 'plantasonic-design-system/ai';

const custom = createDefaultRegistry();   // a fresh copy of the default
custom.add(myComponentMetadata);

const empty = new Registry();
empty.addAll([/* records */]);
```

Most SDK functions accept an optional `registry` argument so you can operate on a custom or plugin-augmented registry:

```typescript
import { getComponents } from 'plantasonic-design-system/ai';
getComponents(custom);
```

## JSON export

For non-TypeScript consumers, the same data is available at `generated/ai/registry.json` (and per-kind files). See the [AI Architecture Guide](./AI_ARCHITECTURE.md).
