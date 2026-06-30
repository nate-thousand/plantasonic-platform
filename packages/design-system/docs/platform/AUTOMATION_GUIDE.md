# Automation Guide

Nine built-in automations coordinate repetitive engineering tasks.

## Catalog

| ID | Purpose |
| --- | --- |
| `automation.create-prototype` | Full pipeline project generation |
| `automation.upgrade-design-system` | DS upgrade with impact plan |
| `automation.update-dependencies` | Refactoring analysis |
| `automation.generate-documentation` | Documentation pipeline stage |
| `automation.publish-packages` | Release documentation plan |
| `automation.deploy-applications` | Deployment pipeline stage |
| `automation.generate-release-notes` | Changelog / release notes |
| `automation.create-migration-guide` | Token/API migration plan |
| `automation.quality-audit` | Full workspace validation |

## Run automation

```typescript
import { runAutomation, getAutomations } from 'plantasonic-design-system/studio';

getAutomations();

const result = runAutomation('automation.create-prototype', {
  name: 'Bloom Room',
  brief: 'Audio reactive installation',
});
```

## CLI (future)

```bash
plantasonic studio run automation.create-prototype --name "Bloom Room"
```
