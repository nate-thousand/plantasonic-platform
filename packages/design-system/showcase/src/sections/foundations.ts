import { COLOR_GROUPS, CSS_VAR_MAP } from '../data/catalog';
import { getComputedVar, getTokenValue, pathToCssVar, resolvedTokens } from '../lib/tokens';
import { demoCard, docBlock, sectionHeader } from '../lib/ui';

const COLOR_USAGE: Record<string, string> = {
  'color.green.500': 'Primary actions, play, CTA',
  'color.green.700': 'Accent emphasis, active borders',
  'color.green.900': 'App background anchor',
  'color.text.primary': 'Body text — neutral, not green',
  'color.text.accent': 'Emphasis labels and highlights',
  'color.surface.stage': 'Visualizer canvas — darkest',
  'color.surface.dock': 'Bottom transport region',
  'color.status.error': 'Runtime errors only',
};

function colorSwatch(path: string): string {
  const cssVar = CSS_VAR_MAP[path] ?? pathToCssVar(path);
  const value = CSS_VAR_MAP[path] ? getComputedVar(cssVar) : getTokenValue(path);
  const alias = path.replace(/\./g, '/');
  const usage = COLOR_USAGE[path] ?? (CSS_VAR_MAP[path] ? 'Semantic token' : 'Foundation primitive');
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="ds-swatch card h-100" data-ds-inspect data-ds-tokens="${cssVar}" data-search="${path} ${cssVar}" style="--swatch-color: var(${cssVar}, ${value})">
        <div class="ds-swatch__color"></div>
        <div class="card-body p-2">
          <div class="small fw-semibold">${path.split('.').slice(-2).join('.')}</div>
          <code class="small d-block text-muted">${cssVar}</code>
          <code class="small d-block">${value}</code>
          <div class="ds-type-caption text-muted mt-1">${alias}</div>
          <div class="ds-type-caption mt-1">${usage}</div>
        </div>
      </div>
    </div>`;
}

export function renderColors(): string {
  const groups = Object.entries(COLOR_GROUPS)
    .map(
      ([name, paths]) => `
      <h2 class="h5 mt-4 mb-3">${name}</h2>
      <div class="row g-3">${paths.map(colorSwatch).join('')}</div>`,
    )
    .join('');

  return `
    ${sectionHeader('Colors', 'Foundation, semantic, status, accent, and overlay tokens.')}
    ${docBlock({
      purpose: 'Define the Plantasonic green instrument palette.',
      usage: 'Use semantic tokens (--ds-color-surface-*, --ds-color-text-*) in UI.',
      bestPractices: ['Body text uses text.primary (neutral)', 'Green reserved for actions and accent'],
      dos: ['Meet WCAG AA for text on surfaces', 'Use status tokens only for status UI'],
      donts: ['Use primary green for large body text blocks', 'Decorate with error/warning colors'],
      implementationNotes: ['Grouped: green, neutral, accent, surfaces, text, status, overlay'],
    })}
    ${groups}`;
}

export function renderTypography(): string {
  const samples = [
    { label: 'Display', cls: 'ds-type-display', tokens: ['--ds-font-size-display', '--ds-font-weight-headings'] },
    { label: 'H1', cls: 'ds-type-h1', tokens: ['--ds-font-size-h1'] },
    { label: 'H2', cls: 'ds-type-h2', tokens: ['--ds-font-size-h2'] },
    { label: 'H3', cls: 'ds-type-h3', tokens: ['--ds-font-size-h3'] },
    { label: 'Body', cls: 'ds-type-body', tokens: ['--ds-font-size-body', '--ds-line-height-relaxed'] },
    { label: 'Body SM', cls: 'ds-type-body-sm', tokens: ['--ds-font-size-body-sm'] },
    { label: 'Caption', cls: 'ds-type-caption', tokens: ['--ds-font-size-caption'] },
    { label: 'Label', cls: 'ds-type-label', tokens: ['--ds-font-size-label', '--ds-letter-spacing-label'] },
    { label: 'Overline', cls: 'ds-type-overline', tokens: ['--ds-font-size-overline', '--ds-letter-spacing-overline'] },
    { label: 'Monospace', cls: 'ds-type-mono font-monospace', tokens: ['--ds-font-family-mono', '--ds-font-weight-mono'] },
  ];

  return `
    ${sectionHeader('Typography', 'Helvetica for UI chrome, DM Mono for technical values.')}
    ${docBlock({
      purpose: 'Readable instrument UI with technical monospace accents.',
      usage: 'Apply type scale via CSS variables. Headings use weight 600.',
      dos: ['Use relative rem units', 'Use mono for tempo, status, values'],
      donts: ['Mix arbitrary font sizes', 'Uppercase body copy'],
    })}
    ${samples
      .map(
        (s) => demoCard(
          s.label,
          `<p class="${s.cls} mb-0" data-ds-tokens="${s.tokens.join(',')}">The quick brown fox — 120 BPM</p>
           <dl class="row small mt-2 mb-0">${s.tokens.map((t) => `<dt class="col-5">${t}</dt><dd class="col-7">${getComputedVar(t)}</dd>`).join('')}</dl>`,
          s.tokens,
        ),
      )
      .join('')}`;
}

export function renderSpacing(): string {
  const spaces = ['0', '1', '2', '3', '4', '5', '6', '8'];
  return `
    ${sectionHeader('Spacing', '4px-based spacing scale.')}
    ${docBlock({
      purpose: 'Consistent layout rhythm.',
      usage: 'Use --ds-space-* for padding, margin, and gaps.',
      dos: ['Align to the spacing scale', 'Use --ds-space-3 (1rem) as default gutter'],
      donts: ['Insert arbitrary pixel gaps'],
    })}
    <div class="ds-spacing-ruler">
      ${spaces
        .map((s) => {
          const v = `--ds-space-${s}`;
          return `<div class="ds-spacing-row mb-3" data-ds-tokens="${v}">
            <div class="d-flex align-items-center gap-3">
              <code class="small" style="min-width:7rem">${v}</code>
              <div class="ds-spacing-bar" style="width:var(${v});height:var(--ds-space-3);background:var(--ds-color-primary)"></div>
              <span class="small text-muted">${getComputedVar(v)}</span>
            </div>
          </div>`;
        })
        .join('')}
    </div>
    <h2 class="h6 mt-4">Padding examples</h2>
    <div class="row g-3">
      ${['2', '3', '4']
        .map((s) => {
          const v = `--ds-space-${s}`;
          return `<div class="col-md-4"><div class="rounded border" style="padding:var(${v})" data-ds-tokens="${v}">
            <div class="small">padding: ${v}</div>
            <div style="background:var(--ds-color-surface-raised);height:2rem;border-radius:var(--ds-radius-sm)"></div>
          </div></div>`;
        })
        .join('')}
    </div>`;
}

export function renderRadius(): string {
  const radii = ['xs', 'sm', 'default', 'lg', 'xl', 'pill'];
  const samples = radii
    .map((r) => {
      const v = `--ds-radius-${r}`;
      return `<div class="col-lg-6 mb-4">
        <div class="small fw-semibold mb-2"><code>${v}</code> — ${getComputedVar(v)}</div>
        <div class="d-flex flex-wrap gap-3 align-items-center" data-ds-tokens="${v}">
          <div class="card px-3 py-2" style="border-radius:var(${v})">Card</div>
          <button type="button" class="btn btn-outline-secondary btn-sm" style="border-radius:var(${v})">Button</button>
          <input class="form-control form-control-sm" style="width:6rem;border-radius:var(${v})" placeholder="Input" />
          <span class="badge bg-secondary" style="border-radius:var(${r === 'pill' ? v : '--ds-radius-default'})">Chip</span>
        </div>
      </div>`;
    })
    .join('');

  return `
    ${sectionHeader('Radius', 'Border radius tokens on cards, buttons, inputs, and chips.')}
    ${docBlock({
      purpose: 'Soft organic corners for instrument UI.',
      usage: 'Cards and overlays use lg/xl. Controls use default/sm.',
      bestPractices: ['Use pill radius for tags and transport toggles'],
      dos: ['Use --ds-radius-default for buttons and inputs'],
      donts: ['Mix ad-hoc border-radius values'],
      implementationNotes: ['All radii resolve from foundation.tokens.json'],
    })}
    <div class="row">${samples}</div>`;
}

export function renderShadows(): string {
  const shadows = ['sm', 'md', 'lg', 'focus', 'glow-accent', 'stage-inset'];
  return `
    ${sectionHeader('Shadows', 'Elevation and focus shadows.')}
    ${docBlock({
      purpose: 'Depth hierarchy and focus visibility.',
      usage: 'Overlays use lg. Focus rings use --ds-shadow-focus.',
      dos: ['Use glow-accent for active preset cards'],
      donts: ['Stack multiple heavy shadows on chrome'],
    })}
    <div class="row g-4">
      ${shadows
        .map((s) => {
          const v = `--ds-shadow-${s}`;
          return `<div class="col-md-4">
            <div class="ds-shadow-demo p-4 rounded ds-shadow-hover" style="box-shadow:var(${v});background:var(--ds-color-surface-raised)" data-ds-tokens="${v}">
              <code>${v}</code>
              <div class="small text-muted mt-2">Hover to compare</div>
            </div>
          </div>`;
        })
        .join('')}
    </div>`;
}

export function renderMotion(): string {
  return `
    ${sectionHeader('Motion', 'Durations, easing, and interaction feedback.')}
    ${docBlock({
      purpose: 'Motion communicates state — never decoration alone.',
      usage: 'Use --ds-transition-base for most interactions. Respect prefers-reduced-motion.',
      bestPractices: ['Test with reduced motion toggle in header'],
      dos: ['Use token durations and easing curves'],
      donts: ['Animate the visualizer stage from UI layer', 'Use bounce or flashy transitions'],
      implementationNotes: ['Header toggle sets data-ds-reduced-motion on document root'],
    })}
    <h2 class="h6 mt-2">Press · hover</h2>
    <div class="row g-3 mb-4">
      ${['fast', 'base', 'slow']
        .map(
          (d) => `<div class="col-md-4">
            <button type="button" class="btn btn-primary w-100 ds-motion-demo ds-motion-press" data-ds-tokens="--ds-transition-${d},--ds-ease-out">
              ${d} (${getComputedVar(`--ds-transition-${d}`)})
            </button>
          </div>`,
        )
        .join('')}
    </div>
    <h2 class="h6">Fade · expand · collapse</h2>
    <div class="row g-3 mb-4">
      <div class="col-md-4"><button type="button" class="btn btn-outline-secondary w-100 ds-motion-fade" data-ds-tokens="--ds-transition-base">Fade toggle</button></div>
      <div class="col-md-4"><button type="button" class="btn btn-outline-secondary w-100 ds-motion-expand" data-ds-tokens="--ds-transition-base">Expand</button></div>
      <div class="col-md-4"><button type="button" class="btn btn-outline-secondary w-100" data-bs-toggle="collapse" data-bs-target="#motion-collapse">Collapse</button></div>
    </div>
    <div class="collapse mb-4" id="motion-collapse"><div class="card card-body small">Collapsible panel using Bootstrap + token transitions.</div></div>
    ${demoCard(
      'Easing curves',
      `<div class="row g-2">
        ${['out', 'in', 'in-out'].map((e) => `<div class="col-md-4"><div class="ds-ease-bar" style="transition:width 1s var(--ds-ease-${e})" data-ds-tokens="--ds-ease-${e}"><span>--ds-ease-${e}</span></div></div>`).join('')}
      </div>`,
      ['--ds-ease-out', '--ds-ease-in', '--ds-ease-in-out'],
    )}`;
}

export function renderFoundationTokenCount(): number {
  return resolvedTokens.size;
}
