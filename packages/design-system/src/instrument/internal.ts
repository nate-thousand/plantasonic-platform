/**
 * Internal helpers for the instrument / creative application framework.
 * Node-safe (no runtime relative imports) so modules stay unit-testable.
 */

export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function classList(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

let idCounter = 0;
export function autoId(prefix = 'ps'): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}

/** Build an attribute string from a record, escaping values and skipping nullish. */
export function attrs(map: Record<string, string | number | boolean | undefined | null>): string {
  return Object.entries(map)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${escapeHtml(String(v))}"`))
    .join(' ');
}
