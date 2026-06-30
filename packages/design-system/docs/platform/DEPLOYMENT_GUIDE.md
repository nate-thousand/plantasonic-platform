# Deployment Guide

Standardized deployment targets — documentation generated automatically with every project.

---

## Targets

| Target | Use case |
| --- | --- |
| `local` | `npm run dev` |
| `preview` | Vercel/Netlify preview URL |
| `production` | Public production deploy |
| `desktop` | Electron/Tauri wrapper |
| `mobile` | Capacitor / responsive PWA |
| `pwa` | Installable progressive web app |
| `embedded` | Kiosk / installation hardware |

---

## Generated artifacts

`createProject()` includes:

- `vercel.json` — static Vite export
- `docs/DEPLOYMENT.md` — target-specific checklist
- `manifest.webmanifest` when `pwa: true`

```typescript
import { generateVercelConfig, generateDeployDocs, markDeployed } from 'plantasonic-design-system/platform';

const config = generateVercelConfig({ framework: 'vite', output: 'dist' });
const docs = generateDeployDocs(manifest, 'preview');

markDeployed(manifest, { target: 'production', status: 'deployed', url: 'https://…' });
```

---

## CLI workflow

```bash
npm run build
npm run validate    # structure + compliance + platform checks
# Deploy dist/ to your target
```

Update `platform.json` → `deployment` after promoting to production.

---

## publishPrototype()

```typescript
import { publishPrototype } from 'plantasonic-design-system/platform';

const { manifest, deploymentDocs } = publishPrototype(manifest, {
  target: 'preview',
  url: 'https://flower-study.vercel.app',
});
```

Registers deployment status in the project registry and refreshes deployment documentation.
