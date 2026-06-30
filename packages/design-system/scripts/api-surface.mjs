/**
 * Version 1.0 public API surface — authoritative classification.
 * Used by platform-audit.mjs, generate-api-surface.mjs, and stabilization tests.
 */
export const API_SURFACE_VERSION = '1.0.0';

export const PUBLIC_EXPORTS = [
  { path: './css/variables.css', stability: 'stable', category: 'tokens' },
  { path: './scss/bootstrap-theme.scss', stability: 'stable', category: 'scss' },
  { path: './scss/css-theme-bridge.scss', stability: 'stable', category: 'scss' },
  { path: './scss/bootstrap-components.scss', stability: 'stable', category: 'scss' },
  { path: './scss/bootstrap-utilities.scss', stability: 'stable', category: 'scss' },
  { path: './scss/plantasonic-components.scss', stability: 'stable', category: 'scss' },
  { path: './scss/navigation-framework.scss', stability: 'stable', category: 'scss' },
  { path: './scss/application-shell.scss', stability: 'stable', category: 'scss' },
  { path: './scss/primitives.scss', stability: 'stable', category: 'scss' },
  { path: './scss/components.scss', stability: 'stable', category: 'scss' },
  { path: './scss/motion.scss', stability: 'stable', category: 'scss' },
  { path: './scss/instrument.scss', stability: 'stable', category: 'scss' },
  { path: './scss/creative-workspace.scss', stability: 'stable', category: 'scss' },
  { path: './shell', stability: 'stable', category: 'runtime' },
  { path: './components', stability: 'stable', category: 'runtime' },
  { path: './primitives', stability: 'stable', category: 'runtime' },
  { path: './motion', stability: 'stable', category: 'runtime' },
  { path: './instrument', stability: 'stable', category: 'runtime' },
  { path: './creative-workspace', stability: 'stable', category: 'runtime' },
  { path: './app', stability: 'stable', category: 'runtime' },
  { path: './tokens/foundation.tokens.json', stability: 'stable', category: 'tokens' },
  { path: './tokens/theme.dark.tokens.json', stability: 'stable', category: 'tokens' },
  { path: './tokens/theme.light.tokens.json', stability: 'stable', category: 'tokens' },
  { path: './generated/css-vars.d.ts', stability: 'stable', category: 'types' },
  { path: './scss/_tokens.generated.scss', stability: 'stable', category: 'scss' },
];

export const STABLE_SDK_EXPORTS = [
  { path: './ai', stability: 'stable', category: 'sdk', note: 'Registry, validation, generators' },
  { path: './prototype', stability: 'stable', category: 'sdk', note: 'Prototype scaffolding' },
  { path: './platform', stability: 'stable', category: 'sdk', note: 'Ecosystem client infrastructure' },
  { path: './studio', stability: 'stable', category: 'sdk', note: 'Creative lifecycle orchestration' },
];

export const STABLE_GENERATED_EXPORTS = [
  { path: './generated/ai/index.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/components.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/layouts.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/patterns.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/tokens.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/themes.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/registry.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/knowledge-graph.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/architecture.json', stability: 'stable', category: 'generated' },
  { path: './generated/ai/compliance.json', stability: 'stable', category: 'generated' },
  { path: './generated/ecosystem/ecosystem.json', stability: 'stable', category: 'generated' },
  { path: './generated/ecosystem/engines.json', stability: 'stable', category: 'generated' },
  { path: './generated/studio/index.json', stability: 'stable', category: 'generated' },
];

/** Experimental — metadata-only patterns, engine stubs without npm packages. */
export const EXPERIMENTAL = [
  'engine.physics',
  'engine.particle',
  'engine.osc',
  'engine.camera',
  'pattern.search',
  'pattern.settings',
  'pattern.asset-browser',
  'pattern.project-picker',
  'pattern.workspace',
  'pattern.timeline',
  'pattern.media-library',
  'pattern.wizard',
];

/** Internal — not exported; apps must not import. */
export const INTERNAL_MODULES = [
  'src/shell/internal/navigation.ts',
  'src/instrument/internal.ts',
  'scripts/lib/tokens.mjs',
  'scripts/lib/ai-tokens.mjs',
];

/** Deprecated — retained for compatibility; do not use in new projects. */
export const DEPRECATED = [
  { id: 'ai-native-design-system', replacement: 'plantasonic-design-system', since: '1.0.0' },
  { id: 'layout.AppLayout.tsx', replacement: 'Application Shell (./shell)', since: '1.0.0' },
];

export function allStableExportPaths() {
  return [...PUBLIC_EXPORTS, ...STABLE_SDK_EXPORTS, ...STABLE_GENERATED_EXPORTS].map((e) => e.path);
}
