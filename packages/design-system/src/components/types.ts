/**
 * Plantasonic Design System — Component library shared utilities (Layer 1).
 */

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function classList(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(' ');
}

let uid = 0;
/** Stable-ish unique id for ARIA wiring when none is supplied. */
export function autoId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

export type Size = 'sm' | 'md' | 'lg';
