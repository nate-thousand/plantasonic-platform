#!/usr/bin/env node

import { createCommand } from './commands/create.mjs';
import { listCommand } from './commands/list.mjs';
import { prototypeCreateCommand, specCommand } from './commands/prototype.mjs';
import { isPrototypeType } from '../src/prototype/index.ts';

const [,, command, ...args] = process.argv;

const HELP = `Plantasonic Design System CLI

Usage:
  plantasonic create <name> [--template <id>] [--dir <path>]
  plantasonic create <prototype-type> <name> [--dir <path>]
  plantasonic spec "<brief>" --name "<display name>" [--type <prototype-type>]
  plantasonic list [prototypes|templates]
  plantasonic --help

Starter templates:
  react-vite       Vite + React + Application Shell (recommended)
  react-bootstrap  React + Bootstrap + Application Shell
  nextjs           Next.js App Router + Application Shell
  electron         Electron + Vite + Application Shell

Prototype types (examples):
  generative-art              generative-art flower-study
  audio-reactive-installation audio-reactive bloom-room
  visual-synth                visual-synth signal-grid
  music-instrument            music-instrument pad-lab
  … run \`plantasonic list prototypes\` for all 12 types

Examples:
  npx plantasonic create my-app
  npx plantasonic create generative-art flower-study
  npx plantasonic spec "Audio reactive flower installation with MIDI" --name "Bloom Room"
`;

async function main() {
  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  try {
    if (command === 'create') {
      if (args[0] && isPrototypeType(args[0])) {
        await prototypeCreateCommand(args);
        return;
      }
      await createCommand(args);
      return;
    }
    if (command === 'spec') {
      await specCommand(args);
      return;
    }
    if (command === 'list') {
      listCommand(args[0]);
      return;
    }
    console.error(`Unknown command: ${command}\n`);
    console.log(HELP);
    process.exit(1);
  } catch (error) {
    console.error(`✗ ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
