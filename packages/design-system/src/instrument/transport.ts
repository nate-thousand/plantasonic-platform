/**
 * Transport framework — the Design System provides the UI; the application
 * provides the behavior.
 *
 * `renderTransport(config)` returns transport-bar HTML reusing the existing
 * `.ps-transport*` / `.ps-tempo-display` / `.ps-time-display` surfaces.
 * `bindTransport(root, handlers)` wires the DOM to app behavior and dispatches
 * `ps-transport-*` CustomEvents so multiple listeners can react.
 */

import { attrs, classList, escapeHtml } from './internal.ts';

export type TransportAction = 'play' | 'pause' | 'stop' | 'record' | 'loop';

export type TransportState = {
  playing: boolean;
  recording: boolean;
  looping: boolean;
  /** Beats per minute. */
  tempo: number;
  /** Transport position label (e.g. "00:00:000" or "1.1.0"). */
  time: string;
  /** Clock sync source label (e.g. "Internal", "MIDI", "Link"). */
  sync?: string;
  /** Performance mode flag. */
  performance?: boolean;
};

export const DEFAULT_TRANSPORT_STATE: TransportState = {
  playing: false,
  recording: false,
  looping: false,
  tempo: 120,
  time: '0.0.0',
  sync: 'Internal',
  performance: false,
};

export type TransportConfig = {
  state?: Partial<TransportState>;
  /** Show the record button (default true). */
  record?: boolean;
  /** Show the loop button (default true). */
  loop?: boolean;
  /** Show the tempo display (default true). */
  tempo?: boolean;
  /** Show the time/clock display (default true). */
  time?: boolean;
  /** Show the sync indicator (default true). */
  sync?: boolean;
  /** Show the performance-mode toggle (default true). */
  performance?: boolean;
};

export type TransportHandlers = Partial<
  Record<TransportAction, (state: TransportState) => void>
> & {
  performance?: (on: boolean, state: TransportState) => void;
  change?: (state: TransportState) => void;
};

function transportButton(action: TransportAction | 'performance', label: string, glyph: string, active = false, primary = false): string {
  const cls = classList(
    'ps-transport-btn',
    primary && 'ps-transport-btn--primary',
    action === 'record' && 'ps-transport-btn--record',
    active && 'ps-transport-btn--active',
  );
  return `<button type="button" class="${cls}" data-ps-transport="${action}" aria-pressed="${active}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"><span aria-hidden="true">${glyph}</span></button>`;
}

export function renderTransport(config: TransportConfig = {}): string {
  const state: TransportState = { ...DEFAULT_TRANSPORT_STATE, ...config.state };
  const show = {
    record: config.record !== false,
    loop: config.loop !== false,
    tempo: config.tempo !== false,
    time: config.time !== false,
    sync: config.sync !== false,
    performance: config.performance !== false,
  };

  const buttons = [
    transportButton('play', state.playing ? 'Pause' : 'Play', state.playing ? '❙❙' : '▶', state.playing, true),
    transportButton('stop', 'Stop', '■'),
    show.record ? transportButton('record', 'Record', '●', state.recording) : '',
    show.loop ? transportButton('loop', 'Loop', '↻', state.looping) : '',
  ].filter(Boolean).join('');

  const displays = [
    show.tempo
      ? `<div class="ps-tempo-display" data-ps-transport-tempo aria-label="Tempo"><span class="ps-tempo-display__value" data-ps-tempo-value>${state.tempo}</span> BPM</div>`
      : '',
    show.time
      ? `<div class="ps-time-display" data-ps-transport-time aria-label="Position"><span data-ps-time-value>${escapeHtml(state.time)}</span></div>`
      : '',
    show.sync && state.sync
      ? `<div class="ps-transport__sync" data-ps-transport-sync><span class="ps-status-dot" aria-hidden="true"></span><span data-ps-sync-value>${escapeHtml(state.sync)}</span></div>`
      : '',
  ].filter(Boolean).join('');

  const perf = show.performance
    ? transportButton('performance', 'Performance mode', '✦', !!state.performance)
    : '';

  const rootAttrs = attrs({
    class: 'ps-transport',
    'data-ps-transport-bar': true,
    role: 'toolbar',
    'aria-label': 'Transport',
  });

  return `<div ${rootAttrs}>${buttons}${displays ? `<div class="ps-transport__displays">${displays}</div>` : ''}${perf}</div>`;
}

type Cleanup = () => void;

/**
 * Wire a rendered transport to app behavior. Returns a cleanup function.
 * Toggles UI state, keeps an internal `TransportState`, calls handlers, and
 * dispatches `ps-transport-{action}` + `ps-transport-change` CustomEvents.
 */
export function bindTransport(
  root: ParentNode | null | undefined,
  handlers: TransportHandlers = {},
  initial: Partial<TransportState> = {},
): Cleanup {
  if (!root || typeof (root as Element).querySelectorAll !== 'function') return () => {};
  const bar = (root as Element).querySelector?.('[data-ps-transport-bar]') ?? (root as Element);
  const state: TransportState = { ...DEFAULT_TRANSPORT_STATE, ...initial };

  const emit = (name: string, detail: unknown) => {
    if (typeof CustomEvent === 'function' && bar instanceof EventTarget) {
      bar.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    }
  };

  const sync = () => {
    bar.querySelectorAll<HTMLElement>('[data-ps-transport]').forEach((btn) => {
      const action = btn.getAttribute('data-ps-transport') as TransportAction | 'performance';
      let active = false;
      if (action === 'play') active = state.playing;
      else if (action === 'record') active = state.recording;
      else if (action === 'loop') active = state.looping;
      else if (action === 'performance') active = !!state.performance;
      btn.classList.toggle('ps-transport-btn--active', active && action !== 'play');
      btn.setAttribute('aria-pressed', String(active));
      if (action === 'play') {
        const glyph = btn.querySelector('span');
        if (glyph) glyph.textContent = state.playing ? '❙❙' : '▶';
        btn.setAttribute('aria-label', state.playing ? 'Pause' : 'Play');
      }
    });
  };

  const onClick = (event: Event) => {
    const target = (event.target as Element)?.closest?.('[data-ps-transport]');
    if (!target) return;
    const action = target.getAttribute('data-ps-transport') as TransportAction | 'performance';
    switch (action) {
      case 'play':
        state.playing = !state.playing;
        handlers.play?.(state);
        break;
      case 'pause':
        state.playing = false;
        handlers.pause?.(state);
        break;
      case 'stop':
        state.playing = false;
        state.recording = false;
        handlers.stop?.(state);
        break;
      case 'record':
        state.recording = !state.recording;
        handlers.record?.(state);
        break;
      case 'loop':
        state.looping = !state.looping;
        handlers.loop?.(state);
        break;
      case 'performance':
        state.performance = !state.performance;
        handlers.performance?.(!!state.performance, state);
        break;
    }
    sync();
    emit(`ps-transport-${action}`, { ...state });
    emit('ps-transport-change', { ...state });
    handlers.change?.(state);
  };

  (bar as EventTarget).addEventListener?.('click', onClick);
  sync();
  return () => (bar as EventTarget).removeEventListener?.('click', onClick);
}
