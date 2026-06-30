/**
 * Quality framework — every app inherits testing, linting, compliance, and docs validation.
 */
import { validateApplication } from '../ai/validate.ts';
import { validatePrototypeStructure, validateGeneratedFiles } from '../prototype/validate.ts';
import type { PlatformValidationCheck, PlatformValidationReport } from './types.ts';
import type { ProjectManifest } from './types.ts';

function check(id: string, label: string, ok: boolean, message?: string): PlatformValidationCheck {
  return { id, label, ok, message };
}

/** Standard quality gates inherited by every platform project. */
export const QUALITY_GATES = [
  { id: 'tokens', label: 'Token validation (no hardcoded colors)' },
  { id: 'layout', label: 'Layout / prototype structure' },
  { id: 'components', label: 'Component compliance (no duplicates)' },
  { id: 'accessibility', label: 'Accessibility defaults (lang, theme, reduced motion)' },
  { id: 'documentation', label: 'Documentation files present' },
  { id: 'build', label: 'Build script configured' },
  { id: 'dependencies', label: 'Design System dependency declared' },
  { id: 'manifest', label: 'Project manifest valid' },
] as const;

export function validateManifest(manifest: ProjectManifest): PlatformValidationReport {
  const checks: PlatformValidationCheck[] = [
    check('manifest:id', 'Project id set', !!manifest.id),
    check('manifest:type', 'Application type set', !!manifest.type),
    check('manifest:engines', 'Engines listed', Array.isArray(manifest.engines)),
    check('manifest:deps', 'Dependencies declared', Object.keys(manifest.dependencies).length > 0),
    check('manifest:docs', 'Documentation paths listed', manifest.documentation.length > 0),
    check('manifest:deploy', 'Deployment target set', !!manifest.deployment.target),
  ];
  return { ok: checks.every((c) => c.ok), checks };
}

/** Validate a project directory (structure + compliance + manifest). */
export function validateProject(rootDir: string, manifest?: ProjectManifest): PlatformValidationReport {
  const checks: PlatformValidationCheck[] = [];

  const structure = validatePrototypeStructure(rootDir);
  checks.push(...structure.checks.map((c) => check(`structure:${c.id}`, c.label, c.ok, c.message)));

  if (manifest) {
    const manifestReport = validateManifest(manifest);
    checks.push(...manifestReport.checks);
  }

  return { ok: checks.every((c) => c.ok), checks };
}

/** Validate in-memory generated project files before write. */
export function validateProjectFiles(
  files: Array<{ path: string; content: string }>,
  manifest: ProjectManifest,
): PlatformValidationReport {
  const checks: PlatformValidationCheck[] = [];

  const proto = validateGeneratedFiles(files);
  checks.push(...proto.checks.map((c) => check(`proto:${c.id}`, c.label, c.ok, c.message)));

  const compliance = validateApplication(files.filter((f) => /\.(css|scss|ts)$/.test(f.path)));
  checks.push(
    check('compliance:errors', 'No compliance errors', compliance.errorCount === 0, `${compliance.errorCount} errors`),
  );

  const manifestReport = validateManifest(manifest);
  checks.push(...manifestReport.checks);

  checks.push(
    check('docs:platform', 'Platform manifest file', files.some((f) => f.path === 'platform.json')),
    check('docs:deploy', 'Deployment docs', files.some((f) => f.path === 'docs/DEPLOYMENT.md')),
  );

  return { ok: checks.every((c) => c.ok), checks };
}

/** Generate inherited quality config files for a project. */
export function generateQualityConfig(): Record<string, string> {
  return {
    'scripts/quality.mjs': `#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { validateProject } from 'plantasonic-design-system/platform';

const manifest = JSON.parse(readFileSync('platform.json', 'utf8'));
const report = validateProject('.', manifest);
for (const c of report.checks) console.log(\`[\${c.ok ? '✓' : '✗'}] \${c.label}\`);
if (!report.ok) process.exit(1);
console.log('Quality gates passed');
`,
  };
}
