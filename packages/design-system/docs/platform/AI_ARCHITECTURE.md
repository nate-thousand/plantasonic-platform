# AI Architecture Guide

The Plantasonic Design System is **AI-native**: every exported component, primitive, layout, pattern, token, theme, and workflow describes itself with structured metadata so the system is understandable by both humans and AI agents. The Design System — not any individual application — is the authoritative source of truth.

AI capabilities live in the Design System so every application benefits automatically. Applications do not build their own AI features against the design layer; they consume the shared SDK.

---

## Layers

```
tokens/*.tokens.json                      W3C design tokens (source of truth)
        ↓ scripts/lib/ai-tokens.mjs
src/ai/tokens.generated.ts                Typed token + theme metadata
src/ai/{components,layouts,patterns}.ts   Hand-authored metadata records
        ↓
src/ai/registry.ts                        Registry + knowledge graph
src/ai/{sdk,validate,generators,plugin}   Public surface
        ↓ scripts/generate-ai-context.mjs
generated/ai/*.json                       Machine-readable context export
docs/generated/ai/*.md                    Registry-derived documentation
```

- **Metadata layer** (`src/ai/metadata.ts`) — the specification every record conforms to. See [Metadata Specification](./METADATA_SPECIFICATION.md).
- **Registries** (`src/ai/registry.ts`) — searchable Component, Layout, Pattern, Token, and Theme registries unified behind one `Registry`. See [Registry Guide](./REGISTRY_GUIDE.md).
- **Knowledge graph** — relationships (component → token, layout → component, pattern → layout, theme → token) enabling impact analysis before changes.
- **Validation engine** (`src/ai/validate.ts`) — audits applications for compliance. See [Validation Guide](./VALIDATION_GUIDE.md) and [Application Compliance Guide](./APPLICATION_COMPLIANCE_GUIDE.md).
- **Generators** (`src/ai/generators.ts`) — official scaffolds that follow conventions automatically. See [Generator Guide](./GENERATOR_GUIDE.md).
- **Plugins** (`src/ai/plugin.ts`) — extend the system without modifying core source. See [Plugin Guide](./PLUGIN_GUIDE.md).
- **Public SDK** (`src/ai/sdk.ts`) — the stable API consumed identically by applications, build tools, and AI assistants.

---

## Consuming the platform

### TypeScript SDK (applications, build tools, AI tooling)

```typescript
import {
  getComponents,
  getLayouts,
  getPatterns,
  getTokens,
  getThemes,
  getKnowledgeGraph,
  getImpact,
  validateApplication,
  generateDocumentation,
} from 'plantasonic-design-system/ai';

const buttons = getComponents().filter((c) => c.category === 'controls');
const report = validateApplication([{ path: 'app.css', content }]);
const impacted = getImpact('token.color.primary.default');
```

### JSON context export (any language / AI agent)

The canonical machine-readable artifacts live in `generated/ai/` and are published with the package:

| File | Contents |
| --- | --- |
| `index.json` | Manifest: spec version, summary counts, file list |
| `components.json` | All component + primitive metadata |
| `layouts.json` | All layout metadata |
| `patterns.json` | All pattern metadata |
| `tokens.json` | All token metadata (values, aliases, origin) |
| `themes.json` | All theme metadata |
| `registry.json` | Every record + summary |
| `knowledge-graph.json` | Nodes + relationship edges |
| `architecture.json` | Layered architecture summary |
| `compliance.json` | Validation rule catalog |

These let AI tools understand the Design System without parsing source code.

```typescript
import manifest from 'plantasonic-design-system/generated/ai/index.json' assert { type: 'json' };
```

---

## Regeneration

The AI layer is regenerated as part of the standard build:

```bash
npm run build          # includes ai-tokens, ai-context, ai-docs
npm run ai:context     # regenerate only the AI artifacts
```

Generated files (`src/ai/tokens.generated.ts`, `generated/ai/*.json`, `docs/generated/ai/*.md`) must not be edited manually.

---

## Design principles

1. **Single source of truth** — metadata is authored once; tokens derive from `tokens/*.tokens.json`. Documentation is generated, not duplicated.
2. **Discover via registry, not filesystem** — applications and AI tools query the registry/SDK.
3. **Additive and backward compatible** — the AI layer adds a new `./ai` export and generated artifacts; no existing API changes.
4. **Governed** — applications can be validated against Design System rules in CI.
