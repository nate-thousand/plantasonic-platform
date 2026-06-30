# Studio Workspace Guide

Multi-project portfolio workspace APIs (`loadWorkspace`, `workspaceManager`).

> For **UI layout presets** (instrument, visualizer, studio layouts as floating
> overlays), see [Creative Workspace Guide](./CREATIVE_WORKSPACE_GUIDE.md).

## Load a workspace

```typescript
import { loadWorkspace, generateSpecification, validateWorkspace } from 'plantasonic-design-system/studio';

const ws = loadWorkspace('main', 'Main Studio', [
  generateSpecification({ name: 'Flower Study', category: 'generative-art' }),
  generateSpecification({ name: 'Pad Lab', brief: 'music instrument' }),
]);

validateWorkspace(ws);
```

## Switch projects

```typescript
import { workspaceManager } from 'plantasonic-design-system/studio';

workspaceManager.switchProject('main', 'pad-lab');
```

## Command palette

```typescript
import { workspaceCommands } from 'plantasonic-design-system/studio';

workspaceCommands(ws); // switch:*, validate
```

## From project.json files

```typescript
import { loadWorkspaceFromFiles } from 'plantasonic-design-system/studio';

loadWorkspaceFromFiles('main', 'Studio', [json1, json2]);
```
