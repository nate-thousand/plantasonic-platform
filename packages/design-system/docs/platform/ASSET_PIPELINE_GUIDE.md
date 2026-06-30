# Asset Pipeline Guide

Centralized asset management — applications reference shared assets instead of duplicating files.

---

## Supported kinds

`image`, `video`, `audio`, `model`, `font`, `glyph`, `texture`, `preset`, `lut`, `particle`

---

## Register assets

```typescript
import { defineAsset, registerAsset, assetRegistry } from 'plantasonic-design-system/platform';

defineAsset('texture', 'Noise Tile', 'assets://textures/noise.png', {
  tags: ['procedural', 'tileable'],
  metadata: { width: 512, height: 512 },
});

// Query by kind or tag
assetRegistry.query({ kind: 'texture', tag: 'procedural' });
```

Use `assets://` URIs in manifests. Physical storage (local, CDN, blob) is resolved by the platform storage service at runtime.

---

## Project manifest

```json
{
  "assets": ["assets://textures/noise.png", "assets://audio/ambient-loop.wav"]
}
```

---

## Workflow integration

Import pipelines use `workflow.import-assets`:

```typescript
import { getWorkflows } from 'plantasonic-design-system/platform';

const wf = getWorkflows().find((w) => w.id === 'workflow.import-assets');
// invoke: platform.importAssets → outputs: assetIds
```

Texture generation uses `workflow.generate-textures` with AI/procedural backends.

---

## Presets as assets

Preset records (`definePreset`) can reference asset URIs as dependencies. Export/import via `exportPresets()` / `importPresets()` for sharing across projects.
