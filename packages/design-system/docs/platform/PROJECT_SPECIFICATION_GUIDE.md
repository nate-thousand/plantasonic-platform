# Project Specification Guide

`project.json` is the **authoritative source of truth** for every creative project.

## Schema

```json
{
  "specVersion": "1.0.0",
  "id": "bloom-room",
  "name": "Bloom Room",
  "description": "Audio reactive installation",
  "category": "audio-reactive-installation",
  "version": "0.1.0",
  "concept": "Optional human-authored intent",
  "brief": "Optional AI spec brief",
  "engines": ["engine.sound", "engine.visual", "engine.midi"],
  "layouts": ["instrument-canvas"],
  "components": ["panel", "toolbar"],
  "plugins": [],
  "assets": [],
  "aiCapabilities": ["compliance", "documentation", "midi-mapping"],
  "deploymentTargets": ["local", "preview", "production"],
  "documentation": ["README.md", "project.json"],
  "qualityRequirements": ["tokens", "layout", "accessibility"],
  "services": ["logging", "settings", "autosave"],
  "workflows": ["workflow.import-assets"],
  "pipeline": { "concept": "2026-06-29T00:00:00.000Z" }
}
```

## API

```typescript
import { generateSpecification, parseSpecification, serializeSpecification } from 'plantasonic-design-system/studio';

const spec = generateSpecification({ name: 'Study', brief: 'Generative art' });
const json = serializeSpecification(spec);
const parsed = parseSpecification(json);
```

## Reproducibility

```typescript
import { reproduceFromSpecification } from 'plantasonic-design-system/studio';

const result = reproduceFromSpecification(parsed);
```

Every generated file set must be reproducible from the specification.
