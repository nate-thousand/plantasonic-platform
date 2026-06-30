/**
 * Generate `src/ai/tokens.generated.ts` — typed token + theme metadata for the
 * AI SDK. Derived from `tokens/*.tokens.json`; do not edit the output manually.
 *
 * Run: `npm run generate:ai-tokens`
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokenMetadata, buildThemeMetadata } from './lib/ai-tokens.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/ai/tokens.generated.ts');

const tokens = buildTokenMetadata();
const themes = buildThemeMetadata();

const header = `/**
 * Plantasonic Design System — Generated token + theme metadata.
 *
 * Auto-generated from tokens/*.tokens.json. Do not edit manually.
 * Regenerate: npm run generate:ai-tokens
 */
import type { TokenMetadata, ThemeMetadata } from './metadata.ts';
`;

const body = `${header}
export const TOKEN_METADATA = ${JSON.stringify(tokens, null, 2)} as unknown as TokenMetadata[];

export const THEME_METADATA = ${JSON.stringify(themes, null, 2)} as unknown as ThemeMetadata[];
`;

writeFileSync(OUT, body, 'utf8');
console.log(`✓ ${OUT} (${tokens.length} tokens, ${themes.length} themes)`);
