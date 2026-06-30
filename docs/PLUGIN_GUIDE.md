# Plugin Guide

Platform plugin development for extending applications.

## Overview

Plugins register through `PlatformPlugin` manifests and contribute via `PluginContext`.

## Capabilities

- `preset-bundles` — register unified preset bundles
- `sound-adapter` / `visual-adapter` — declare adapter metadata
- `performance-mappings` — contribute control routes
- `documentation` — metadata for plugin panel

## Plugin structure

```typescript
export const MY_PLUGIN: PlatformPlugin = {
  manifest: { id, name, version, capabilities, defaultEnabled },
  register(context) { /* contributions */ },
};
```

## PluginContext APIs

- `registerPresetBundle()`
- `declareSoundAdapter()` / `declareVisualAdapter()`
- Access to event bus, lifecycle, adapters (when wired)

## Cross references

- Skill: `plugin-development`
- [SDK_GUIDE.md](./SDK_GUIDE.md) — PluginManager API
- Example: `apps/plantasonic-reference/src/content/plugins.ts`

## Limitations (current)

- Plugin-declared panels/commands are metadata-only
- Full shell rendering of plugin UI deferred
