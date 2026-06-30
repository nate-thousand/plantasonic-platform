#!/usr/bin/env node
/**
 * plantasonic — unified Plantasonic Platform CLI
 *
 * Usage:
 *   plantasonic create <prototype-type> <app-slug> [options]
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createApp,
  detectMonorepoRoot,
  parsePlantasonicCreateArgs,
  printCreateResult,
  printPlantasonicHelp,
} from '../lib/create-app.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === '--help' || command === '-h') {
    printPlantasonicHelp();
    process.exit(0);
  }

  if (command !== 'create') {
    console.error(`Unknown command: ${command}`);
    printPlantasonicHelp();
    process.exit(1);
  }

  const { options, prototypeType, slug } = parsePlantasonicCreateArgs(rest);

  if (options.help || !prototypeType || !slug) {
    printPlantasonicHelp();
    process.exit(options.help ? 0 : 1);
  }

  const result = createApp({
    slug,
    prototypeType,
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
