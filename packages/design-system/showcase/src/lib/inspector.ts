import { CSS_VAR_MAP } from '../data/catalog';
import { getComputedVar } from './tokens';

export type InspectPayload = {
  tag: string;
  classes: string;
  tokens: string[];
  aliases: string[];
  computed: Record<string, string>;
};

export function tokenPathsForCssVar(cssVar: string): string[] {
  return Object.entries(CSS_VAR_MAP)
    .filter(([, v]) => v === cssVar)
    .map(([k]) => k);
}

export function pathToSemanticAlias(path: string): string {
  return path.replace(/\./g, '/');
}

export function parseTokens(el: Element): string[] {
  const attr = el.getAttribute('data-ds-tokens');
  if (attr) return attr.split(',').map((t) => t.trim()).filter(Boolean);

  const styles = getComputedStyle(el);
  const found: string[] = [];
  for (const cssVar of Object.values(CSS_VAR_MAP)) {
    const val = styles.getPropertyValue(cssVar);
    if (val && val !== getComputedVar(cssVar)) {
      found.push(cssVar);
    }
  }
  return found.slice(0, 8);
}

export function inspectElement(el: Element): InspectPayload {
  const tokens = parseTokens(el);
  const computed: Record<string, string> = {};
  const styles = getComputedStyle(el);

  for (const token of tokens) {
    computed[token] = getComputedVar(token) || styles.getPropertyValue(token).trim();
  }

  computed['background-color'] = styles.backgroundColor;
  computed['color'] = styles.color;
  computed['border-color'] = styles.borderColor;
  computed['box-shadow'] = styles.boxShadow;
  computed['font-size'] = styles.fontSize;

  return {
    tag: el.tagName.toLowerCase(),
    classes: el.className?.toString?.() ?? '',
    tokens,
    aliases: tokens.flatMap((t) => tokenPathsForCssVar(t)).map(pathToSemanticAlias),
    computed,
  };
}

export function renderInspector(payload: InspectPayload | null): string {
  if (!payload) {
    return '<p class="small text-muted mb-0">Click any demo element to inspect tokens.</p>';
  }

  const tokenRows = payload.tokens
    .map((t) => `<tr><td><code>${t}</code></td><td><code>${payload.computed[t] ?? '—'}</code></td></tr>`)
    .join('');

  const computedRows = Object.entries(payload.computed)
    .filter(([k]) => !payload.tokens.includes(k))
    .map(([k, v]) => `<tr><td>${k}</td><td><code>${v}</code></td></tr>`)
    .join('');

  const aliasRows = payload.aliases.length
    ? `<div class="mb-2"><strong>Semantic aliases</strong><div class="font-monospace">${payload.aliases.join(', ')}</div></div>`
    : '';

  return `
    <div class="small">
      <div class="mb-2"><strong>&lt;${payload.tag}&gt;</strong></div>
      ${payload.classes ? `<div class="mb-2"><strong>Bootstrap classes</strong><code class="d-block">${payload.classes}</code></div>` : ''}
      ${aliasRows}
      ${tokenRows ? `<table class="table table-sm mb-2"><thead><tr><th>CSS variable</th><th>Value</th></tr></thead><tbody>${tokenRows}</tbody></table>` : ''}
      <table class="table table-sm mb-0"><thead><tr><th>Computed</th><th>Value</th></tr></thead><tbody>${computedRows}</tbody></table>
    </div>`;
}
