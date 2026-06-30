import { TEMPLATE_IDS } from '../lib/utils.mjs';
import { PROTOTYPE_TYPES } from '../../src/prototype/index.ts';

const DESCRIPTIONS = {
  'react-vite': 'Vite + React + Application Shell — recommended default',
  'react-bootstrap': 'React + Bootstrap + Application Shell',
  nextjs: 'Next.js App Router + Application Shell',
  electron: 'Electron + Vite + Application Shell',
};

export function listCommand(scope) {
  if (scope === 'prototypes') {
    console.log('Plantasonic prototype types:\n');
    for (const t of PROTOTYPE_TYPES) {
      console.log(`  ${t.type.padEnd(28)} ${t.name}`);
    }
    console.log('\nUsage: plantasonic create <type> <name>');
    return;
  }

  if (scope === 'templates') {
    console.log('Plantasonic starter templates:\n');
    for (const id of TEMPLATE_IDS) {
      console.log(`  ${id.padEnd(18)} ${DESCRIPTIONS[id]}`);
    }
    return;
  }

  console.log('Plantasonic prototype types:\n');
  for (const t of PROTOTYPE_TYPES) {
    console.log(`  ${t.type.padEnd(28)} ${t.name}`);
  }
  console.log('\nStarter templates:\n');
  for (const id of TEMPLATE_IDS) {
    console.log(`  ${id.padEnd(18)} ${DESCRIPTIONS[id]}`);
  }
  console.log('\nRun: plantasonic list prototypes | plantasonic list templates');
}
