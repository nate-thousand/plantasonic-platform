# Creative Studio Guide

The **Autonomous Creative Studio** orchestrates the full lifecycle: concept → specification → architecture → generation → testing → documentation → deployment → iteration.

## Quick start

```typescript
import { createProjectFromConcept, runPipeline } from 'plantasonic-design-system/studio';

const result = createProjectFromConcept({
  name: 'Bloom Room',
  brief: 'Audio reactive installation with MIDI',
});
// result.spec, result.files, result.manifest, result.validation
```

## Pipeline stages

`concept` → `specification` → `architecture` → `roadmap` → `generation` → `implementation` → `testing` → `documentation` → `deployment` → `iteration`

Each stage produces structured artifacts (see [Project Specification](./PROJECT_SPECIFICATION_GUIDE.md)).

## Principles

- Automate **engineering** — not human creativity
- `project.json` is authoritative
- Projects are reproducible via `orchestrateProject()`
- Continuous validation throughout development

## Related guides

- [Project Specification](./PROJECT_SPECIFICATION_GUIDE.md)
- [Workspace](./WORKSPACE_GUIDE.md)
- [Automation](./AUTOMATION_GUIDE.md)
- [Knowledge Repository](./KNOWLEDGE_REPOSITORY_GUIDE.md)
- [Portfolio Management](./PORTFOLIO_MANAGEMENT_GUIDE.md)
- [Studio Migration](./STUDIO_MIGRATION_GUIDE.md)
- [Studio Architecture](./STUDIO_ARCHITECTURE_GUIDE.md)
