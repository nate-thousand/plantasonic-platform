# Metadata Specification

Every element in the Design System exposes structured, machine-readable metadata. This document is the human-readable companion to `src/ai/metadata.ts`, which is the authoritative, type-checked definition.

**Spec version:** `METADATA_SPEC_VERSION` (currently `1.0.0`). Bump on breaking shape changes.

---

## Base fields (all records)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | Stable unique id (e.g. `component.button`, `token.color.primary.default`). |
| `name` | string | yes | Human-facing name. |
| `kind` | `component` \| `primitive` \| `layout` \| `pattern` \| `token` \| `theme` \| `plugin` | yes | Element kind. |
| `version` | string | yes | Version introduced / last meaningfully changed. |
| `purpose` | string | yes | One-sentence description. |
| `category` | string | yes | Grouping (e.g. `controls`, `layout`, `feedback`). |
| `status` | `stable` \| `beta` \| `experimental` \| `deprecated` \| `planned` | yes | Lifecycle status. |
| `tags` | string[] | no | Searchable keywords. |
| `dependencies` | string[] | no | Ids of other registered elements this one depends on. |
| `supportedThemes` | string[] | no | Themes validated against. |
| `accessibility` | `AccessibilitySpec` | no | Role, keyboard, ARIA, WCAG. |
| `responsive` | `ResponsiveSpec` | no | Responsive behavior. |
| `motion` | `MotionSpec` | no | Motion tokens + reduced-motion behavior. |
| `examples` | `UsageExample[]` | no | Copy-pasteable usage examples. |
| `migration` | `ChangeEntry[]` | no | Change history. |
| `breakingChanges` | `ChangeEntry[]` | no | Subset of `migration` flagged breaking. |
| `documentation` | string | no | Doc path or URL. |
| `source` | string | no | Module specifier the element is exported from. |

---

## Component / primitive (`ComponentMetadata`)

Adds: `export` (function name), `props` (`PropSpec[]`), `slots`, `events`, `variants`, `supportedLayouts`.

```typescript
import { defineComponent } from 'plantasonic-design-system/ai';

export const meta = defineComponent({
  id: 'component.button',
  name: 'Button',
  kind: 'component',
  export: 'button',
  version: '1.3.0',
  purpose: 'Token-driven action trigger.',
  category: 'controls',
  status: 'stable',
  variants: ['primary', 'secondary', 'ghost', 'subtle', 'danger'],
  props: [{ name: 'label', type: 'string', required: true }],
  accessibility: { role: 'button', wcag: ['2.1.1', '4.1.2'] },
  supportedLayouts: ['*'],
});
```

## Layout (`LayoutMetadata`)

Adds: `variant`, `regions` (`RegionSpec[]`), `slots`, `supportedComponents`, `recommendedPatterns`, `recommendedWorkflows`.

## Pattern (`PatternMetadata`)

Adds: `api`, `slots`, `composedOf`, `supportedLayouts`, `recommendedWorkflows`.

## Token (`TokenMetadata`)

Adds: `cssVar`, `path`, `valueType`, `values` (per theme), `usage`, `aliases`, `deprecated`, `replacement`, `origin`, `figmaReference`. Token records are **generated** from `tokens/*.tokens.json` — do not author by hand.

## Theme (`ThemeMetadata`)

Adds: `selector`, `tokenCount`.

---

## Conventions

- **Id namespacing:** `component.*`, `primitive.*`, `layout.*`, `pattern.*`, `token.*`, `theme.*`.
- **`supportedComponents` / `supportedLayouts`** accept `*` (any) and `prefix.*` wildcards.
- **Status drives compliance:** `deprecated` elements are surfaced by the validation engine and architecture export.
- **Examples are code-first:** prefer runnable snippets over prose.
