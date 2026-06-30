/**
 * Plantasonic Design System — Layout primitives (Layer 9).
 *
 * Low-level, composable layout building blocks that render framework-agnostic
 * HTML strings. Every primitive is driven by spacing/size design tokens via
 * `.ds-l-*` classes and `--ds-l-*` custom properties — no hardcoded values.
 *
 * These primitives are the foundation of every higher-level layout and
 * component. They never apply color or typography beyond inherited tokens.
 */

/** Spacing scale tokens emitted to CSS (`--ds-space-*`). */
export type SpaceToken = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8';

export type AlignToken = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyToken = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

type BaseOptions = {
  /** Inner HTML string. */
  content?: string;
  /** HTML tag to render (defaults vary per primitive). */
  as?: string;
  /** Extra class names appended to the primitive class. */
  class?: string;
  /** Extra inline custom properties / styles. */
  style?: string;
  /** Optional accessible label (adds aria-label). */
  label?: string;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spaceVar(token: SpaceToken): string {
  return `var(--ds-space-${token})`;
}

const ALIGN_CSS: Record<AlignToken, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_CSS: Record<JustifyToken, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

function classList(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function styleAttr(props: Record<string, string | undefined>, extra?: string): string {
  const decls = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
  const combined = [decls, extra].filter(Boolean).join(' ');
  return combined ? ` style="${combined}"` : '';
}

function el(tag: string, cls: string, opts: BaseOptions, props: Record<string, string | undefined>): string {
  const label = opts.label ? ` aria-label="${escapeHtml(opts.label)}"` : '';
  return `<${tag} class="${classList(cls, opts.class)}"${styleAttr(props, opts.style)}${label}>${opts.content ?? ''}</${tag}>`;
}

// ── Stack — vertical rhythm ─────────────────────────────────────────────────

export type StackOptions = BaseOptions & {
  gap?: SpaceToken;
  align?: AlignToken;
  justify?: JustifyToken;
};

export function stack(options: StackOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-stack', options, {
    '--ds-l-gap': spaceVar(options.gap ?? '4'),
    '--ds-l-align': ALIGN_CSS[options.align ?? 'stretch'],
    '--ds-l-justify': JUSTIFY_CSS[options.justify ?? 'start'],
  });
}

// ── Inline — horizontal row ─────────────────────────────────────────────────

export type InlineOptions = BaseOptions & {
  gap?: SpaceToken;
  align?: AlignToken;
  justify?: JustifyToken;
  wrap?: boolean;
};

export function inline(options: InlineOptions = {}): string {
  return el(options.as ?? 'div', classList('ds-l-inline', options.wrap && 'ds-l-inline--wrap'), options, {
    '--ds-l-gap': spaceVar(options.gap ?? '2'),
    '--ds-l-align': ALIGN_CSS[options.align ?? 'center'],
    '--ds-l-justify': JUSTIFY_CSS[options.justify ?? 'start'],
  });
}

// ── Cluster — wrapping group ────────────────────────────────────────────────

export type ClusterOptions = BaseOptions & {
  gap?: SpaceToken;
  align?: AlignToken;
  justify?: JustifyToken;
};

export function cluster(options: ClusterOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-cluster', options, {
    '--ds-l-gap': spaceVar(options.gap ?? '2'),
    '--ds-l-align': ALIGN_CSS[options.align ?? 'center'],
    '--ds-l-justify': JUSTIFY_CSS[options.justify ?? 'start'],
  });
}

// ── Grid — responsive auto-fill grid ────────────────────────────────────────

export type GridOptions = BaseOptions & {
  gap?: SpaceToken;
  /** Minimum item width before wrapping (e.g. '16rem'). */
  minItemWidth?: string;
  /** Fixed column count (overrides minItemWidth). */
  columns?: number;
};

export function grid(options: GridOptions = {}): string {
  const columns = options.columns
    ? `repeat(${options.columns}, minmax(0, 1fr))`
    : `repeat(auto-fill, minmax(min(${options.minItemWidth ?? '14rem'}, 100%), 1fr))`;
  return el(options.as ?? 'div', 'ds-l-grid', options, {
    '--ds-l-gap': spaceVar(options.gap ?? '4'),
    '--ds-l-grid-template': columns,
  });
}

// ── Sidebar — sidebar + fluid main ──────────────────────────────────────────

export type SidebarOptions = BaseOptions & {
  gap?: SpaceToken;
  /** Sidebar width (e.g. '18rem'). */
  side?: string;
  /** Place sidebar on the right. */
  end?: boolean;
  /** Main content min width before wrapping. */
  contentMin?: string;
  /** Sidebar HTML. */
  sidebarContent?: string;
  /** Main HTML. */
  mainContent?: string;
};

export function sidebar(options: SidebarOptions = {}): string {
  const sideEl = `<div class="ds-l-sidebar__side">${options.sidebarContent ?? ''}</div>`;
  const mainEl = `<div class="ds-l-sidebar__main">${options.mainContent ?? options.content ?? ''}</div>`;
  const inner = options.end ? mainEl + sideEl : sideEl + mainEl;
  return `<div class="${classList('ds-l-sidebar', options.end && 'ds-l-sidebar--end', options.class)}"${styleAttr(
    {
      '--ds-l-gap': spaceVar(options.gap ?? '4'),
      '--ds-l-side-width': options.side ?? '18rem',
      '--ds-l-content-min': options.contentMin ?? '50%',
    },
    options.style,
  )}${options.label ? ` aria-label="${escapeHtml(options.label)}"` : ''}>${inner}</div>`;
}

// ── Split — two regions by ratio ────────────────────────────────────────────

export type SplitOptions = BaseOptions & {
  gap?: SpaceToken;
  /** Fraction for the first region, 0–1 (default 0.5). */
  fraction?: number;
  /** Stack vertically instead of horizontally. */
  vertical?: boolean;
  startContent?: string;
  endContent?: string;
};

export function split(options: SplitOptions = {}): string {
  const fr = Math.min(Math.max(options.fraction ?? 0.5, 0), 1);
  return `<div class="${classList('ds-l-split', options.vertical && 'ds-l-split--vertical', options.class)}"${styleAttr(
    {
      '--ds-l-gap': spaceVar(options.gap ?? '4'),
      '--ds-l-split-a': String(fr),
      '--ds-l-split-b': String(1 - fr),
    },
    options.style,
  )}>
    <div class="ds-l-split__a">${options.startContent ?? ''}</div>
    <div class="ds-l-split__b">${options.endContent ?? ''}</div>
  </div>`;
}

// ── Frame — fixed aspect ratio ──────────────────────────────────────────────

export type FrameOptions = BaseOptions & {
  ratio?: string;
};

export function frame(options: FrameOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-frame', options, {
    '--ds-l-ratio': options.ratio ?? '16 / 9',
  });
}

// ── Center — horizontally centered measure ──────────────────────────────────

export type CenterOptions = BaseOptions & {
  maxWidth?: string;
  gutter?: SpaceToken;
  /** Also center children along the horizontal axis. */
  intrinsic?: boolean;
};

export function center(options: CenterOptions = {}): string {
  return el(options.as ?? 'div', classList('ds-l-center', options.intrinsic && 'ds-l-center--intrinsic'), options, {
    '--ds-l-measure': options.maxWidth ?? '70ch',
    '--ds-l-gutter': spaceVar(options.gutter ?? '4'),
  });
}

// ── Cover — header / centered main / footer ─────────────────────────────────

export type CoverOptions = BaseOptions & {
  minHeight?: string;
  gap?: SpaceToken;
  headerContent?: string;
  mainContent?: string;
  footerContent?: string;
};

export function cover(options: CoverOptions = {}): string {
  return `<div class="${classList('ds-l-cover', options.class)}"${styleAttr(
    { '--ds-l-min-height': options.minHeight ?? '100vh', '--ds-l-gap': spaceVar(options.gap ?? '4') },
    options.style,
  )}>
    ${options.headerContent ? `<div class="ds-l-cover__top">${options.headerContent}</div>` : ''}
    <div class="ds-l-cover__main">${options.mainContent ?? options.content ?? ''}</div>
    ${options.footerContent ? `<div class="ds-l-cover__bottom">${options.footerContent}</div>` : ''}
  </div>`;
}

// ── Container — max-width wrapper ────────────────────────────────────────────

export type ContainerOptions = BaseOptions & {
  maxWidth?: string;
  gutter?: SpaceToken;
};

export function container(options: ContainerOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-container', options, {
    '--ds-l-max-width': options.maxWidth ?? '80rem',
    '--ds-l-gutter': spaceVar(options.gutter ?? '5'),
  });
}

// ── Surface — token-driven box ──────────────────────────────────────────────

export type SurfaceLevel = 'sunken' | 'default' | 'raised' | 'overlay';

export type SurfaceOptions = BaseOptions & {
  level?: SurfaceLevel;
  padding?: SpaceToken;
  radius?: 'sm' | 'default' | 'lg' | 'xl';
  border?: boolean;
};

const SURFACE_BG: Record<SurfaceLevel, string> = {
  sunken: 'var(--ds-color-surface-sunken)',
  default: 'var(--ds-color-surface-default)',
  raised: 'var(--ds-color-surface-raised)',
  overlay: 'var(--ds-color-surface-overlay)',
};

export function surface(options: SurfaceOptions = {}): string {
  return el(options.as ?? 'div', classList('ds-l-surface', options.border !== false && 'ds-l-surface--bordered'), options, {
    '--ds-l-surface-bg': SURFACE_BG[options.level ?? 'default'],
    '--ds-l-pad': spaceVar(options.padding ?? '4'),
    '--ds-l-radius': `var(--ds-radius-${options.radius ?? 'default'})`,
  });
}

// ── Section — spaced semantic block ─────────────────────────────────────────

export type SectionOptions = BaseOptions & {
  spacing?: SpaceToken;
};

export function section(options: SectionOptions = {}): string {
  return el(options.as ?? 'section', 'ds-l-section', options, {
    '--ds-l-spacing': spaceVar(options.spacing ?? '6'),
  });
}

// ── Region — labelled landmark ──────────────────────────────────────────────

export type RegionOptions = BaseOptions & {
  /** Landmark role (defaults to "region"). */
  role?: string;
};

export function region(options: RegionOptions = {}): string {
  const role = options.role ?? 'region';
  const label = options.label ? ` aria-label="${escapeHtml(options.label)}"` : '';
  return `<div class="${classList('ds-l-region', options.class)}" role="${escapeHtml(role)}"${label}${styleAttr({}, options.style)}>${
    options.content ?? ''
  }</div>`;
}

// ── Viewport — full-height, safe-area aware shell ───────────────────────────

export function viewport(options: BaseOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-viewport', options, {});
}

// ── Spacer — flexible or fixed gap ──────────────────────────────────────────

export type SpacerOptions = {
  /** Fixed size token; omit for a flexible (flex:1) spacer. */
  size?: SpaceToken;
  /** Render as a horizontal (inline) spacer. */
  axis?: 'block' | 'inline';
  class?: string;
};

export function spacer(options: SpacerOptions = {}): string {
  const fixed = options.size !== undefined;
  const cls = classList(
    'ds-l-spacer',
    fixed ? 'ds-l-spacer--fixed' : 'ds-l-spacer--flex',
    fixed && options.axis === 'inline' && 'ds-l-spacer--inline',
    options.class,
  );
  const props: Record<string, string | undefined> = fixed
    ? { '--ds-l-spacer-size': spaceVar(options.size as SpaceToken) }
    : {};
  return `<span class="${cls}" aria-hidden="true"${styleAttr(props)}></span>`;
}

// ── Inset — uniform padding box ─────────────────────────────────────────────

export type InsetOptions = BaseOptions & {
  padding?: SpaceToken;
};

export function inset(options: InsetOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-inset', options, {
    '--ds-l-pad': spaceVar(options.padding ?? '4'),
  });
}

// ── Flow — vertical flow spacing (lobotomized owl) ──────────────────────────

export type FlowOptions = BaseOptions & {
  gap?: SpaceToken;
};

export function flow(options: FlowOptions = {}): string {
  return el(options.as ?? 'div', 'ds-l-flow', options, {
    '--ds-l-flow-gap': spaceVar(options.gap ?? '3'),
  });
}

/** All primitive names — useful for documentation and tests. */
export const PRIMITIVE_NAMES = [
  'stack',
  'inline',
  'cluster',
  'grid',
  'sidebar',
  'split',
  'frame',
  'center',
  'cover',
  'container',
  'surface',
  'section',
  'region',
  'viewport',
  'spacer',
  'inset',
  'flow',
] as const;

export type PrimitiveName = (typeof PRIMITIVE_NAMES)[number];
