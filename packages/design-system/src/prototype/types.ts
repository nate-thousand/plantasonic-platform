/**
 * Plantasonic Design System — Prototype Platform types.
 *
 * Every new prototype is generated from a single command or brief and
 * automatically inherits tokens, theme, layout, components, motion,
 * accessibility, documentation, validation, and deployment setup.
 */

/** Official prototype type identifiers (kebab-case CLI ids). */
export type PrototypeType =
  | 'audio-reactive-installation'
  | 'generative-art'
  | 'visual-synth'
  | 'music-instrument'
  | 'ai-assistant'
  | 'interactive-object'
  | 'lighting-controller'
  | 'portfolio-demo'
  | 'presentation-prototype'
  | 'creative-tool'
  | 'data-visualization'
  | 'research-experiment';

/** Canvas / content renderer adapter. */
export type PrototypeRenderer = 'canvas' | 'html' | 'image' | 'video';

/** Shell layout id from the AI registry (e.g. layout.instrument). */
export type PrototypeLayoutId =
  | 'layout.instrument'
  | 'layout.canvas'
  | 'layout.studio'
  | 'layout.presentation'
  | 'layout.dashboard'
  | 'layout.workspace'
  | 'layout.landing'
  | 'layout.documentation'
  | 'layout.settings';

export type ShellVariant = 'standard' | 'instrument';

/** High-level API input for {@link createPrototype}. */
export interface CreatePrototypeConfig {
  type: PrototypeType;
  /** Display name (e.g. "Bloom Room"). */
  name: string;
  /** Override default layout from the type catalog. */
  layout?: PrototypeLayoutId;
  renderer?: PrototypeRenderer;
  sound?: boolean;
  midi?: boolean;
  touch?: boolean;
  /** Generate README, ROADMAP, CHANGELOG, validation checklist. */
  documentation?: boolean;
  /** Optional written brief — merged with keyword detection when present. */
  brief?: string;
}

/** Resolved plan produced before file generation. */
export interface PrototypePlan {
  type: PrototypeType;
  name: string;
  slug: string;
  title: string;
  description: string;
  layout: PrototypeLayoutId;
  shellVariant: ShellVariant;
  renderer: PrototypeRenderer;
  features: {
    sound: boolean;
    midi: boolean;
    touch: boolean;
    documentation: boolean;
  };
  /** Component ids from the design system registry. */
  components: string[];
  /** Inspector / panel definitions. */
  panels: PrototypePanelSpec[];
  /** Engine placeholder modules under src/engines/. */
  engines: PrototypeEngineSpec[];
  /** Suggested product patterns from the registry. */
  patterns: string[];
  roadmap: string[];
  validationChecklist: string[];
  brief?: string;
}

export interface PrototypePanelSpec {
  id: string;
  title: string;
  description: string;
}

export interface PrototypeEngineSpec {
  id: 'audio' | 'visual' | 'midi' | 'input' | 'ai';
  file: string;
  description: string;
  enabled: boolean;
}

/** Catalog entry for each official prototype type. */
export interface PrototypeTypeSpec {
  type: PrototypeType;
  name: string;
  purpose: string;
  defaultLayout: PrototypeLayoutId;
  shellVariant: ShellVariant;
  defaultRenderer: PrototypeRenderer;
  defaults: {
    sound: boolean;
    midi: boolean;
    touch: boolean;
    documentation: boolean;
  };
  components: string[];
  panels: PrototypePanelSpec[];
  patterns: string[];
  roadmap: string[];
}

export interface GeneratedPrototypeFile {
  path: string;
  content: string;
}

export interface CreatePrototypeResult {
  plan: PrototypePlan;
  files: GeneratedPrototypeFile[];
}

export interface PrototypeValidationReport {
  ok: boolean;
  checks: PrototypeValidationCheck[];
}

export interface PrototypeValidationCheck {
  id: string;
  label: string;
  ok: boolean;
  message?: string;
}
