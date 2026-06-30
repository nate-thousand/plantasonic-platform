# Workspace Guide

Two workspace concepts live in the Design System:

## Creative Workspace (UI layouts)

Reusable layout presets between the Application Shell and application content —
instrument, visualizer, installation, presentation, and studio workspaces with
floating overlays.

**Start here:** [Creative Workspace Guide](./CREATIVE_WORKSPACE_GUIDE.md)

```typescript
import { renderCreativeWorkspace } from 'plantasonic-design-system/creative-workspace';
```

## Studio Workspace (portfolio)

Multi-project portfolio orchestration — load, switch, and validate projects in a
creative studio.

**See:** [Studio Workspace Guide](./STUDIO_WORKSPACE_GUIDE.md)

```typescript
import { loadWorkspace } from 'plantasonic-design-system/studio';
```

## Instrument regions

Low-level region renderers (`renderStage`, `renderTransportRegion`, …) used by
both the instrument shell and Creative Workspace:

```typescript
import { REGION_NAMES, renderStage } from 'plantasonic-design-system/instrument';
```

See [Creative Application Guide](./CREATIVE_APPLICATION_GUIDE.md).
