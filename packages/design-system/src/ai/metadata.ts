/**
 * Plantasonic Design System — AI Metadata Specification.
 *
 * The machine-readable contract that makes the Design System understandable by
 * both humans and AI agents. Every exported element (component, primitive,
 * layout, pattern, token, theme, plugin) describes itself with structured
 * metadata so applications and AI tools can discover capabilities through the
 * {@link "./registry".Registry} and SDK instead of parsing source code.
 *
 * This module is the single source of truth for the metadata shape. The AI
 * context export (`scripts/generate-ai-context.mjs`) serializes records that
 * conform to these types into `generated/ai/*.json`.
 */

/** Lifecycle status for any registered element. */
export type Status = 'stable' | 'beta' | 'experimental' | 'deprecated' | 'planned';

/** The kind of element a metadata record describes. */
export type ElementKind =
  | 'component'
  | 'primitive'
  | 'layout'
  | 'pattern'
  | 'token'
  | 'theme'
  | 'plugin';

/** Theme identifiers shipped by the Design System. */
export type ThemeId = 'dark' | 'light' | (string & {});

/** A runnable or copy-pasteable usage example. */
export interface UsageExample {
  title: string;
  /** Source code for the example. */
  code: string;
  /** Language hint for syntax highlighting (default `typescript`). */
  language?: string;
  description?: string;
}

/** A single prop / option accepted by a component or pattern. */
export interface PropSpec {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description?: string;
  deprecated?: boolean;
  /** Replacement prop when deprecated. */
  replacement?: string;
}

/** A named content insertion point. */
export interface SlotSpec {
  name: string;
  description?: string;
  required?: boolean;
}

/** An event a component emits / a handler an application can bind. */
export interface EventSpec {
  name: string;
  /** Payload type expression. */
  payload?: string;
  description?: string;
}

/** Accessibility contract for an element. */
export interface AccessibilitySpec {
  /** Primary ARIA role. */
  role?: string;
  /** Keyboard interactions supported (e.g. `Enter activates`). */
  keyboard?: string[];
  /** ARIA attributes managed by the element. */
  aria?: string[];
  /** WCAG success criteria addressed (e.g. `1.4.3`). */
  wcag?: string[];
  notes?: string;
}

/** Responsive behavior contract. */
export interface ResponsiveSpec {
  /** Human + machine readable summary of how the element adapts. */
  behavior: string;
  /** Whether the element is container-query aware. */
  containerQueries?: boolean;
  /** Notes per breakpoint or size. */
  breakpoints?: Record<string, string>;
}

/** Motion behavior contract. */
export interface MotionSpec {
  /** Motion/transition tokens the element consumes. */
  tokens?: string[];
  /** How the element honors `prefers-reduced-motion`. */
  reducedMotion?: string;
  description?: string;
}

/** A historical change entry — feeds migration guides and release notes. */
export interface ChangeEntry {
  version: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'breaking';
  change: string;
}

/** Fields shared by every metadata record. */
export interface BaseMetadata {
  /** Stable, unique id (e.g. `component.button`). */
  id: string;
  /** Human-facing name. */
  name: string;
  kind: ElementKind;
  /** Version the element was introduced or last meaningfully changed. */
  version: string;
  /** What the element is for, in one sentence. */
  purpose: string;
  /** Grouping category (e.g. `controls`, `layout`, `feedback`). */
  category: string;
  status: Status;
  tags?: string[];
  /** Ids of other registered elements this one depends on. */
  dependencies?: string[];
  /** Themes the element is validated against. */
  supportedThemes?: ThemeId[];
  accessibility?: AccessibilitySpec;
  responsive?: ResponsiveSpec;
  motion?: MotionSpec;
  examples?: UsageExample[];
  /** Chronological change history. */
  migration?: ChangeEntry[];
  /** Subset of `migration` flagged as breaking. */
  breakingChanges?: ChangeEntry[];
  /** Documentation path or URL. */
  documentation?: string;
  /** Module specifier the element is exported from. */
  source?: string;
}

/** Metadata for a render function in the component or primitive library. */
export interface ComponentMetadata extends BaseMetadata {
  kind: 'component' | 'primitive';
  /** Exported function name (the public API). */
  export: string;
  props?: PropSpec[];
  slots?: SlotSpec[];
  events?: EventSpec[];
  variants?: string[];
  /** Layout ids this component is designed to live in (`*` = any). */
  supportedLayouts?: string[];
}

/** A region within a layout. */
export interface RegionSpec {
  name: string;
  description?: string;
  required?: boolean;
  /** Landmark role applied to the region. */
  role?: string;
}

/** Metadata for a registered application layout. */
export interface LayoutMetadata extends BaseMetadata {
  kind: 'layout';
  /** Shell variant this layout maps to. */
  variant?: string;
  regions: RegionSpec[];
  slots?: SlotSpec[];
  /** Component ids supported in this layout (`*` = any). */
  supportedComponents?: string[];
  /** Pattern ids commonly composed into this layout. */
  recommendedPatterns?: string[];
  recommendedWorkflows?: string[];
}

/** Metadata for a reusable product pattern. */
export interface PatternMetadata extends BaseMetadata {
  kind: 'pattern';
  /** Consumption API signature (SDK call or render entrypoint). */
  api?: string;
  slots?: SlotSpec[];
  /** Component / primitive ids the pattern is built from. */
  composedOf?: string[];
  /** Layout ids the pattern fits into. */
  supportedLayouts?: string[];
  recommendedWorkflows?: string[];
}

/** Metadata for a single design token. */
export interface TokenMetadata extends BaseMetadata {
  kind: 'token';
  /** CSS custom property name (e.g. `--ds-color-primary`). */
  cssVar: string;
  /** Token JSON dot-path (e.g. `color.primary.default`). */
  path: string;
  /** W3C token `$type`. */
  valueType?: string;
  /** Resolved values per theme. */
  values: Partial<Record<ThemeId, string>>;
  usage?: string;
  /** Other token paths that alias / reference this token. */
  aliases?: string[];
  deprecated?: boolean;
  /** Token path that replaces this one when deprecated. */
  replacement?: string;
  /** Where the token originated (e.g. `foundation`, `theme.dark`). */
  origin?: string;
  /** Figma variable reference, if synced. */
  figmaReference?: string;
}

/** Metadata for a theme. */
export interface ThemeMetadata extends BaseMetadata {
  kind: 'theme';
  /** CSS selector that activates the theme. */
  selector: string;
  /** Number of resolved tokens in the theme. */
  tokenCount: number;
}

/** Any metadata record. */
export type AnyMetadata =
  | ComponentMetadata
  | LayoutMetadata
  | PatternMetadata
  | TokenMetadata
  | ThemeMetadata;

// ── Authoring helpers (identity functions for type-checked records) ──────────

export function defineComponent(meta: ComponentMetadata): ComponentMetadata {
  return meta;
}

export function defineLayout(meta: LayoutMetadata): LayoutMetadata {
  return meta;
}

export function definePattern(meta: PatternMetadata): PatternMetadata {
  return meta;
}

export function defineToken(meta: TokenMetadata): TokenMetadata {
  return meta;
}

export function defineTheme(meta: ThemeMetadata): ThemeMetadata {
  return meta;
}

/** The current metadata specification version. Bump on breaking shape changes. */
export const METADATA_SPEC_VERSION = '1.0.0';
