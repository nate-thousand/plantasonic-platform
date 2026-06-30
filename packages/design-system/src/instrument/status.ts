/**
 * Creative output layer — applications register metrics, the Design System
 * displays them consistently. Presets cover FPS / CPU / GPU / Audio / MIDI /
 * Memory / Renderer / Latency / Recording / Streaming. Output reuses the
 * existing `.ps-status-bar`, `.ps-performance-overlay`, and `.ps-meter` surfaces.
 */

import { attrs, classList, escapeHtml } from './internal.ts';

export type MetricValue = number | string;

export type Metric = {
  id: string;
  label: string;
  /** Current value provider (called each update). */
  get: () => MetricValue;
  /** Format the value for display. */
  format?: (value: MetricValue) => string;
  /** Optional 0..1 ratio to render a meter bar. */
  meter?: () => number;
  /** Visual hint for meter coloring. */
  kind?: 'default' | 'cpu';
  /** Optional unit suffix appended to formatted value. */
  unit?: string;
};

export type MetricsRegistry = {
  registerMetric(metric: Metric): MetricsRegistry;
  unregisterMetric(id: string): MetricsRegistry;
  getMetrics(): Metric[];
  snapshot(): Record<string, string>;
  renderStatusBar(): string;
  renderHud(): string;
};

function formatValue(metric: Metric): string {
  const raw = metric.get();
  const base = metric.format ? metric.format(raw) : String(raw);
  return metric.unit ? `${base} ${metric.unit}` : base;
}

export function createMetrics(initial: Metric[] = []): MetricsRegistry {
  const metrics = new Map<string, Metric>();
  for (const m of initial) metrics.set(m.id, m);

  const registry: MetricsRegistry = {
    registerMetric(metric) {
      metrics.set(metric.id, metric);
      return registry;
    },
    unregisterMetric(id) {
      metrics.delete(id);
      return registry;
    },
    getMetrics() {
      return [...metrics.values()];
    },
    snapshot() {
      const out: Record<string, string> = {};
      for (const m of metrics.values()) out[m.id] = formatValue(m);
      return out;
    },
    renderStatusBar() {
      return renderStatusBar(registry.getMetrics());
    },
    renderHud() {
      return renderHud(registry.getMetrics());
    },
  };
  return registry;
}

function metricSpan(metric: Metric): string {
  return `<span class="ps-status-bar__metric" data-ps-metric="${escapeHtml(metric.id)}">
  <span class="ps-status-bar__label">${escapeHtml(metric.label)}</span>
  <span class="ps-status-bar__value" data-ps-metric-value="${escapeHtml(metric.id)}">${escapeHtml(formatValue(metric))}</span>
</span>`;
}

/** Render metrics into a `.ps-status-bar`. */
export function renderStatusBar(metrics: Metric[]): string {
  const rootAttrs = attrs({ class: 'ps-status-bar', 'data-ps-status-bar': true, role: 'status', 'aria-label': 'Status' });
  return `<div ${rootAttrs}>${metrics.map(metricSpan).join('<span class="ps-status-bar__spacer"></span>')}</div>`;
}

/** Render metrics into a `.ps-performance-overlay` HUD (with meters where provided). */
export function renderHud(metrics: Metric[]): string {
  const rows = metrics
    .map((metric) => {
      const meter = metric.meter
        ? `<span class="${classList('ps-meter', metric.kind === 'cpu' && 'ps-meter--cpu')}" data-ps-metric-meter="${escapeHtml(metric.id)}"><span class="ps-meter__bar" style="width:${Math.round(clamp01(metric.meter()) * 100)}%"></span></span>`
        : '';
      return `<div class="ps-hud__metric" data-ps-metric="${escapeHtml(metric.id)}"><span>${escapeHtml(metric.label)}</span> <span data-ps-metric-value="${escapeHtml(metric.id)}">${escapeHtml(formatValue(metric))}</span>${meter}</div>`;
    })
    .join('');
  const rootAttrs = attrs({ class: 'ps-performance-overlay', 'data-ps-hud': true, role: 'status', 'aria-label': 'Performance' });
  return `<div ${rootAttrs}>${rows}</div>`;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
}

/**
 * Start a rAF-driven update loop that writes current metric values into the
 * rendered DOM (`[data-ps-metric-value]` + `[data-ps-metric-meter] .ps-meter__bar`).
 * Updates are throttled (default ~4/sec) to avoid layout thrash. Returns a stop
 * function. No-ops without `requestAnimationFrame`.
 */
export function startMetricsLoop(
  root: ParentNode | null | undefined,
  registry: MetricsRegistry,
  options: { intervalMs?: number } = {},
): () => void {
  if (!root || typeof requestAnimationFrame !== 'function') return () => {};
  const el = root as Element;
  const interval = options.intervalMs ?? 250;
  let raf = 0;
  let last = 0;
  let stopped = false;

  const tick = (now: number) => {
    if (stopped) return;
    if (now - last >= interval) {
      last = now;
      for (const metric of registry.getMetrics()) {
        const valueEl = el.querySelector(`[data-ps-metric-value="${cssEscape(metric.id)}"]`);
        if (valueEl) valueEl.textContent = formatValue(metric);
        if (metric.meter) {
          const bar = el.querySelector<HTMLElement>(`[data-ps-metric-meter="${cssEscape(metric.id)}"] .ps-meter__bar`);
          if (bar) bar.style.width = `${Math.round(clamp01(metric.meter()) * 100)}%`;
        }
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    stopped = true;
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf);
  };
}

function cssEscape(value: string): string {
  return value.replace(/["\\]/g, '\\$&');
}

// ── FPS sampler (built-in, since FPS can't be read directly) ──────────────────

/** Create an FPS sampler. Call the returned `frame()` once per rendered frame. */
export function createFpsSampler(): { fps: () => number; frame: () => void } {
  let frames = 0;
  let fps = 0;
  let last = typeof performance !== 'undefined' ? performance.now() : 0;
  return {
    fps: () => fps,
    frame: () => {
      frames += 1;
      const now = typeof performance !== 'undefined' ? performance.now() : last + 16;
      if (now - last >= 1000) {
        fps = Math.round((frames * 1000) / (now - last));
        frames = 0;
        last = now;
      }
    },
  };
}

// ── Metric presets ────────────────────────────────────────────────────────────

type Getter = () => MetricValue;

/**
 * Ready-made metric definitions. Supply a getter for the live value (and the
 * app owns sampling). Presets standardize labels, units, and formatting.
 */
export const METRIC_PRESETS = {
  fps: (get: () => number): Metric => ({ id: 'fps', label: 'FPS', get, format: (v) => String(Math.round(Number(v))), meter: () => clamp01(Number(get()) / 60) }),
  cpu: (get: () => number): Metric => ({ id: 'cpu', label: 'CPU', get, unit: '%', kind: 'cpu', format: (v) => String(Math.round(Number(v))), meter: () => clamp01(Number(get()) / 100) }),
  gpu: (get: () => number): Metric => ({ id: 'gpu', label: 'GPU', get, unit: '%', format: (v) => String(Math.round(Number(v))), meter: () => clamp01(Number(get()) / 100) }),
  audio: (get: Getter): Metric => ({ id: 'audio', label: 'Audio', get }),
  midi: (get: Getter): Metric => ({ id: 'midi', label: 'MIDI', get }),
  memory: (get: () => number): Metric => ({ id: 'memory', label: 'Memory', get, unit: 'MB', format: (v) => String(Math.round(Number(v))) }),
  renderer: (get: Getter): Metric => ({ id: 'renderer', label: 'Renderer', get }),
  latency: (get: () => number): Metric => ({ id: 'latency', label: 'Latency', get, unit: 'ms', format: (v) => String(Math.round(Number(v))) }),
  recording: (get: Getter): Metric => ({ id: 'recording', label: 'REC', get }),
  streaming: (get: Getter): Metric => ({ id: 'streaming', label: 'Stream', get }),
} as const;

export type MetricPresetName = keyof typeof METRIC_PRESETS;
