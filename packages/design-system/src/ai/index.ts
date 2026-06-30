/**
 * Plantasonic Design System — AI-native platform entrypoint.
 *
 * `plantasonic-design-system/ai` exposes the metadata specification, registry,
 * knowledge graph, validation engine, code generators, plugin architecture, and
 * the public SDK. Applications, build tools, and AI assistants consume the same
 * stable surface to discover, generate, validate, document, and govern UI built
 * on the Design System.
 */

// Metadata specification
export {
  METADATA_SPEC_VERSION,
  defineComponent,
  defineLayout,
  definePattern,
  defineToken,
  defineTheme,
  type Status,
  type ElementKind,
  type ThemeId,
  type UsageExample,
  type PropSpec,
  type SlotSpec,
  type EventSpec,
  type AccessibilitySpec,
  type ResponsiveSpec,
  type MotionSpec,
  type ChangeEntry,
  type BaseMetadata,
  type ComponentMetadata,
  type LayoutMetadata,
  type PatternMetadata,
  type TokenMetadata,
  type ThemeMetadata,
  type RegionSpec,
  type AnyMetadata,
} from './metadata.ts';

// Metadata records
export { COMPONENT_METADATA, PRIMITIVE_METADATA, ALL_COMPONENT_METADATA } from './components.ts';
export { LAYOUT_METADATA } from './layouts.ts';
export { PATTERN_METADATA } from './patterns.ts';
export { TOKEN_METADATA, THEME_METADATA } from './tokens.generated.ts';

// Registry + knowledge graph
export {
  Registry,
  registry,
  createDefaultRegistry,
  type RegistryQuery,
  type GraphEdge,
  type KnowledgeGraph,
  type ImpactReport,
} from './registry.ts';

// Validation engine
export {
  validateApplication,
  formatValidationReport,
  type RuleId,
  type Severity,
  type ApplicationFile,
  type Violation,
  type ValidationReport,
  type ValidationOptions,
} from './validate.ts';

// Code generators
export {
  generateComponent,
  generateLayout,
  generatePattern,
  generateTheme,
  generateWorkspace,
  generateApplication,
  generatePlugin,
  type GeneratedFile,
  type GenerateComponentOptions,
  type GenerateLayoutOptions,
  type GeneratePatternOptions,
  type GenerateThemeOptions,
  type GenerateWorkspaceOptions,
  type GenerateApplicationOptions,
  type GeneratePluginOptions,
} from './generators.ts';

// Plugin architecture
export {
  definePlugin,
  createPluginHost,
  type Plugin,
  type PluginContributions,
  type PluginCommand,
  type PluginDocumentation,
  type PluginAIIntegration,
  type PluginHost,
} from './plugin.ts';

// Public SDK
export {
  SDK_VERSION,
  getComponents,
  getComponent,
  getLayouts,
  getLayout,
  getPatterns,
  getPattern,
  getTokens,
  getToken,
  getThemes,
  query,
  getRegistry,
  getKnowledgeGraph,
  getImpact,
  getArchitecture,
  generateDocumentation,
  type DocOptions,
} from './sdk.ts';
