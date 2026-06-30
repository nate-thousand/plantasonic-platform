import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import {
  copyTemplate,
  readPackageVersion,
  TEMPLATE_IDS,
  toKebab,
  toPascal,
} from '../lib/utils.mjs';

function parseArgs(args) {
  let name = null;
  let template = 'react-vite';
  let dir = '.';

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--template' || arg === '-t') {
      template = args[++i];
    } else if (arg === '--dir' || arg === '-d') {
      dir = args[++i];
    } else if (arg === '--no-install') {
      /* skip npm install */
    } else if (!arg.startsWith('-') && !name) {
      name = arg;
    }
  }

  return { name, template, dir, install: !args.includes('--no-install') };
}

export async function createCommand(args) {
  const { name, template, dir, install } = parseArgs(args);

  if (!name) throw new Error('App name required. Usage: plantasonic create <name>');
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    throw new Error('App name must start with a letter and contain only letters, numbers, -, _');
  }
  if (!TEMPLATE_IDS.includes(template)) {
    throw new Error(`Unknown template "${template}". Run: plantasonic list`);
  }

  const targetDir = join(dir, name);
  const vars = {
    '__APP_NAME__': name,
    '__APP_NAME_KEBAB__': toKebab(name),
    '__APP_NAME_PASCAL__': toPascal(name),
    '__DS_VERSION__': readPackageVersion(),
  };

  console.log(`Creating ${name} (${template})…`);
  const rel = copyTemplate(template, targetDir, vars);
  console.log(`✓ Created ${rel}/`);

  if (install) {
    console.log('Installing dependencies…');
    const result = spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit' });
    if (result.status !== 0) throw new Error('npm install failed');
    console.log('✓ Dependencies installed');
  }

  console.log(`
Next steps:
  cd ${rel}
  npm run dev

Configure Application Shell: edit src/shell-config.ts (lib/shell-config.ts for Next.js)
Docs: docs/platform/APPLICATION_SHELL.md in the design system repo
Showcase reference: npm run showcase:dev (in design system repo)
`);
}
