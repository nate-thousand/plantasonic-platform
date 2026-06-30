# Workspace Guide

Workspace regions, Creative Workspace layout, and project persistence.

## Creative Workspace (Design System)

Layout is owned by `plantasonic-design-system/creative-workspace`. The platform demo uses the **instrument** preset: fullscreen stage with floating transport, inspector, preset browser, and status HUD.

```typescript
import { renderCreativeWorkspace, bindCreativeWorkspace } from 'plantasonic-design-system/creative-workspace';
```

See [Creative Workspace Guide](https://github.com/nate-thousand/plantasonic-design-system/blob/main/docs/platform/CREATIVE_WORKSPACE_GUIDE.md) in the Design System repo.

## Workspace regions

| Region id | DOM selector | Purpose |
|-----------|--------------|---------|
| `stage` | `[data-ps-region="stage"]` | Visual canvas mount point |
| `transport` | `[data-ps-cw-surface="transport"]` | Floating play/stop, tempo |
| `inspector` | `[data-ps-cw-surface="inspector"]` | Floating parameter panels |
| `preset-browser` | `[data-ps-cw-surface="browser"]` | Floating preset bundle list |
| `status` | `[data-ps-cw-surface="hud"]` | Metrics, project controls, event log |

## Configuration

```typescript
export const workspaceConfig: WorkspaceConfig = {
  regions: [
    { id: 'stage', label: 'Stage' },
    { id: 'transport', label: 'Transport' },
    // ...
  ],
};
```

## Region binding

`mountInstrumentApp()` binds platform regions to Creative Workspace floating surfaces. Thin apps (`plantasonic-v2`, `plantasonic-reference`) inherit this automatically.

## Project persistence

- Save/load/export/import/reset via `createWorkspacePersistence()`
- State includes: active bundle, adapter parameters, bridge, workspace, plugins, UI

## Cross references

- Skill: `project-persistence`
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- [SDK_GUIDE.md](./SDK_GUIDE.md)
- Example: `examples/workspace/`
