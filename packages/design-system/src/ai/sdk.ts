/**
 * Plantasonic Design System — Public AI SDK.
 *
 * A stable API consumed identically by applications, build tools, and AI
 * assistants. Everything is read from the {@link Registry} (the source of
 * truth) — never the filesystem.
 *
 *   import { getComponents, getTokens, validateApplication } from 'plantasonic-design-system/ai';
 */
import type {
  AnyMetadata,
  ComponentMetadata,
  LayoutMetadata,
  PatternMetadata,
  ThemeMetadata,
  TokenMetadata,
} from './metadata.ts';
import { METADATA_SPEC_VERSION } from './metadata.ts';
import { Registry, registry as defaultRegistry, type KnowledgeGraph, type RegistryQuery } from './registry.ts';
import { validateApplication } from './validate.ts';

/** Package version the SDK reports in architecture exports. */
export const SDK_VERSION = '1.5.0';

function r(registry?: Registry): Registry {
  return registry ?? defaultRegistry;
}

/** All component + primitive metadata. */
export function getComponents(registry?: Registry): ComponentMetadata[] {
  return r(registry).components();
}

/** A single component by id (e.g. `component.button`) or export name. */
export function getComponent(idOrExport: string, registry?: Registry): ComponentMetadata | undefined {
  return getComponents(registry).find((c) => c.id === idOrExport || c.export === idOrExport);
}

/** All layout metadata. */
export function getLayouts(registry?: Registry): LayoutMetadata[] {
  return r(registry).layouts();
}

export function getLayout(id: string, registry?: Registry): LayoutMetadata | undefined {
  return getLayouts(registry).find((l) => l.id === id);
}

/** All pattern metadata. */
export function getPatterns(registry?: Registry): PatternMetadata[] {
  return r(registry).patterns();
}

export function getPattern(id: string, registry?: Registry): PatternMetadata | undefined {
  return getPatterns(registry).find((p) => p.id === id);
}

/** All token metadata. */
export function getTokens(registry?: Registry): TokenMetadata[] {
  return r(registry).tokens();
}

/** A single token by id, css variable, or token path. */
export function getToken(key: string, registry?: Registry): TokenMetadata | undefined {
  return getTokens(registry).find((t) => t.id === key || t.cssVar === key || t.path === key);
}

/** All theme metadata. */
export function getThemes(registry?: Registry): ThemeMetadata[] {
  return r(registry).themes();
}

/** Arbitrary query across all registered elements. */
export function query(q: RegistryQuery, registry?: Registry): AnyMetadata[] {
  return r(registry).query(q);
}

/** The registry instance (default singleton unless one is provided). */
export function getRegistry(registry?: Registry): Registry {
  return r(registry);
}

/** The knowledge graph of relationships between elements. */
export function getKnowledgeGraph(registry?: Registry): KnowledgeGraph {
  return r(registry).knowledgeGraph();
}

/** Impact analysis — what depends on the given element. */
export function getImpact(id: string, registry?: Registry) {
  return r(registry).impactOf(id);
}

/** A machine-readable architecture summary of the Design System. */
export function getArchitecture(registry?: Registry) {
  const reg = r(registry);
  return {
    name: 'plantasonic-design-system',
    sdkVersion: SDK_VERSION,
    metadataSpecVersion: METADATA_SPEC_VERSION,
    generatedAt: new Date().toISOString(),
    summary: reg.summary(),
    categories: {
      component: reg.categories('component'),
      primitive: reg.categories('primitive'),
      layout: reg.categories('layout'),
      pattern: reg.categories('pattern'),
      token: reg.categories('token'),
    },
    layers: [
      { id: 'tokens', purpose: 'W3C design tokens → CSS variables + SCSS.' },
      { id: 'primitives', purpose: 'Composable layout building blocks (Layer 9).' },
      { id: 'components', purpose: 'Token-driven component library (Layer 1).' },
      { id: 'motion', purpose: 'Token-driven motion system (Layer 3).' },
      { id: 'patterns', purpose: 'Reusable product patterns (Layer 5).' },
      { id: 'layouts', purpose: 'Application + instrument shell layouts (Layer 2).' },
      { id: 'shell', purpose: 'Application Shell — chrome, navigation, commands.' },
      { id: 'instrument', purpose: 'Creative application framework (regions, transport, canvas).' },
      { id: 'app', purpose: 'createApplication() SDK (Layer 10).' },
      { id: 'ai', purpose: 'Registry, SDK, validation, generators, knowledge graph.' },
    ],
    deprecated: reg.deprecated().map((d) => d.id),
  };
}

export interface DocOptions {
  registry?: Registry;
}

/** Render a single metadata record as a Markdown section. */
function renderRecordDoc(record: AnyMetadata): string {
  const lines: string[] = [`### ${record.name} \`${record.id}\``, ''];
  lines.push(`> ${record.purpose}`, '');
  lines.push(`- **Status:** ${record.status} · **Category:** ${record.category} · **Version:** ${record.version}`);
  if (record.source) lines.push(`- **Source:** \`${record.source}\``);
  const c = record as ComponentMetadata;
  if (c.variants?.length) lines.push(`- **Variants:** ${c.variants.join(', ')}`);
  if (c.props?.length) {
    lines.push('', '| Prop | Type | Required | Default |', '| --- | --- | --- | --- |');
    for (const p of c.props) {
      lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.required ? 'yes' : ''} | ${p.default ? `\`${p.default}\`` : ''} |`);
    }
  }
  if (record.accessibility?.role || record.accessibility?.wcag?.length) {
    lines.push('', `- **Accessibility:** role \`${record.accessibility.role ?? '—'}\`${record.accessibility.wcag?.length ? ` · WCAG ${record.accessibility.wcag.join(', ')}` : ''}`);
  }
  if (record.examples?.length) {
    lines.push('', '```typescript', ...record.examples.map((e) => e.code), '```');
  }
  lines.push('');
  return lines.join('\n');
}

/**
 * Generate documentation from the registry. Returns a map of `name → markdown`
 * so callers can write whichever documents they need. Removes the need to
 * hand-maintain catalogs.
 */
export function generateDocumentation(options: DocOptions = {}): Record<string, string> {
  const reg = r(options.registry);
  const docs: Record<string, string> = {};

  const sectionFor = (title: string, records: AnyMetadata[]) =>
    [`# ${title}`, '', `Generated from the registry. ${records.length} entries.`, '', ...records.map(renderRecordDoc)].join('\n');

  docs['COMPONENT_CATALOG.md'] = sectionFor('Component Catalog', reg.components());
  docs['LAYOUT_CATALOG.md'] = sectionFor('Layout Catalog', reg.layouts());
  docs['PATTERN_CATALOG.md'] = sectionFor('Pattern Catalog', reg.patterns());

  const tokens = reg.tokens() as TokenMetadata[];
  docs['TOKEN_REFERENCE.md'] = [
    '# Token Reference',
    '',
    `Generated from the registry. ${tokens.length} tokens.`,
    '',
    '| Token | CSS variable | Category | Dark | Light |',
    '| --- | --- | --- | --- | --- |',
    ...tokens.map((t) => `| \`${t.path}\` | \`${t.cssVar}\` | ${t.category} | \`${t.values.dark ?? '—'}\` | \`${t.values.light ?? '—'}\` |`),
    '',
  ].join('\n');

  const arch = getArchitecture(reg);
  docs['ARCHITECTURE.md'] = [
    '# Design System Architecture (Generated)',
    '',
    '```json',
    JSON.stringify(arch, null, 2),
    '```',
    '',
  ].join('\n');

  return docs;
}

export { validateApplication };
