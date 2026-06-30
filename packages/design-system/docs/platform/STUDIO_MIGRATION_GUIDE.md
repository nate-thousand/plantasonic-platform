# Studio Migration Guide

Migrate existing projects to the Creative Studio pipeline.

## From platform.json only

1. Create `project.json` from manifest:

```typescript
import { generateSpecification, syncSpecFromManifest } from 'plantasonic-design-system/studio';
import manifest from './platform.json';

let spec = generateSpecification({ name: manifest.name, category: manifest.type });
spec = syncSpecFromManifest(spec, manifest);
```

2. Write `project.json` and run `reproduceFromSpecification(spec)`.

## From prototype scaffold

Projects created via `createProject()` already include `platform.json`. Add `project.json`:

```bash
# Generate spec from brief
node -e "
import { createProjectFromConcept, serializeSpecification } from 'plantasonic-design-system/studio';
const r = createProjectFromConcept({ name: 'My App', brief: '...' });
console.log(serializeSpecification(r.spec));
"
```

## Upgrade design system

```typescript
import { upgradeProject, generateSpecification } from 'plantasonic-design-system/studio';

const plan = upgradeProject(generateSpecification({ name: 'X' }), 'plantasonic-design-system', '1.5.0');
// Review plan.steps before applying
```

## Token / component migrations

```typescript
import { planTokenMigration, planComponentReplacement } from 'plantasonic-design-system/studio';

planTokenMigration('token.color.primary.default');
planComponentReplacement('button', 'iconButton');
```

Always run `validateWorkspace()` after migration.
