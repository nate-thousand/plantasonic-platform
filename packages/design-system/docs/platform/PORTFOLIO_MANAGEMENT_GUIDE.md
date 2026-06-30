# Portfolio Management Guide

Ecosystem-wide reporting across active projects.

## Generate report

```typescript
import { generatePortfolioReport, loadWorkspace, generateSpecification } from 'plantasonic-design-system/studio';

const ws = loadWorkspace('portfolio', 'All Projects', [
  generateSpecification({ name: 'A' }),
  generateSpecification({ name: 'B', brief: 'music instrument' }),
]);

const report = generatePortfolioReport(ws);
// report.activeProjects, report.sharedDependencies, report.engineVersions, report.technicalDebt
```

## Metrics tracked

- Active projects and categories
- Shared engine / plugin usage
- Documentation coverage (0–1)
- Pipeline stage per project
- Technical debt entries from knowledge repository

## Dependency graph

```typescript
import { sharedDependencyGraph } from 'plantasonic-design-system/studio';

sharedDependencyGraph(ws);
```

## Publish workspace

```typescript
import { publishWorkspace } from 'plantasonic-design-system/studio';

publishWorkspace(ws); // report + validation
```
