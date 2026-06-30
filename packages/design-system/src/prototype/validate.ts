/**
 * Validate a generated prototype directory structure and source.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { validateApplication } from '../ai/validate.ts';
import type { PrototypeValidationCheck, PrototypeValidationReport } from './types.ts';

const REQUIRED_PATHS = [
  'package.json',
  'vite.config.ts',
  'index.html',
  'vercel.json',
  'src/main.ts',
  'src/prototype-config.ts',
  'src/styles/main.scss',
  'scripts/validate.mjs',
  'README.md',
  'ROADMAP.md',
  'CHANGELOG.md',
];

function collectSourceFiles(dir: string, root: string, out: Array<{ path: string; content: string }> = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules') continue;
    const st = statSync(full);
    if (st.isDirectory()) collectSourceFiles(full, root, out);
    else if (/\.(css|scss|ts|tsx)$/.test(entry)) {
      out.push({ path: full.replace(root + '/', ''), content: readFileSync(full, 'utf8') });
    }
  }
  return out;
}

function check(id: string, label: string, ok: boolean, message?: string): PrototypeValidationCheck {
  return { id, label, ok, message };
}

/** Validate filesystem structure + design system compliance of a prototype directory. */
export function validatePrototypeStructure(rootDir: string): PrototypeValidationReport {
  const checks: PrototypeValidationCheck[] = [];

  for (const rel of REQUIRED_PATHS) {
    checks.push(check(`file:${rel}`, `Required file: ${rel}`, existsSync(join(rootDir, rel))));
  }

  const pkgPath = join(rootDir, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    checks.push(
      check('dep:ds', 'Design System dependency', !!pkg.dependencies?.['plantasonic-design-system']),
      check('script:validate', 'Validation script in package.json', !!pkg.scripts?.validate),
      check('script:build', 'Build script in package.json', !!pkg.scripts?.build),
    );
  }

  const mainScss = join(rootDir, 'src/styles/main.scss');
  if (existsSync(mainScss)) {
    const scss = readFileSync(mainScss, 'utf8');
    checks.push(
      check('tokens:css', 'Token CSS layer imported', scss.includes('@ds/scss/bootstrap-theme') || scss.includes('variables')),
      check('motion:scss', 'Motion system imported', scss.includes('@ds/scss/motion')),
      check('a11y:reduced-motion', 'Reduced motion defaults', scss.includes('prefers-reduced-motion')),
      check('style:no-hex', 'No hardcoded hex in main.scss', !/#[0-9a-fA-F]{3,8}\b/.test(scss)),
    );
  }

  const mainTs = join(rootDir, 'src/main.ts');
  if (existsSync(mainTs)) {
    const main = readFileSync(mainTs, 'utf8');
    checks.push(
      check('tokens:import', 'Token CSS imported in main', main.includes('variables.css')),
      check('config:prototype', 'Prototype config wired', main.includes('prototype-config')),
    );
  }

  const indexHtml = join(rootDir, 'index.html');
  if (existsSync(indexHtml)) {
    const html = readFileSync(indexHtml, 'utf8');
    checks.push(
      check('a11y:lang', 'Document language set', html.includes('lang=')),
      check('theme:data', 'Theme attribute on html', html.includes('data-theme')),
    );
  }

  return { ok: checks.every((c) => c.ok), checks };
}

/** Full validation: structure + AI compliance engine on source files. */
export function validatePrototype(rootDir: string): PrototypeValidationReport {
  const structure = validatePrototypeStructure(rootDir);
  const srcFiles = collectSourceFiles(join(rootDir, 'src'), rootDir);
  const compliance = validateApplication(srcFiles);

  const checks = [
    ...structure.checks,
    check('compliance:errors', 'No compliance errors', compliance.errorCount === 0, `${compliance.errorCount} error(s)`),
  ];
  if (compliance.warningCount > 0) {
    checks.push(check('compliance:warnings', 'Compliance warnings', true, `${compliance.warningCount} warning(s)`));
  }

  return { ok: checks.every((c) => c.ok), checks };
}

/** Validate in-memory generated files before writing to disk. */
export function validateGeneratedFiles(files: Array<{ path: string; content: string }>): PrototypeValidationReport {
  const checks: PrototypeValidationCheck[] = [];
  const paths = new Set(files.map((f) => f.path));

  for (const rel of REQUIRED_PATHS) {
    checks.push(check(`file:${rel}`, `Required file: ${rel}`, paths.has(rel)));
  }

  const pkg = files.find((f) => f.path === 'package.json');
  if (pkg) {
    const json = JSON.parse(pkg.content);
    checks.push(check('dep:ds', 'Design System dependency', !!json.dependencies?.['plantasonic-design-system']));
  }

  const scss = files.find((f) => f.path === 'src/styles/main.scss')?.content ?? '';
  checks.push(
    check('motion:scss', 'Motion system imported', scss.includes('@ds/scss/motion')),
    check('a11y:reduced-motion', 'Reduced motion defaults', scss.includes('prefers-reduced-motion')),
  );

  const compliance = validateApplication(files.filter((f) => /\.(css|scss|ts)$/.test(f.path)));
  checks.push(check('compliance:errors', 'No compliance errors', compliance.errorCount === 0));

  return { ok: checks.every((c) => c.ok), checks };
}
