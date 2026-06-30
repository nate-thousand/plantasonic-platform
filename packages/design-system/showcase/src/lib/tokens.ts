import foundation from '@ds/tokens/foundation.tokens.json';
import themeDark from '@ds/tokens/theme.dark.tokens.json';
import { CSS_VAR_MAP } from '../data/catalog';

type TokenLeaf = { $type?: string; $value: unknown };

function flatten(node: unknown, prefix = '', out = new Map<string, TokenLeaf>()): Map<string, TokenLeaf> {
  if (typeof node === 'object' && node !== null && '$value' in node && !Array.isArray(node)) {
    out.set(prefix, node as TokenLeaf);
    return out;
  }
  if (typeof node !== 'object' || node === null || Array.isArray(node)) return out;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    flatten(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

function parseAlias(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const m = value.match(/^\{([^}]+)\}$/);
  return m ? m[1]! : null;
}

function resolve(flat: Map<string, TokenLeaf>): Map<string, unknown> {
  const resolved = new Map<string, unknown>();
  for (const [path, leaf] of flat) resolved.set(path, leaf.$value);

  let changed = true;
  while (changed) {
    changed = false;
    for (const [path, val] of [...resolved.entries()]) {
      const alias = parseAlias(val);
      if (!alias || !resolved.has(alias)) continue;
      const target = resolved.get(alias);
      if (parseAlias(target)) continue;
      resolved.set(path, target);
      changed = true;
    }
  }
  return resolved;
}

const foundationFlat = flatten(foundation);
const darkFlat = flatten(themeDark);
const merged = new Map([...foundationFlat, ...darkFlat]);
export const resolvedTokens = resolve(merged);

export function getCssVar(path: string): string | undefined {
  return CSS_VAR_MAP[path];
}

export function getComputedVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getAllCssVars(): { name: string; value: string }[] {
  const styles = getComputedStyle(document.documentElement);
  const vars: { name: string; value: string }[] = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!(rule instanceof CSSStyleRule)) continue;
        if (!rule.selectorText?.includes(':root') && !rule.selectorText?.includes('[data-theme')) continue;
        for (let i = 0; i < rule.style.length; i += 1) {
          const prop = rule.style[i]!;
          if (prop.startsWith('--')) {
            vars.push({ name: prop, value: styles.getPropertyValue(prop).trim() });
          }
        }
      }
    } catch {
      /* cross-origin stylesheet */
    }
  }
  const seen = new Set<string>();
  return vars.filter((v) => {
    if (seen.has(v.name)) return false;
    seen.add(v.name);
    return true;
  });
}

export function countTokens(): number {
  return Object.keys(CSS_VAR_MAP).length;
}

export function pathToCssVar(path: string): string {
  return CSS_VAR_MAP[path] ?? `--${path.replace(/\./g, '-')}`;
}

export function getTokenValue(path: string): string {
  const cssVar = CSS_VAR_MAP[path];
  if (cssVar) {
    const computed = getComputedVar(cssVar);
    if (computed) return computed;
  }
  const raw = resolvedTokens.get(path);
  if (typeof raw === 'string' && !raw.startsWith('{')) return raw;
  return '—';
}
