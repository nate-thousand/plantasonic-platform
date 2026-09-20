#!/usr/bin/env node
/**
 * Refresh themes/default from the design system's theme token files.
 *
 * themes/default/tokens/*.json are byte-for-byte mirrors of the sibling
 * plantasonic-design-system repository's theme.dark / theme.light token files.
 * Run after pulling a new design-system version:
 *
 *   pnpm themes:sync
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DS = resolve(ROOT, '..', 'plantasonic-design-system');
const THEME_DIR = join(ROOT, 'themes', 'default');

const FILES = ['theme.dark.tokens.json', 'theme.light.tokens.json'];

if (!existsSync(join(DS, 'package.json'))) {
  console.error(`Design system not found at ${DS}`);
  process.exit(1);
}

const dsVersion = JSON.parse(readFileSync(join(DS, 'package.json'), 'utf8')).version;

for (const file of FILES) {
  copyFileSync(join(DS, 'tokens', file), join(THEME_DIR, 'tokens', file));
  console.log(`✓ themes/default/tokens/${file}`);
}

const manifestPath = join(THEME_DIR, 'theme.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.source.version = dsVersion;
manifest.source.syncedAt = new Date().toISOString().slice(0, 10);
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ themes/default/theme.json (design system ${dsVersion})`);
