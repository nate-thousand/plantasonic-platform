function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return null;
}

function luminance([r, g, b]: [number, number, number]): number {
  const s = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * s[0]! + 0.7152 * s[1]! + 0.0722 * s[2]!;
}

export function contrastRatio(fg: string, bg: string): number | null {
  const f = parseRgb(fg);
  const b = parseRgb(bg);
  if (!f || !b) return null;
  const l1 = luminance(f);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number | null): string {
  if (ratio === null) return '—';
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function contrastRow(label: string, fgVar: string, bgVar: string, getVar: (v: string) => string): string {
  const fg = getVar(fgVar);
  const bg = getVar(bgVar);
  const ratio = contrastRatio(fg, bg);
  const level = wcagLevel(ratio);
  const pass = level !== 'Fail' && level !== '—';
  return `<tr data-ds-inspect data-ds-tokens="${fgVar},${bgVar}">
    <td>${label}</td>
    <td><code>${fgVar}</code></td>
    <td><code>${bgVar}</code></td>
    <td>${ratio?.toFixed(2) ?? '—'}:1</td>
    <td><span class="badge ${pass ? 'bg-success' : 'bg-danger'}">${level}</span></td>
    <td><div class="ds-contrast-swatch" style="color:var(${fgVar});background:var(${bgVar})">Aa</div></td>
  </tr>`;
}
