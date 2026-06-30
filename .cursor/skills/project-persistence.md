---
name: project-persistence
description: Configures workspace project save/load/export/import via platform persistence API. Use when implementing session state, autosave, or project files.
---

# Skill: Project Persistence

## Purpose

Persist and restore full application state through `createWorkspacePersistence()` and project state APIs.

## Inputs

- Active managers (sound, visual, bridge, presets, plugins, performance, workspace)
- Storage adapter (localStorage default, or custom)
- Application id for scoping saved state

## Outputs

- Save/load/export/import/reset controls
- `ProjectState` snapshot including preset bundle, parameters, bridge, workspace, plugins, UI
- `project:*` events on event bus

## Required packages

- `@plantasonic/platform`

## Validation checklist

- [ ] Save persists to storage adapter
- [ ] Load restores preset bundle and parameters
- [ ] Export produces valid JSON envelope
- [ ] Import validates before apply
- [ ] Reset clears storage and restores defaults
- [ ] No parallel localStorage keys in app layer duplicating platform state

## Success criteria

- Save → reload → state restored
- Export file can be imported in fresh session
- Invalid import rejected with clear error
- Project controls visible in platform status region

## Common mistakes

- Implementing separate app settings store for engine state
- Saving only partial state (missing bridge or plugin enablement)
- Bypassing `validateProjectState()` on import
- Hardcoding localStorage keys outside platform adapter

## Example usage

```typescript
import {
  createWorkspacePersistence,
  createLocalStorageAdapter,
  captureProjectState,
  applyProjectState,
} from '@plantasonic/platform';

const storage = createLocalStorageAdapter('my-app.project');
const persistence = createWorkspacePersistence({ storage, eventBus: app.eventBus });

await persistence.saveProject(captureProjectState(managers));
const loaded = await persistence.loadProject();
if (loaded) applyProjectState(loaded, managers);
```

See also: `docs/WORKSPACE_GUIDE.md`, `docs/SDK_GUIDE.md`.
