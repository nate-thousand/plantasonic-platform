---
name: plugin-development
description: Develops platform plugins with manifest, capabilities, and register() contributions. Use when adding app extensions, preset plugins, or adapter metadata plugins.
---

# Skill: Plugin Development

## Purpose

Create `PlatformPlugin` entries that extend apps through the platform PluginManager.

## Inputs

- Plugin id, name, version, description
- Capabilities array (`preset-bundles`, `sound-adapter`, `visual-adapter`, `documentation`, etc.)
- `register(context)` implementation
- Optional documentation metadata

## Outputs

- Plugin manifest + register function
- Contributions: preset bundles, adapter declarations, performance mappings, docs metadata
- Plugin listed in app `InstrumentAppContent.plugins`

## Required packages

- `@plantasonic/platform-types` (plugin interfaces)
- `@plantasonic/platform` (PluginManager at runtime)

## Validation checklist

- [ ] Unique plugin id
- [ ] Capabilities match actual register() behavior
- [ ] Uses `PluginContext` APIs only (no direct engine imports in plugin unless declaring adapters)
- [ ] `defaultEnabled` set appropriately
- [ ] Plugin errors emit `plugin:error` events

## Success criteria

- Plugin appears in platform plugin panel
- Enable/disable toggles work
- Contributions apply when enabled (bundles registered, metadata declared)
- No engine or DS code duplicated inside plugin

## Common mistakes

- Reimplementing orchestration inside plugins
- Registering bundles both in `presetBundles` array and plugin (duplicate)
- Importing engine internals instead of using context adapters
- Missing capability declarations

## Example usage

```typescript
import type { PlatformPlugin } from '@plantasonic/platform-types';

export const MY_PLUGIN: PlatformPlugin = {
  manifest: {
    id: 'my-app.seed-preset',
    name: 'Seed Preset',
    version: '1.0.0',
    capabilities: ['preset-bundles'],
    defaultEnabled: true,
  },
  register(context) {
    context.registerPresetBundle(SEED_BUNDLE);
  },
};
```

See also: `docs/PLUGIN_GUIDE.md`, `apps/plantasonic-reference/src/content/plugins.ts`.
