#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  API_SURFACE_VERSION,
  PUBLIC_EXPORTS,
  STABLE_SDK_EXPORTS,
  STABLE_GENERATED_EXPORTS,
  EXPERIMENTAL,
  INTERNAL_MODULES,
  DEPRECATED,
} from './api-surface.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'generated');
mkdirSync(OUT, { recursive: true });

const surface = {
  version: API_SURFACE_VERSION,
  generatedAt: new Date().toISOString(),
  status: '1.0-ready',
  public: PUBLIC_EXPORTS,
  sdk: STABLE_SDK_EXPORTS,
  generated: STABLE_GENERATED_EXPORTS,
  experimental: EXPERIMENTAL,
  internal: INTERNAL_MODULES,
  deprecated: DEPRECATED,
  policy: {
    public: 'Semver-stable. Breaking changes require major version.',
    internal: 'No stability guarantee. Not exported from package.json.',
    experimental: 'Metadata or API may change without major bump until promoted.',
    deprecated: 'Removed in next major unless noted.',
  },
};

writeFileSync(join(OUT, 'api-surface.json'), JSON.stringify(surface, null, 2) + '\n');
console.log(`✓ generated/api-surface.json (${PUBLIC_EXPORTS.length + STABLE_SDK_EXPORTS.length + STABLE_GENERATED_EXPORTS.length} stable exports)`);
