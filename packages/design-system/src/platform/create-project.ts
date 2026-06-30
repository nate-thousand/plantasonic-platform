/**
 * createProject() — lightweight client on shared platform infrastructure.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createPrototype, type CreatePrototypeResult } from '../prototype/create-prototype.ts';
import { resolvePrototypePlan } from '../prototype/spec-parser.ts';
import type { CreateProjectConfig, EngineId, ProjectManifest } from './types.ts';
import { createManifest, projectRegistry } from './projects.ts';
import { enginesForPrototype, installEngine, resolveEngineInstall } from './engines.ts';
import { defaultServices } from './services.ts';
import { generateDeployDocs, generatePwaManifest, markDeployed } from './deployment.ts';
import { validateProjectFiles, generateQualityConfig } from './quality.ts';
import { buildProjectContext, exportProjectContext } from './collaboration.ts';
import { WORKFLOW_CATALOG } from './workflows.ts';

export interface CreateProjectResult extends CreatePrototypeResult {
  manifest: ProjectManifest;
  platformFiles: Array<{ path: string; content: string }>;
}

export interface PublishResult {
  manifest: ProjectManifest;
  deploymentDocs: string;
}

function slugify(name: string): string {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

function engineDependencies(engineIds: EngineId[]): Record<string, string> {
  const deps: Record<string, string> = { 'plantasonic-design-system': 'github:nate-thousand/plantasonic-design-system' };
  for (const spec of resolveEngineInstall(engineIds)) {
    if (spec.package) deps[spec.package] = 'latest';
  }
  return deps;
}

function defaultWorkflows(type: string): string[] {
  const ids = ['workflow.import-assets', 'workflow.generate-documentation'];
  if (type.includes('audio') || type.includes('music') || type.includes('visual')) {
    ids.push('workflow.generate-visual-presets');
  }
  return ids.filter((id) => WORKFLOW_CATALOG.some((w) => w.id === id));
}

/** Generate platform layer files (manifest, services, deployment, quality). */
export function generatePlatformFiles(manifest: ProjectManifest): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];

  files.push({
    path: 'platform.json',
    content: JSON.stringify(manifest, null, 2) + '\n',
  });

  files.push({
    path: 'docs/PLATFORM.md',
    content: `# Platform Manifest — ${manifest.name}

This project is a **lightweight client** of the Plantasonic Creative Ecosystem.
It installs shared engines, services, and workflows — it does not duplicate them.

## Engines

${manifest.engines.map((e) => `- \`${e}\``).join('\n')}

## Services

${manifest.services.map((s) => `- \`${s}\``).join('\n')}

## Workflows

${manifest.workflows.map((w) => `- \`${w}\``).join('\n')}

See \`platform.json\` for the authoritative manifest.
`,
  });

  files.push({ path: 'docs/DEPLOYMENT.md', content: generateDeployDocs(manifest) });

  files.push({
    path: 'src/platform/services.ts',
    content: `/** Auto-generated platform services bootstrap. */
import { createPlatformServices } from 'plantasonic-design-system/platform';

export const services = createPlatformServices(${JSON.stringify(manifest.services)});
`,
  });

  files.push({
    path: 'src/platform/engines.ts',
    content: `/** Installed engines — import packages, never embed source. */
${manifest.engines
  .map((e) => {
    const spec = installEngine(e);
    return spec.package
      ? `// ${spec.spec.name}: npm install ${spec.package}\nexport const ${e.replace(/\./g, '_')} = '${spec.package}';`
      : `// ${spec.spec.name}: adapter placeholder in src/engines/`;
  })
  .join('\n\n')}
`,
  });

  files.push({
    path: 'docs/AI_CONTEXT.json',
    content: exportProjectContext(manifest),
  });

  if (manifest.deployment.target === 'pwa' || manifest.deployment.target === 'mobile') {
    files.push({
      path: 'public/manifest.webmanifest',
      content: generatePwaManifest({ name: manifest.name, description: manifest.description }),
    });
  }

  for (const [path, content] of Object.entries(generateQualityConfig())) {
    files.push({ path, content });
  }

  return files;
}

/**
 * Create a full ecosystem project: prototype scaffold + platform manifest,
 * engines, services, workflows, deployment, and quality inheritance.
 */
export function createProject(config: CreateProjectConfig): CreateProjectResult {
  const plan = resolvePrototypePlan({
    type: config.type as import('../prototype/types.ts').PrototypeType,
    name: config.name,
    brief: config.brief,
    documentation: true,
  });

  const engineIds = [
    ...enginesForPrototype(plan.features, plan.type),
    ...(config.engines ?? []),
  ] as EngineId[];
  const uniqueEngines = [...new Set(engineIds)];

  const manifest = createManifest({
    id: plan.slug || slugify(config.name),
    name: plan.title,
    type: plan.type,
    description: plan.description,
    layout: plan.layout,
    engines: uniqueEngines,
    plugins: config.plugins ?? [],
    assets: [],
    workflows: config.workflows ?? defaultWorkflows(plan.type),
    services: config.services ?? defaultServices(),
    dependencies: engineDependencies(uniqueEngines),
    deployment: { target: config.deployment ?? 'preview', status: 'local' },
  });

  const prototype = createPrototype({
    type: plan.type,
    name: config.name,
    brief: config.brief,
    documentation: true,
  });

  const platformFiles = generatePlatformFiles(manifest);
  const allFiles = [...prototype.files, ...platformFiles];

  const validation = validateProjectFiles(allFiles, manifest);
  if (!validation.ok) {
    const failed = validation.checks.filter((c) => !c.ok).map((c) => c.label);
    throw new Error(`Project validation failed: ${failed.join(', ')}`);
  }

  return { ...prototype, manifest, platformFiles, files: allFiles };
}

/** Write project to disk. */
export function writeProject(result: CreateProjectResult, dir: string): string {
  if (existsSync(dir)) throw new Error(`Target already exists: ${dir}`);

  for (const file of result.files) {
    let content = file.content.replace('__DS_DEPENDENCY__', 'github:nate-thousand/plantasonic-design-system');
    const target = join(dir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, 'utf8');
  }

  projectRegistry.register(result.manifest);
  return dir;
}

/** Mark project published and update manifest. */
export function publishPrototype(
  manifest: ProjectManifest,
  opts: { url?: string; status?: ProjectManifest['deployment']['status'] } = {},
): PublishResult {
  const updated = markDeployed(manifest, opts.status ?? 'production', opts.url);
  projectRegistry.register(updated);
  return {
    manifest: updated,
    deploymentDocs: generateDeployDocs(updated),
  };
}

/** Scaffold project in one call. */
export function scaffoldProject(config: CreateProjectConfig, dir: string): CreateProjectResult {
  const result = createProject(config);
  writeProject(result, dir);
  return result;
}

/** Get AI context for an registered project. */
export function getProjectContext(projectId: string) {
  const manifest = projectRegistry.get(projectId);
  if (!manifest) throw new Error(`Unknown project: ${projectId}`);
  return buildProjectContext(manifest);
}
