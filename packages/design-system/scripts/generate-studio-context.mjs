#!/usr/bin/env node
/**
 * Generate Creative Studio AI context → generated/studio/
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getStudioArchitecture,
  getAutomations,
  exportKnowledge,
  AUTOMATION_CATALOG,
  STUDIO_SDK_VERSION,
  PIPELINE_STAGES,
} from '../src/studio/index.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'generated/studio');
mkdirSync(OUT, { recursive: true });

const meta = { generatedAt: new Date().toISOString(), sdkVersion: STUDIO_SDK_VERSION };

writeFileSync(join(OUT, 'architecture.json'), JSON.stringify({ ...meta, ...getStudioArchitecture() }, null, 2) + '\n');
writeFileSync(join(OUT, 'automations.json'), JSON.stringify({ ...meta, automations: getAutomations() }, null, 2) + '\n');
writeFileSync(join(OUT, 'knowledge.json'), JSON.stringify({ ...meta, entries: exportKnowledge() }, null, 2) + '\n');
writeFileSync(
  join(OUT, 'index.json'),
  JSON.stringify(
    {
      ...meta,
      description: 'Plantasonic Creative Studio — AI context manifest',
      pipelineStages: PIPELINE_STAGES,
      files: ['architecture.json', 'automations.json', 'knowledge.json'],
      counts: { automations: AUTOMATION_CATALOG.length, pipelineStages: PIPELINE_STAGES.length },
    },
    null,
    2,
  ) + '\n',
);

console.log(`✓ generated/studio/ (4 files, ${AUTOMATION_CATALOG.length} automations, ${PIPELINE_STAGES.length} pipeline stages)`);
