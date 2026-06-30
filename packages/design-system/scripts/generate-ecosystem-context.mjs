#!/usr/bin/env node
/**
 * Generate ecosystem AI context export → generated/ecosystem/
 * Run: npm run generate:ecosystem-context
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getPlatformArchitecture,
  getEngines,
  getWorkflows,
  getServices,
  buildEcosystemContext,
  WORKFLOW_CATALOG,
  ENGINE_CATALOG,
  SERVICE_CATALOG,
  PLATFORM_SDK_VERSION,
} from '../src/platform/index.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'generated/ecosystem');
mkdirSync(OUT, { recursive: true });

const meta = { generatedAt: new Date().toISOString(), sdkVersion: PLATFORM_SDK_VERSION };

writeFileSync(join(OUT, 'architecture.json'), JSON.stringify({ ...meta, ...getPlatformArchitecture() }, null, 2) + '\n');
writeFileSync(join(OUT, 'engines.json'), JSON.stringify({ ...meta, engines: getEngines() }, null, 2) + '\n');
writeFileSync(join(OUT, 'workflows.json'), JSON.stringify({ ...meta, workflows: getWorkflows() }, null, 2) + '\n');
writeFileSync(join(OUT, 'services.json'), JSON.stringify({ ...meta, services: getServices() }, null, 2) + '\n');
writeFileSync(join(OUT, 'ecosystem.json'), JSON.stringify({ ...meta, ...buildEcosystemContext() }, null, 2) + '\n');
writeFileSync(
  join(OUT, 'index.json'),
  JSON.stringify(
    {
      ...meta,
      description: 'Plantasonic Creative Ecosystem — AI context manifest',
      files: ['architecture.json', 'engines.json', 'workflows.json', 'services.json', 'ecosystem.json'],
      counts: {
        engines: ENGINE_CATALOG.length,
        workflows: WORKFLOW_CATALOG.length,
        services: SERVICE_CATALOG.length,
      },
    },
    null,
    2,
  ) + '\n',
);

console.log(`✓ generated/ecosystem/ (6 files, ${ENGINE_CATALOG.length} engines, ${WORKFLOW_CATALOG.length} workflows)`);
