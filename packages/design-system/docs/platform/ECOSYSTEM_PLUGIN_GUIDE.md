# Plugin Development Guide

Ecosystem plugins extend the AI plugin host with panels, renderers, effects, presets, workflows, and validation rules. Plugins install without modifying core source.

---

## Quick start

```typescript
import { defineEcosystemPlugin, createEcosystemPluginHost } from 'plantasonic-design-system/platform';

const host = createEcosystemPluginHost().useEcosystem(
  defineEcosystemPlugin({
    name: 'glow-pack',
    version: '1.0.0',
    contributes: {
      effects: [{ id: 'fx.glow', name: 'Glow', category: 'post' }],
      panels: [{ id: 'panel.glow', title: 'Glow', render: 'renderGlowPanel' }],
      workflows: [{
        id: 'workflow.apply-glow',
        name: 'Apply Glow Preset',
        purpose: 'Batch-apply glow effect to selected assets',
        invoke: 'glow.apply',
      }],
    },
  }),
);
```

---

## Contribution types

| Type | Purpose |
| --- | --- |
| `components`, `layouts`, `patterns`, `themes`, `tokens` | Inherited from AI plugins (`definePlugin`) |
| `panels` | Floating or docked UI regions |
| `renderers` | Canvas/visual adapter registrations |
| `effects` | Post-processing or generative effects |
| `presets` | Versioned parameter bundles |
| `workflows` | Callable automation steps |
| `validationRules` | Project compliance extensions |
| `commands`, `documentation` | Shell commands and docs pages |

---

## Installing into a project

```typescript
import { installPlugin } from 'plantasonic-design-system/platform';

manifest.plugins = installPlugin(manifest, 'glow-pack');
```

Add the plugin package to `platform.json` → `plugins` and declare it in `dependencies` if published separately.

---

## Dependencies

Plugins may declare `dependsOn: ['other-plugin']`. The host throws if dependencies are not registered first.

---

## AI plugins vs ecosystem plugins

- **AI plugins** (`plantasonic-design-system/ai`) — components, layouts, registry contributions.
- **Ecosystem plugins** (`createEcosystemPluginHost`) — wraps AI host + creative runtime contributions.

Use `host.use()` for AI-only plugins and `host.useEcosystem()` for full ecosystem extensions.

See also: [Plugin Guide](./PLUGIN_GUIDE.md) (AI layer).
