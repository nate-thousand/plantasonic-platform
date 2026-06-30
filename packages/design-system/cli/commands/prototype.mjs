import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createProject } from '../../src/platform/index.ts';
import { isPrototypeType, planFromBrief } from '../../src/prototype/index.ts';
import { readPackageVersion, toKebab } from '../lib/utils.mjs';

function writeFiles(targetDir, files, vars) {
  for (const file of files) {
    let content = file.content;
    for (const [key, value] of Object.entries(vars)) {
      content = content.split(key).join(value);
    }
    const target = join(targetDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }
}

function dsDependency() {
  return process.env.PLANTASONIC_DS_PATH
    ? `file:${process.env.PLANTASONIC_DS_PATH}`
    : 'github:nate-thousand/plantasonic-design-system';
}

export async function prototypeCreateCommand(args) {
  let type = null;
  let name = null;
  let dir = '.';
  let brief = null;
  const install = !args.includes('--no-install');

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--dir' || arg === '-d') dir = args[++i];
    else if (arg === '--spec' || arg === '-s') brief = args[++i];
    else if (arg === '--no-install') {
      /* skip */
    } else if (!arg.startsWith('-')) {
      if (!type) type = arg;
      else if (!name) name = arg;
    }
  }

  if (!name) {
    throw new Error('Prototype name required. Usage: plantasonic create <type> <name>');
  }

  let result;
  if (brief && type && isPrototypeType(type)) {
    result = createProject({ type, name, brief, documentation: true });
  } else if (brief) {
    const { planFromBrief } = await import('../../src/prototype/index.ts');
    const plan = planFromBrief(brief, name);
    result = createProject({ type: plan.type, name, brief, documentation: true });
  } else if (!type || !isPrototypeType(type)) {
    throw new Error(`Unknown prototype type "${type}". Run: plantasonic list prototypes`);
  } else {
    result = createProject({ type, name, documentation: true });
  }

  const slug = result.plan.slug || toKebab(name);
  const targetDir = join(dir, slug);

  if (existsSync(targetDir)) {
    throw new Error(`Target already exists: ${targetDir}`);
  }

  writeFiles(targetDir, result.files, { '__DS_DEPENDENCY__': dsDependency() });

  console.log(`Creating prototype "${result.plan.title}" (${result.plan.type})…`);
  console.log(`✓ Created ${targetDir}/`);
  console.log(`  Layout: ${result.plan.layout} · Engines: ${result.manifest.engines.join(', ')} · Files: ${result.files.length}`);

  if (install) {
    console.log('Installing dependencies…');
    const installResult = spawnSync('npm', ['install'], { cwd: targetDir, stdio: 'inherit' });
    if (installResult.status !== 0) throw new Error('npm install failed');
    console.log('✓ Dependencies installed');
  }

  console.log(`
Next steps:
  cd ${slug}
  npm run dev
  npm run validate

Design System v${readPackageVersion()} · Prototype Platform Guide: docs/platform/PROTOTYPE_PLATFORM_GUIDE.md
`);
}

export async function specCommand(args) {
  let brief = null;
  let name = null;
  let dir = '.';
  let type = null;
  const passthrough = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--name' || arg === '-n') name = args[++i];
    else if (arg === '--dir' || arg === '-d') dir = args[++i];
    else if (arg === '--type' || arg === '-t') type = args[++i];
    else if (arg === '--no-install') passthrough.push('--no-install');
    else if (!arg.startsWith('-') && !brief) brief = arg;
  }

  if (!brief) throw new Error('Brief required. Usage: plantasonic spec "<brief>" --name "My Prototype"');
  if (!name) throw new Error('Name required. Usage: plantasonic spec "<brief>" --name "My Prototype"');

  const resolvedType = type && isPrototypeType(type) ? type : planFromBrief(brief, name).type;

  await prototypeCreateCommand([
    resolvedType,
    name,
    '--spec',
    brief,
    ...(dir !== '.' ? ['--dir', dir] : []),
    ...passthrough,
  ]);
}
