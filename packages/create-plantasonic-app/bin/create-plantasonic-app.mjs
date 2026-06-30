#!/usr/bin/env node
/**
 * create-plantasonic-app — legacy entry (defaults to instrument type)
 *
 * Usage:
 *   create-plantasonic-app <app-slug> [--type instrument] [options]
 *
 * Prefer: pnpm plantasonic create <type> <slug>
 */
import {
  createApp,
  detectMonorepoRoot,
  parseCreateAppArgs,
  printCreateAppHelp,
  printCreateResult,
} from '../lib/create-app.mjs';

function main() {
  const { options, slug } = parseCreateAppArgs(process.argv.slice(2));

  if (options.help || !slug) {
    printCreateAppHelp();
    process.exit(options.help ? 0 : 1);
  }

  const result = createApp({
    slug,
    prototypeType: options.prototypeType,
    concept: options.concept,
    name: options.name,
    port: options.port,
    output: options.output,
    force: options.force,
    cwd: process.cwd(),
  });

  printCreateResult(result, { monorepoRoot: detectMonorepoRoot(process.cwd()) });
}

try {
  main();
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
